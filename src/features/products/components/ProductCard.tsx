import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import { Box } from "@/src/components/ui/box";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { Product } from "@/src/features/products/types/product.types";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import { formatCurrency } from "@/src/shared/utils/formatCurrency";

type ProductCardProps = {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "roupas":
      return "hanger";
    case "calcados":
      return "shoe-sneaker";
    case "eletronicos":
      return "laptop";
    case "casa":
      return "sofa-outline";
    default:
      return "package-variant-closed";
  }
};

export function ProductCard({
  product,
  onOpenDetails,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <Pressable
      className="rounded-2xl border border-outline-200 bg-background-0 p-3 active:opacity-90"
      onPress={() => onOpenDetails(product)}
    >
      <HStack className="items-center gap-4">
        <Box className="size-20 items-center justify-center rounded-xl bg-tertiary-100">
          <MaterialCommunityIcons
            name={getCategoryIcon(product.category)}
            size={28}
            color="rgb(59 30 138)"
          />
        </Box>

        <VStack className="flex-1 gap-2">
          <Heading className="text-typography-950" size="sm">
            {product.name}
          </Heading>

          <HStack className="flex-wrap items-center gap-2">
            <RetailBadge
              label={product.category}
              tone="accent"
              className="border-tertiary-200 bg-tertiary-100"
              textClassName="normal-case tracking-normal"
            />
            <Text className="text-typography-600" size="sm">
              {formatCurrency(product.price)}
            </Text>
          </HStack>

          <Text className="text-typography-500" size="xs">
            {`SKU #${product.id}`}
          </Text>
        </VStack>

        <VStack className="gap-2">
          <Pressable
            className="size-9 items-center justify-center rounded-lg bg-tertiary-50 active:opacity-80"
            onPress={() => onEdit(product)}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color="rgb(59 30 138)"
            />
          </Pressable>

          <Pressable
            className="size-9 items-center justify-center rounded-lg bg-error-50 active:opacity-80"
            onPress={() => onDelete(product)}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="rgb(225 29 72)"
            />
          </Pressable>
        </VStack>
      </HStack>
    </Pressable>
  );
}
