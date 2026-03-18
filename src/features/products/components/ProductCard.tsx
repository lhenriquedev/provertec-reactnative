import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
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

export function ProductCard({
  product,
  onOpenDetails,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <Box className="rounded-[28px] border border-outline-200 bg-background-50 p-5">
      <VStack className="gap-4">
        <HStack className="items-start justify-between gap-3">
          <VStack className="flex-1 gap-2">
            <VStack className="gap-1">
              <Heading size="md">{product.name}</Heading>
              <Text className="text-typography-600" size="sm">
                SKU #{product.id}
              </Text>
            </VStack>

            <HStack className="flex-wrap gap-2">
              <RetailBadge tone="neutral">{product.category}</RetailBadge>
              <RetailBadge tone="accent">{formatCurrency(product.price)}</RetailBadge>
            </HStack>
          </VStack>

          <RetailBadge label="Ativo" tone="success" />
        </HStack>

        <Box className="rounded-2xl border border-outline-200 bg-background-0 px-4 py-4">
          <Text className="text-typography-500" size="sm">
            Valor do item
          </Text>
          <Heading className="mt-1" size="lg">
            {formatCurrency(product.price)}
          </Heading>
        </Box>

        <Button onPress={() => onOpenDetails(product)}>
          <ButtonText>Ver produto</ButtonText>
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
