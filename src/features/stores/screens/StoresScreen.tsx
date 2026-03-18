import { useState } from "react";
import { router } from "expo-router";

import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
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
import { MetricCard } from "@/src/shared/components/MetricCard";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

import { getStoreErrorMessage } from "@/src/features/stores/utils/getStoreErrorMessage";

type StoresContentProps = {
  stores: Store[];
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onCreate: () => void;
  onOpenDetails: (store: Store) => void;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
};

function StoresContent({
  stores,
  isError,
  errorMessage,
  onRetry,
  onCreate,
  onOpenDetails,
  onEdit,
  onDelete,
}: StoresContentProps) {
  if (isError) {
    return (
      <EmptyState
        title="Erro ao carregar lojas"
        description={errorMessage ?? "Nao foi possivel carregar a rede no momento."}
        actionLabel="Tentar novamente"
        onAction={onRetry}
      />
    );
  }

  if (stores.length === 0) {
    return (
      <EmptyState
        title="Nenhuma loja cadastrada"
        description="Crie a primeira loja para comecar a gerenciar o catalogo."
        actionLabel="Nova loja"
        onAction={onCreate}
      />
    );
  }

  return (
    <StoreList
      stores={stores}
      onOpenDetails={onOpenDetails}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

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
  const totalProducts = stores.reduce((total, store) => total + store.productsCount, 0);
  const topStore = [...stores].sort((left, right) => right.productsCount - left.productsCount)[0];

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

  return (
    <>
      {storesQuery.isLoading ? (
        <LoadingSpinner label="Carregando a rede" />
      ) : (
        <Box className="flex-1 bg-background-0 px-5 py-5">
          <VStack className="flex-1 gap-4">
            <Box className="rounded-[32px] border border-tertiary-300 bg-tertiary-100 px-5 py-6">
              <VStack className="gap-5">
                <VStack className="gap-2">
                  <RetailBadge label="Rede de lojas" tone="accent" />
                  <Text bold className="text-typography-950" size="xl">
                    Acompanhe a expansao e a densidade do catalogo por unidade.
                  </Text>
                  <Text className="text-typography-700" size="sm">
                    Centralize criacao, edicao e acesso rapido ao painel operacional de cada loja.
                  </Text>
                </VStack>

                <Button onPress={() => setIsCreateOpen(true)}>
                  <ButtonText>Nova loja</ButtonText>
                </Button>
              </VStack>
            </Box>

            <HStack className="flex-wrap gap-3">
              <MetricCard
                title="Lojas cadastradas"
                value={String(stores.length)}
                helper={topStore ? `${topStore.name} lidera a rede hoje` : "Adicione a primeira unidade"}
                badge="rede"
                tone="accent"
                className="min-w-[48%]"
              />
              <MetricCard
                title="SKUs distribuidos"
                value={String(totalProducts)}
                helper="Soma total de produtos visiveis em todas as unidades"
                badge="mix"
                className="min-w-[48%]"
              />
            </HStack>

            <Box className="flex-1">
              <StoresContent
                stores={stores}
                isError={storesQuery.isError}
                errorMessage={storesQuery.error ? getStoreErrorMessage(storesQuery.error) : undefined}
                onRetry={() => {
                  void storesQuery.refetch();
                }}
                onCreate={() => setIsCreateOpen(true)}
                onOpenDetails={openDetails}
                onEdit={setEditingStore}
                onDelete={setDeletingStore}
              />
            </Box>
          </VStack>
        </Box>
      )}

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
