import { FlatList } from "react-native";

import { StoreCard } from "@/src/features/stores/components/StoreCard";
import type { Store } from "@/src/features/stores/types/store.types";

type StoreListProps = {
  stores: Store[];
  onOpenDetails: (store: Store) => void;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
};

export function StoreList({
  stores,
  onOpenDetails,
  onEdit,
  onDelete,
}: StoreListProps) {
  return (
    <FlatList
      data={stores}
      keyExtractor={(store) => store.id}
      contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
      renderItem={({ item }) => (
        <StoreCard
          store={item}
          onOpenDetails={onOpenDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
