import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { Store } from "@/src/features/stores/types/store.types";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

type StoreCardProps = {
  store: Store;
  onOpenDetails: (store: Store) => void;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
};

export function StoreCard({
  store,
  onOpenDetails,
  onEdit,
  onDelete,
}: StoreCardProps) {
  return (
    <Box className="rounded-[28px] border border-outline-200 bg-background-50 p-5">
      <VStack className="gap-4">
        <HStack className="items-start justify-between gap-3">
          <VStack className="flex-1 gap-2">
            <VStack className="gap-1">
              <Heading size="md">{store.name}</Heading>
              <Text className="text-typography-600" size="sm">
                {store.address}
              </Text>
            </VStack>

            <HStack className="flex-wrap gap-2">
              <RetailBadge label="Loja" tone="accent" />
              <RetailBadge
                label={`${store.productsCount} produtos`}
                tone={store.productsCount > 0 ? "success" : "warning"}
              />
            </HStack>
          </VStack>

          <RetailBadge label={`#${store.id}`} tone="neutral" />
        </HStack>

        <Box className="rounded-2xl border border-outline-200 bg-background-0 px-4 py-4">
          <Text className="text-typography-500" size="sm">
            Catalogo desta unidade
          </Text>
          <Text bold className="mt-1 text-typography-950" size="xl">
            {store.productsCount} SKUs
          </Text>
        </Box>

        <Button onPress={() => onOpenDetails(store)}>
          <ButtonText>Abrir painel da loja</ButtonText>
        </Button>

        <HStack className="gap-2">
          <Button
            variant="outline"
            action="secondary"
            className="flex-1"
            onPress={() => onEdit(store)}
          >
            <ButtonText>Editar</ButtonText>
          </Button>
          <Button
            variant="outline"
            action="negative"
            className="flex-1"
            onPress={() => onDelete(store)}
          >
            <ButtonText>Excluir</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
