import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { Product } from "@/src/features/products/types/product.types";
import { formatCurrency } from "@/src/shared/utils/formatCurrency";

type ProductCardProps = {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductCard({
  product,
  onOpenDetails,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <Box className="rounded-xl border border-outline-200 bg-background-50 p-4">
      <VStack className="gap-3">
        <VStack className="gap-1">
          <Heading size="md">{product.name}</Heading>
          <Text size="sm">Categoria: {product.category}</Text>
          <Text className="text-typography-600" size="sm">
            {formatCurrency(product.price)}
          </Text>
        </VStack>

        <Button onPress={() => onOpenDetails(product)}>
          <ButtonText>Ver detalhes</ButtonText>
        </Button>

        <HStack className="gap-2">
          <Button
            variant="outline"
            action="secondary"
            className="flex-1"
            onPress={() => onEdit(product)}
          >
            <ButtonText>Editar</ButtonText>
          </Button>
          <Button
            variant="outline"
            action="negative"
            className="flex-1"
            onPress={() => onDelete(product)}
          >
            <ButtonText>Excluir</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
