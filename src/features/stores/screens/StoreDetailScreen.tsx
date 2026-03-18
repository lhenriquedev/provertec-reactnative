import { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { DeleteStoreAlertDialog } from "@/src/features/stores/components/DeleteStoreAlertDialog";
import { EditStoreActionsheet } from "@/src/features/stores/components/EditStoreActionsheet";
import { useStoreDetails, useStores } from "@/src/features/stores/hooks/useStores";
import type { StoreInput } from "@/src/features/stores/types/store.types";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";

import { getStoreErrorMessage } from "@/src/features/stores/utils/getStoreErrorMessage";

export function StoreDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const storeId = typeof params.id === "string" ? params.id : "";
  const storeQuery = useStoreDetails(storeId);
  const { updateStoreMutation, deleteStoreMutation } = useStores();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const store = storeQuery.data;

  const handleEdit = async (values: StoreInput) => {
    if (!store) return;
    await updateStoreMutation.mutateAsync({ storeId: store.id, storeInput: values });
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    if (!store) return;
    await deleteStoreMutation.mutateAsync(store.id);
    setIsDeleteOpen(false);
    router.replace("/stores");
  };

  if (storeQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (storeQuery.isError || !store) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <EmptyState
          title="Loja nao encontrada"
          description={
            storeQuery.error
              ? getStoreErrorMessage(storeQuery.error)
              : "Nao foi possivel localizar os dados da loja."
          }
          actionLabel="Voltar para lojas"
          onAction={() => router.replace("/stores")}
        />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, padding: 20 }}>
        <VStack className="gap-4">
          <VStack className="gap-1">
            <Text className="text-typography-600" size="sm">
              Loja #{store.id}
            </Text>
            <Heading size="xl">{store.name}</Heading>
            <Text size="sm">{store.address}</Text>
          </VStack>

          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "#e4e4e7", padding: 16 }}>
            <VStack className="gap-2">
              <Text className="text-typography-600" size="sm">
                Resumo
              </Text>
              <Text>Produtos cadastrados: {store.productsCount}</Text>
            </VStack>
          </View>

          <Button onPress={() => router.push(`/stores/${store.id}/products` as never)}>
            <ButtonText>Ver produtos da loja</ButtonText>
          </Button>

          <Button variant="outline" action="secondary" onPress={() => setIsEditOpen(true)}>
            <ButtonText>Editar loja</ButtonText>
          </Button>

          <Button variant="outline" action="negative" onPress={() => setIsDeleteOpen(true)}>
            <ButtonText>Excluir loja</ButtonText>
          </Button>

          <Button variant="link" action="secondary" onPress={() => router.back()}>
            <ButtonText>Voltar</ButtonText>
          </Button>
        </VStack>
      </View>

      <EditStoreActionsheet
        store={isEditOpen ? store : null}
        isSubmitting={updateStoreMutation.isPending}
        errorMessage={
          updateStoreMutation.error
            ? getStoreErrorMessage(updateStoreMutation.error)
            : null
        }
        onClose={() => {
          updateStoreMutation.reset();
          setIsEditOpen(false);
        }}
        onSubmit={handleEdit}
      />

      <DeleteStoreAlertDialog
        store={isDeleteOpen ? store : null}
        isDeleting={deleteStoreMutation.isPending}
        errorMessage={
          deleteStoreMutation.error
            ? getStoreErrorMessage(deleteStoreMutation.error)
            : null
        }
        onClose={() => {
          deleteStoreMutation.reset();
          setIsDeleteOpen(false);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
