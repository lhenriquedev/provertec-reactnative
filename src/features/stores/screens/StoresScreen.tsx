import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, TextInput } from "react-native";

import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { CreateStoreActionsheet } from "@/src/features/stores/components/CreateStoreActionsheet";
import { DeleteStoreAlertDialog } from "@/src/features/stores/components/DeleteStoreAlertDialog";
import { EditStoreActionsheet } from "@/src/features/stores/components/EditStoreActionsheet";
import { StoreList } from "@/src/features/stores/components/StoreList";
import { useStores } from "@/src/features/stores/hooks/useStores";
import type {
  Store,
  StoreInput,
} from "@/src/features/stores/types/store.types";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";

import { Heading } from "@/src/components/ui/heading";
import { getStoreErrorMessage } from "@/src/features/stores/utils/getStoreErrorMessage";
import { SafeAreaView } from "react-native-safe-area-context";

type StoresContentProps = {
  stores: Store[];
  hasFilters: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onCreate: () => void;
  onClearFilters: () => void;
  onOpenDetails: (store: Store) => void;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
};

function StoresContent({
  stores,
  hasFilters,
  isError,
  errorMessage,
  onRetry,
  onCreate,
  onClearFilters,
  onOpenDetails,
  onEdit,
  onDelete,
}: StoresContentProps) {
  if (isError) {
    return (
      <EmptyState
        title="Erro ao carregar lojas"
        description={
          errorMessage ?? "Nao foi possivel carregar a rede no momento."
        }
        actionLabel="Tentar novamente"
        onAction={onRetry}
      />
    );
  }

  if (stores.length === 0) {
    if (hasFilters) {
      return (
        <Box className="rounded-2xl border border-dashed border-outline-300 bg-background-50 px-6 py-10">
          <VStack className="items-center gap-4">
            <Box className="size-20 items-center justify-center rounded-full bg-background-100">
              <MaterialCommunityIcons
                name="store-search-outline"
                size={34}
                color="rgb(148 163 184)"
              />
            </Box>

            <VStack className="items-center gap-1">
              <Text bold className="text-center text-typography-950" size="lg">
                Nenhuma loja encontrada
              </Text>
              <Text className="text-center text-typography-600" size="sm">
                Ajuste os termos da busca para encontrar outra filial.
              </Text>
            </VStack>

            <Button
              variant="outline"
              action="secondary"
              onPress={onClearFilters}
            >
              <ButtonText>Limpar busca</ButtonText>
            </Button>
          </VStack>
        </Box>
      );
    }

    return (
      <EmptyState
        title="Nenhuma loja cadastrada"
        description="Crie a primeira loja para comecar a gerenciar a rede."
        actionLabel="Cadastrar loja"
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
  const [searchTerm, setSearchTerm] = useState("");

  const stores = useMemo(() => storesQuery.data ?? [], [storesQuery.data]);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredStores = useMemo(() => {
    if (!normalizedSearchTerm) {
      return stores;
    }

    return stores.filter((store) => {
      const normalizedName = store.name.toLowerCase();
      const normalizedAddress = store.address.toLowerCase();

      return (
        normalizedName.includes(normalizedSearchTerm) ||
        normalizedAddress.includes(normalizedSearchTerm)
      );
    });
  }, [normalizedSearchTerm, stores]);

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
    await updateStoreMutation.mutateAsync({
      storeId: editingStore.id,
      storeInput: values,
    });
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

  if (storesQuery.isLoading) {
    return <LoadingSpinner label="Carregando a rede de lojas" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <Box className="flex-1 bg-background-0">
        <Box className="border-b border-outline-300 bg-background-0 px-5 py-4">
          <HStack className="items-center gap-3">
            <Heading className="flex-1" size="md">
              Minhas Lojas
            </Heading>
          </HStack>
        </Box>

        <VStack className="flex-1 gap-4 px-4 pb-4 pt-3">
          <HStack className="h-12 items-center rounded-xl border border-outline-200 bg-background-50 px-3">
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color="rgb(148 163 184)"
            />
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Buscar por nome ou endereco..."
              placeholderTextColor="rgb(148 163 184)"
              className="flex-1 px-2 text-sm text-typography-900"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </HStack>

          <Box className="flex-1">
            <StoresContent
              stores={filteredStores}
              hasFilters={normalizedSearchTerm.length > 0}
              isError={storesQuery.isError}
              errorMessage={
                storesQuery.error
                  ? getStoreErrorMessage(storesQuery.error)
                  : undefined
              }
              onRetry={() => {
                void storesQuery.refetch();
              }}
              onCreate={() => setIsCreateOpen(true)}
              onClearFilters={() => setSearchTerm("")}
              onOpenDetails={openDetails}
              onEdit={setEditingStore}
              onDelete={setDeletingStore}
            />
          </Box>
        </VStack>
      </Box>

      <Pressable
        className="absolute bottom-4 right-6 size-14 items-center justify-center rounded-full bg-tertiary-700"
        style={{
          elevation: 8,
          shadowColor: "#1d0d46",
          shadowOpacity: 0.25,
          shadowRadius: 12,
        }}
        onPress={() => setIsCreateOpen(true)}
      >
        <MaterialCommunityIcons name="plus" size={30} color="white" />
      </Pressable>

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
    </SafeAreaView>
  );
}
