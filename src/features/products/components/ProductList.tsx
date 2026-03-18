import { FlatList } from "react-native";

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
    <FlatList
      data={products}
      keyExtractor={(product) => product.id}
      contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onOpenDetails={onOpenDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
