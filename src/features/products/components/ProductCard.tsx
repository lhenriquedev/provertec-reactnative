import { MaterialCommunityIcons } from "@expo/vector-icons";

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
    <Box className="rounded-[28px] border border-outline-200 bg-background-50 p-5">
      <VStack className="gap-4">
        <HStack className="items-start justify-between gap-3">
          <HStack className="flex-1 gap-3">
            <Box className="size-14 items-center justify-center rounded-2xl bg-tertiary-100">
              <MaterialCommunityIcons
                name={getCategoryIcon(product.category)}
                size={22}
                color="rgb(59 30 138)"
              />
            </Box>

            <VStack className="flex-1 gap-2">
              <HStack className="flex-wrap gap-2">
                <RetailBadge
                  label={product.category}
                  tone="accent"
                  className="border-tertiary-200 bg-tertiary-100"
                  textClassName="normal-case tracking-normal"
                />
                <RetailBadge
                  label={`SKU #${product.id}`}
                  tone="neutral"
                  textClassName="normal-case tracking-normal"
                />
              </HStack>

              <VStack className="gap-1">
                <Heading className="text-typography-950" size="md">
                  {product.name}
                </Heading>
                <Text className="text-typography-600" size="sm">
                  Item disponivel no catalogo desta loja.
                </Text>
              </VStack>
            </VStack>
          </HStack>

          <RetailBadge label="Ativo" tone="success" />
        </HStack>

        <Box className="rounded-[24px] border border-tertiary-200 bg-tertiary-50 px-4 py-4">
          <Text className="text-typography-500" size="sm">
            Preco de venda
          </Text>
          <Heading className="mt-1 text-typography-950" size="xl">
            {formatCurrency(product.price)}
          </Heading>
        </Box>

        <Button className="h-11 rounded-xl" onPress={() => onOpenDetails(product)}>
          <ButtonText>Ver produto</ButtonText>
        </Button>

        <HStack className="gap-2">
          <Button
            variant="outline"
            action="secondary"
            className="h-11 flex-1 rounded-xl"
            onPress={() => onEdit(product)}
          >
            <ButtonText>Editar</ButtonText>
          </Button>
          <Button
            variant="outline"
            action="negative"
            className="h-11 flex-1 rounded-xl"
            onPress={() => onDelete(product)}
          >
            <ButtonText>Excluir</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
