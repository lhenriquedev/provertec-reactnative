import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { DeleteStoreAlertDialog } from "@/src/features/stores/components/DeleteStoreAlertDialog";
import { CreateStoreActionsheet } from "@/src/features/stores/components/CreateStoreActionsheet";
import { EditStoreActionsheet } from "@/src/features/stores/components/EditStoreActionsheet";
import { StoreList } from "@/src/features/stores/components/StoreList";
import { useStores } from "@/src/features/stores/hooks/useStores";
import type { Store, StoreInput } from "@/src/features/stores/types/store.types";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";

import { getStoreErrorMessage } from "@/src/features/stores/utils/getStoreErrorMessage";

export function StoresScreen() {
  const {
    storesQuery,
    createStoreMutation,
    updateStoreMutation,
    deleteStoreMutation,
  } = useStores();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);

  const stores = storesQuery.data ?? [];

  const closeCreate = () => {
    createStoreMutation.reset();
    setIsCreateOpen(false);
  };

  const closeEdit = () => {
    updateStoreMutation.reset();
    setEditingStore(null);
  };

  const closeDelete = () => {
    deleteStoreMutation.reset();
    setDeletingStore(null);
  };

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

  const openDetails = (store: Store) => {
    router.push(`/stores/${store.id}` as never);
  };

  const renderContent = () => {
    if (storesQuery.isLoading) {
      return <LoadingSpinner />;
    }

    if (storesQuery.isError) {
      return (
        <EmptyState
          title="Erro ao carregar lojas"
          description={getStoreErrorMessage(storesQuery.error)}
          actionLabel="Tentar novamente"
          onAction={() => {
            void storesQuery.refetch();
          }}
        />
      );
    }

    if (stores.length === 0) {
      return (
        <EmptyState
          title="Nenhuma loja cadastrada"
          description="Crie a primeira loja para comecar a gerenciar o catalogo."
          actionLabel="Nova loja"
          onAction={() => setIsCreateOpen(true)}
        />
      );
    }

    return (
      <StoreList
        stores={stores}
        onOpenDetails={openDetails}
        onEdit={setEditingStore}
        onDelete={setDeletingStore}
      />
    );
  };

  return (
    <>
      <View style={{ flex: 1, padding: 20 }}>
        <VStack className="flex-1 gap-4">
          <VStack className="gap-1">
            <Heading size="xl">Lojas</Heading>
            <Text size="sm">Gerencie as lojas e navegue ate os produtos de cada uma.</Text>
          </VStack>

          <Button onPress={() => setIsCreateOpen(true)}>
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
