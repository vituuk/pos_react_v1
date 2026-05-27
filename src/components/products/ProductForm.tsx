import z from "zod";
("use client");
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategoryList } from "@/hooks/use-category";
import { useCreateProduct, useUpdateProduct ,useUploadProductImage,useDeleteProductImage} from "@/hooks/use-product";
import { useEffect, useState,useRef } from "react";
import { toast } from "sonner";
import type { Product, IProductImage, ProductPayload } from "@/types/product";
import type { Category } from "@/types/category";

import { Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";



export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().catch(""),
  color: z.string().catch(""),
  price: z.number().min(0, "Price must be 0 or more"),
  qty: z.number().int().min(0, "Quantity must be 0 or more"),
  categoryId: z
    .union([z.number().min(1, "Category is required"), z.undefined()])
    .refine((value) => value !== undefined, "Category is required"),
  is_active: z.boolean().catch(true),
});

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: Product | null;
}
const ProductForm = ({ open, setOpen, product }: Props) => {

  //file upload 
 const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

   const { mutate: uploadProductImageMutate } = useUploadProductImage();
  //end file upload
  // const { isLoading,set  IsLoading } = useProductAction();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useCategoryList();

  const { mutate: createProductMutate } = useCreateProduct();
  const { mutate: updateProductMutate } = useUpdateProduct();

  const { mutate: deleteProductImageMutate } = useDeleteProductImage();

  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      color: product?.color || "",
      price: product?.price ? Number(product.price) : 0,
      qty: product?.qty ? Number(product.qty) : 0,
      categoryId: product?.categoryId ?? undefined,
      is_active: product?.is_active ?? true,
    },
    validators: {
      onSubmit: productSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      if (product) {
        updateProductMutate(
          { id: product.id, request: value as ProductPayload },
          {

            onSuccess: (res) => {
              toast.success("Product updated successfully");
              if (res.data?.id) {
                uploadedFiles.map((file) =>
                  uploadProductImageMutate({ id: res.data.id, request: file }),
                );
              }
              // call to delete image ids
              console.log("delete image ids", deleteImageIds);
              deleteImageIds.map((imageId) =>
                deleteProductImageMutate({ id: imageId }, {
                  onSuccess: () => {
                    toast.success("Product image deleted successfully");
                  }
                }),
              );
              setOpen(false);
              setUploadedFiles([]);
              setDeleteImageIds([]);
              form.reset();
            },
            onSettled: () => {
              setIsLoading(false);
            },
          },
        );
      } else {
        createProductMutate(value as ProductPayload, {
          onSuccess: (res) => {
            // toast.success("Product created successfully");
              if (res.data.id) {
              uploadedFiles.forEach((file) => {
                uploadProductImageMutate({ id: res.data.id, request: file });
              });
            }

            setUploadedFiles([]);
            setOpen(false);
            form.reset();
          },
        });
      }
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));

  };

  useEffect(() => {
    if (product) {
      // When product changes (clicking edit on a different row), update the form value
      form.setFieldValue("name", product.name);
      form.setFieldValue("description", product.description);
      form.setFieldValue("color", product.color);
      form.setFieldValue("price", Number(product.price));
      form.setFieldValue("qty", Number(product.qty));
      form.setFieldValue("categoryId", product.categoryId);
      form.setFieldValue("is_active", product.is_active);
      setDeleteImageIds([]);
    } else {
      // Clear form when switching to create mode
      form.reset();
      setDeleteImageIds([]);
    }
  }, [product, form]);

  return (
    <div>
      {/* <div className="flex items-center gap-4">
    <Spinner/>
  </div> */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent key={product?.id ?? "create"} className="sm:max-w-sm max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>  {product ? "Update" : "Create"} Product</DialogTitle>
            <DialogDescription>Product Information Detail</DialogDescription>
          </DialogHeader>
          <form  key={product?.id ?? "create"}
            id="product-form"
            className="overflow-y-auto flex-1 px-1"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? { message: "Product name is required" }
                      : undefined,
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter product name"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Product Description
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter product description"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="color"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Product Color
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter product color"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* <form.Field
                name="price"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        type={"number"}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
                        aria-invalid={isInvalid}
                        placeholder="Enter product price"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="qty"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Qty</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        type={"number"}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
                        aria-invalid={isInvalid}
                        placeholder="Enter product quantity"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="categoryId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldLabel htmlFor="form-tanstack-select-language">
                            Category
                          </FieldLabel>

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.state.value ? String(field.state.value) : undefined}
                          onValueChange={(val) =>
                            field.handleChange(Number(val))
                          }
                        >
                          <SelectTrigger
                            id="form-tanstack-select-language"
                            aria-invalid={isInvalid}
                            className="w-full"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {data?.data.map(
                              (category: Category, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={String(category.id)}
                                >
                                  {category.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  }}
                />
              </div> */}

                <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="price"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          type={"number"}
                          onChange={(e) =>
                            field.handleChange(e.target.valueAsNumber)
                          }
                          aria-invalid={isInvalid}
                          placeholder="Enter price"
                        />
                           {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                                </Field>
                    );
                  }}
                />

                 <form.Field
                  name="qty"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          type={"number"}
                          onChange={(e) =>
                            field.handleChange(e.target.valueAsNumber)
                          }
                             aria-invalid={isInvalid}
                                placeholder="Enter quantity"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>

                <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="categoryId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldLabel htmlFor="form-tanstack-select-language">
                            Category
                          </FieldLabel>

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.state.value ? String(field.state.value) : undefined}
                          onValueChange={(val) =>
                            field.handleChange(Number(val))
                          }
                           > 

                          <SelectTrigger
                            id="form-tanstack-select-language"
                            aria-invalid={isInvalid}
                            className="w-full"
                          >
                            <SelectValue placeholder="Select the category" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                             {data?.data.map(
                              (category: Category, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={String(category.id)}
                                >
                                  {category.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  }}
                />
              </div>
 
     <div className="">
                <div
                  className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                  onClick={handleBoxClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="mb-2 bg-muted rounded-full p-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-pretty text-sm font-medium text-foreground">
                    Upload product image
                  </p>
                  <p className="text-pretty text-sm text-muted-foreground mt-1">
                    or,{" "}
                    <label
                      htmlFor="fileUpload"
                      className="text-primary hover:text-primary/90 font-medium cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      click to browse
                    </label>{" "}
                    (4MB max)
                  </p>
                  <input
                    type="file"
                    id="fileUpload"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </div>
              </div>

                {product?.productImages && product.productImages?.length > 0 && (
                <div className="space-y-2">
                  {product.productImages
                    .filter((image: IProductImage) => !deleteImageIds.includes(image.id))
                    .map((image: IProductImage, index: number) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg p-2 flex flex-col"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                            <img
                              src={image.imageUrl}
                              alt={image.fileName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 pr-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-foreground truncate max-w-[250px]">
                                  {image.fileName}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="bg-transparent! hover:text-red-500"
                                  type="button"
                                onClick={() => {
                                  setDeleteImageIds((prev) => [
                                    ...prev,
                                    image.id,
                                  ]);
                                }}

                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              <div
                className={cn(
                  "pb-5 space-y-3",
                  uploadedFiles.length > 0 ? "mt-4" : "",
                )}
              >
                {uploadedFiles.map((file, index) => {
                  const imageUrl = URL.createObjectURL(file);

                  return (
                    <div
                      className="border border-border rounded-lg p-2 flex flex-col"
                      key={file.name + index}
                      onLoad={() => {
                        return () => URL.revokeObjectURL(imageUrl);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 pr-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-foreground truncate max-w-[250px]">
                                {file.name}
                              </span>
                              <span className="text-sm text-muted-foreground whitespace-nowrap">
                                {Math.round(file.size / 1024)} KB
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="bg-transparent! hover:text-red-500"
                              onClick={() => removeFile(file.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FieldGroup>
          </form>
          <DialogFooter>
            <Field orientation="horizontal" className="flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-blue-500" type="submit" form="product-form" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductForm;
