import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { Store } from "@/src/features/stores/types/store.types";

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
    <Box className="rounded-xl border border-outline-200 bg-background-50 p-4">
      <VStack className="gap-3">
        <VStack className="gap-1">
          <Heading size="md">{store.name}</Heading>
          <Text size="sm">{store.address}</Text>
          <Text className="text-typography-600" size="sm">
            Produtos cadastrados: {store.productsCount}
          </Text>
        </VStack>

        <Button onPress={() => onOpenDetails(store)}>
          <ButtonText>Ver detalhes</ButtonText>
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
