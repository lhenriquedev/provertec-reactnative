import { VStack } from "@/src/components/ui/vstack";
import { ProductCard } from "@/src/features/products/components/ProductCard";
import type { Product } from "@/src/features/products/types/product.types";

type ProductListProps = {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductList({
  products,
  onOpenDetails,
  onEdit,
  onDelete,
}: ProductListProps) {
  return (
    <VStack className="gap-4 pb-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenDetails={onOpenDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </VStack>
  );
}
