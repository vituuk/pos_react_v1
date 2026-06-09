"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  TrashIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { getProduct } from "@/hooks/use-product";
import type { Product } from "@/types/product";
import { useCategory } from "@/hooks/use-category";
import type { CategoryPayload } from "@/types/category";
import { toast } from "sonner";
import type { ICart } from "@/types/cart";
import SharedDialog from "@/components/SharedDialog";
import { useCreateOrder } from "@/hooks/useOrder";
import type { OrderPayload } from "@/services/order.service";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading/Loading";
import { useCheckTransaction, useCreatePayment } from "@/hooks/usePayment";
import { useSearchParams } from "react-router-dom";
import { getSettings } from "@/utils/settings";
import { formatPrice } from "@/utils/currency";

function playCheckoutSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Note 1 (E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain1.gain.setValueAtTime(0.1, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Note 2 (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.error("Failed to play sound:", e);
  }
}

export default function PosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const [cartItems, setCartItems] = useState<ICart[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(getSettings());

  // Listen for settings change dynamically
  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(getSettings());
    };
    window.addEventListener("settingsChanged", handleSettingsChange);
    return () => window.removeEventListener("settingsChanged", handleSettingsChange);
  }, []);

  const { data: productData } = getProduct(
    searchText,
    1,
    10,
    selectedCategory,
  );
  const { data: categoryData } = useCategory();
  const { mutate: checkTransactionMutate } = useCheckTransaction();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isSuccess) return;

    const timer = setTimeout(() => {
      setIsSuccess(false);
    }, 10000); // 10 sec

    return () => clearTimeout(timer);
  }, [isSuccess]);

  useEffect(() => {
    const timer = setTimeout(() => { }, 5000); // delay 5 sec

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const tranId = searchParams.get("tranId");
    if (tranId) {
      checkTransactionMutate(tranId, {
        onSuccess: () => {
          setSearchParams({});
        },
      });
    }
  }, [searchParams]);

  const products = (productData?.data as Product[]) ?? [];
  const categories = (categoryData?.data as CategoryPayload[]) ?? [];
  const allCategories = [
    {
      id: undefined,
      name: "All",
    },
    ...categories,
  ];
  console.log("products", products);

  const addToCart = (product: Product) => {
    console.log("add to order clicked");
    if (!settings.allowOutOfStock && product.qty <= 0) {
      toast.warning("Product out of stock");
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        if (!settings.allowOutOfStock && existingItem.qty >= existingItem.stock) {
          console.log("add to order clicked");
          toast.warning("Product out of stock");
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category?.name || "Uncategorized",
          price: Number(product.price),
          imageUrl: product.productImages?.[0]?.imageUrl || "/img/no-image.jpg",
          stock: product.qty,
          qty: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const discountAmount = subtotal * (settings.discountRate / 100);
  const taxAmount = (subtotal - discountAmount) * (settings.taxRate / 100);
  const total = subtotal - discountAmount + taxAmount;

  const updateQty = (id: number, qty: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id !== id) return item;

          const newQty = settings.allowOutOfStock ? qty : Math.min(qty, item.stock);

          if (newQty === 0) return null;
          return { ...item, qty: newQty };
        })
        .filter(Boolean) as ICart[];
    });
  };

  const { mutate: createOrderMutate } = useCreateOrder();
  const { mutate: createPaymentMutate } = useCreatePayment();
  const handlePlaceOrder = () => {
    setIsLoading(true);

    const payload: OrderPayload = {
      discount: discountAmount,
      items: cartItems.map((item) => ({
        productId: item.id,
        qty: item.qty,
      })),
    };

    createOrderMutate(payload, {
      onSuccess: (res) => {
        console.log("Res", res);
        const orderId = res.data.id;
        createPaymentMutate(orderId, {
          onSuccess: (res) => {
            if (res.data) {
              const payway = res.data.payway;

              const form = document.createElement("form");
              form.id = "aba_merchant_request";
              form.method = payway.method;
              form.action = payway.action;
              form.target = payway.target;
              Object.entries(payway.fields).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
              });

              document.body.appendChild(form);

              // Stop loading before opening payment popup so POS page stays visible
              setIsLoading(false);
              setIsOpen(false);

              // Register callback for when payment is actually completed
              window.checkout_callback = () => {
                setIsSuccess(true);
                setCartItems([]);
                if (settings.enableSounds) {
                  playCheckoutSound();
                }
                toast.success("Payment completed successfully!");
              };

              AbaPayway?.checkout();
            }
          },
          onError: () => {
            setIsLoading(false);
            toast.error("Failed to create payment");
          },
        });
      },
      onError: (error) => {
        console.error("Order error:", error);
        setIsLoading(false);
      },
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-[calc(100vh-85px)] overflow-hidden">
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex flex-1 flex-col min-h-0">
          {/* Header */}
          <div className="p-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Categories</h1>
              <Select
                value={selectedCategory === undefined ? "all" : String(selectedCategory)}
                onValueChange={(value) => {
                  setSelectedCategory(value === "all" ? undefined : Number(value));
                }}
              >
                <SelectTrigger className="w-[180px] rounded-[10px] bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-[10px]">
                  {allCategories.map((category) => (
                    <SelectItem
                      key={category.id === undefined ? "all" : String(category.id)}
                      value={category.id === undefined ? "all" : String(category.id)}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-auto p-6">

            <Input
              placeholder="Search your favorite foods..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-[500px] mb-4"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.map((item: Product) => (
                <Card
                  key={item.id}
                  className="cursor-pointer transition-shadow hover:shadow-lg p-0"
                  onClick={() => addToCart(item)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={
                          item.productImages?.[0]?.imageUrl ?? "/img/no-image.jpg"
                        }
                        alt={item.name}
                        className="object-fill w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/img/no-image.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground mb-2 text-sm">
                        {/* {item?.category?.name} */}
                        {item?.category?.name}
                      </p>

                      <div className="flex justify-between">
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(Number(item.price))}
                        </p>

                        <p className="text-sm font-bold text-gray-400">
                          Stock: {item.qty}
                        </p>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Order Summary */}
        <div className="flex w-80 flex-col border-l h-full min-h-0 overflow-hidden">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">All Orders</h2>
              <div className="flex items-center gap-2">
                <Plus className="text-muted-foreground h-4 w-4" />
                <Trash2
                  className=" h-4 w-4 text-red-500"
                  onClick={() => setCartItems([])}
                />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="space-y-3 p-4">
              {cartItems.map((item: ICart, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg border bg-card shadow-2xs hover:shadow-xs transition-shadow"
                >
                  {/* Fixed-size image box */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/img/no-image.jpg";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate">{item.category}</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">{formatPrice(item.price)}</p>
                  </div>

                  {/* Controls & Price */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <p className="text-xs font-bold text-foreground">{formatPrice(item.price * item.qty)}</p>

                    <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-md border border-border">
                      <Button
                        variant="ghost"
                        className="h-6 w-6 rounded-md p-0 hover:bg-background shrink-0"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        <MinusIcon className="h-3 w-3" />
                      </Button>

                      <span className="text-xs font-semibold min-w-4 text-center">{item.qty}</span>

                      <Button
                        variant="ghost"
                        className="h-6 w-6 rounded-md p-0 hover:bg-background shrink-0"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        className="h-6 w-6 rounded-md p-0 hover:bg-red-50 text-red-500 hover:text-red-600 shrink-0"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </ScrollArea>

          <div className="p-4">
            <div className="mb-4 space-y-2 border-t border-border/40 pt-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {settings.discountRate > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount ({settings.discountRate}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              {settings.taxRate > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax ({settings.taxRate}%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-foreground border-t border-border/40 pt-1 mt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsOpen(true)}
              className="w-full bg-slate-600 dark:bg-slate-300 py-3 text-white hover:bg-slate-500 hover:text-white dark:hover:bg-slate-600 border-none animate-pulse"
            >
              Checkout {formatPrice(total)}
            </Button>
          </div>
        </div>
      </div>

      <SharedDialog
        open={isOpen}
        setOpen={setIsOpen}
        isCancel={false}
        title="Order summary"
        desc="Please check the summary detail"
      >
        <div className="space-y-10">
          {cartItems.map((item: ICart, index: number) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-4 p-2 rounded-lg border bg-card/50"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/img/no-image.jpg";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{item.category}</p>
                <div className="flex gap-4 mt-1">
                  <p className="text-xs font-bold text-blue-600">{formatPrice(item.price)}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <p className="text-sm font-bold text-foreground">{formatPrice(item.price * item.qty)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-border/40 pt-4">
          <div className="text-right space-y-1">
            {settings.discountRate > 0 && (
              <p className="text-xs text-red-500">Discount ({settings.discountRate}%): -{formatPrice(discountAmount)}</p>
            )}
            {settings.taxRate > 0 && (
              <p className="text-xs text-muted-foreground">Tax ({settings.taxRate}%): {formatPrice(taxAmount)}</p>
            )}
            <p className="text-lg font-bold">Total: {formatPrice(total)}</p>
          </div>
        </div>

        <Button
          onClick={handlePlaceOrder}
          type="button"
          className="w-full mt-8"
        >
          Place Order
        </Button>
      </SharedDialog>

      <SharedDialog
        open={isSuccess}
        setOpen={setIsSuccess}
        isCancel={false}
        title="Order Success"
        width="35%"
      >
        <div className="flex flex-col items-center justify-center">
          <img
            className="w-[150px] h-[150px]"
            src="/tick-icon.png"
            alt="tick icon"
          />
          <p className="text-xl mt-8">Payment completed successfully</p>
        </div>
      </SharedDialog>
    </div>
  );
}