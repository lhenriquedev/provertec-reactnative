import { FlatList } from "react-native";

import type { Store } from "@/src/domain/stores/types";

import { StoreListItem } from "@/src/components/stores/store-list-item";

type StoreListProps = {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
};

export function StoreList({ stores, onEdit, onDelete }: StoreListProps) {
  return (
    <FlatList
      data={stores}
      keyExtractor={(store) => store.id}
      contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
      renderItem={({ item }) => (
        <StoreListItem store={item} onEdit={onEdit} onDelete={onDelete} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
