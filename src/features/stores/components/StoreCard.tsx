import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { Store } from "@/src/features/stores/types/store.types";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import { useProducts } from "../../products/hooks/useProducts";

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
  const { productsQuery } = useProducts({ storeId: store.id });
  const products = productsQuery.data ?? [];

  return (
    <Box className="rounded-md border border-outline-200 bg-background-50 p-4">
      <VStack className="gap-4">
        <HStack className="items-start justify-between gap-3">
          <VStack className="flex-1 gap-2">
            <RetailBadge
              label={`${products.length} produtos`}
              tone="accent"
              className="self-start border-tertiary-200 bg-tertiary-100"
              textClassName="normal-case font-semibold tracking-normal text-tertiary-700"
            />

            <VStack className="gap-1">
              <Heading size="md" className="text-typography-950">
                {store.name}
              </Heading>
              <HStack className="items-start gap-1.5">
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={16}
                  color="rgb(100 116 139)"
                />
                <Text
                  className="flex-1 text-typography-600"
                  numberOfLines={2}
                  size="sm"
                >
                  {store.address}
                </Text>
              </HStack>
            </VStack>
          </VStack>

          <Box className="size-24 items-center justify-center rounded-lg border border-outline-200 bg-background-100">
            <MaterialCommunityIcons
              name="storefront-outline"
              size={30}
              color="rgb(100 116 139)"
            />
          </Box>
        </HStack>

        <HStack className="items-center gap-2 border-t border-outline-100 pt-3">
          <Button
            className="h-11 flex-1 rounded-lg border-0 bg-tertiary-100"
            onPress={() => onOpenDetails(store)}
          >
            <ButtonText className="text-tertiary-800">Ver detalhes</ButtonText>
          </Button>

          <Pressable
            className="size-11 items-center justify-center rounded-lg border border-outline-200 bg-background-100"
            onPress={() => onEdit(store)}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={18}
              color="rgb(100 116 139)"
            />
          </Pressable>

          <Pressable
            className="size-11 items-center justify-center rounded-lg border border-outline-200 bg-background-100"
            onPress={() => onDelete(store)}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={18}
              color="rgb(148 163 184)"
            />
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
}
