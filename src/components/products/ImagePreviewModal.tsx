import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { IProductImage } from "@/types/product";

interface ImagePreviewModalProps {
  images: IProductImage[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function ImagePreviewModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: ImagePreviewModalProps) {
  if (!images || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogTitle className="sr-only">Product Image Preview</DialogTitle>
        <div className="flex items-center justify-center">
          <img
            src={images[initialIndex]?.imageUrl ?? "/img/no-image.jpg"}
            alt={images[initialIndex]?.fileName ?? "Product image"}
            className="max-h-[70vh] w-auto object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
