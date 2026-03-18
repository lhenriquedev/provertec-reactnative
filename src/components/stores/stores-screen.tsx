import { useState } from "react";
import { View } from "react-native";

import { CreateStoreActionsheet } from "@/src/components/stores/create-store-actionsheet";
import { DeleteStoreAlertDialog } from "@/src/components/stores/delete-store-alert-dialog";
import { EditStoreActionsheet } from "@/src/components/stores/edit-store-actionsheet";
import { StoreEmptyState } from "@/src/components/stores/store-empty-state";
import { StoreErrorState } from "@/src/components/stores/store-error-state";
import { StoreList } from "@/src/components/stores/store-list";
import { StoreListSkeleton } from "@/src/components/stores/store-list-skeleton";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { getStoreErrorMessage } from "@/src/domain/stores/get-store-error-message";
import {
  useCreateStoreMutation,
  useDeleteStoreMutation,
  useUpdateStoreMutation,
} from "@/src/domain/stores/mutations";
import { useStoresQuery } from "@/src/domain/stores/queries";
import type { Store, StoreInput } from "@/src/domain/stores/types";

export function StoresScreen() {
  const storesQuery = useStoresQuery();
  const createStoreMutation = useCreateStoreMutation();
  const updateStoreMutation = useUpdateStoreMutation();
  const deleteStoreMutation = useDeleteStoreMutation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);

  const stores = storesQuery.data ?? [];

  const handleCreate = async (values: StoreInput) => {
    await createStoreMutation.mutateAsync(values);
    closeCreate();
  };

  const handleEdit = async (values: StoreInput) => {
    if (!editingStore) return;
    await updateStoreMutation.mutateAsync({ storeId: editingStore.id, storeInput: values });
    closeEdit();
  };

  const handleDelete = async () => {
    if (!deletingStore) return;
    await deleteStoreMutation.mutateAsync(deletingStore.id);
    closeDelete();
  };

  const openCreate = () => {
    createStoreMutation.reset();
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    createStoreMutation.reset();
    setIsCreateOpen(false);
  };

  const openEdit = (store: Store) => {
    updateStoreMutation.reset();
    setEditingStore(store);
  };

  const closeEdit = () => {
    updateStoreMutation.reset();
    setEditingStore(null);
  };

  const openDelete = (store: Store) => {
    deleteStoreMutation.reset();
    setDeletingStore(store);
  };

  const closeDelete = () => {
    deleteStoreMutation.reset();
    setDeletingStore(null);
  };

  const renderContent = () => {
    if (storesQuery.isLoading) return <StoreListSkeleton />;
    if (storesQuery.isError) {
      return (
        <StoreErrorState
          message={getStoreErrorMessage(storesQuery.error)}
          onRetry={() => storesQuery.refetch()}
        />
      );
    }
    if (stores.length === 0) return <StoreEmptyState onCreate={openCreate} />;
    return <StoreList stores={stores} onEdit={openEdit} onDelete={openDelete} />;
  };

  return (
    <>
      <View style={{ flex: 1, padding: 20 }}>
        <VStack className="flex-1 gap-4">
          <VStack className="gap-1">
            <Heading size="xl">Lojas</Heading>
            <Text size="sm">Gerencie as lojas cadastradas no sistema.</Text>
          </VStack>

          <Button onPress={openCreate}>
            <ButtonText>Nova loja</ButtonText>
          </Button>

          <View style={{ flex: 1 }}>{renderContent()}</View>
        </VStack>
      </View>

      <CreateStoreActionsheet
        isOpen={isCreateOpen}
        isSubmitting={createStoreMutation.isPending}
        errorMessage={
          createStoreMutation.error
            ? getStoreErrorMessage(createStoreMutation.error)
            : null
        }
        onClose={closeCreate}
        onSubmit={handleCreate}
      />

      <EditStoreActionsheet
        store={editingStore}
        isSubmitting={updateStoreMutation.isPending}
        errorMessage={
          updateStoreMutation.error
            ? getStoreErrorMessage(updateStoreMutation.error)
            : null
        }
        onClose={closeEdit}
        onSubmit={handleEdit}
      />

      <DeleteStoreAlertDialog
        store={deletingStore}
        isDeleting={deleteStoreMutation.isPending}
        errorMessage={
          deleteStoreMutation.error
            ? getStoreErrorMessage(deleteStoreMutation.error)
            : null
        }
        onClose={closeDelete}
        onConfirm={handleDelete}
      />
    </>
  );
}
