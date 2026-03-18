import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { DeleteStoreAlertDialog } from "@/src/features/stores/components/DeleteStoreAlertDialog";
import { EditStoreActionsheet } from "@/src/features/stores/components/EditStoreActionsheet";
import { useStoreDetails, useStores } from "@/src/features/stores/hooks/useStores";
import type { StoreInput } from "@/src/features/stores/types/store.types";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";
import { MetricCard } from "@/src/shared/components/MetricCard";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

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
    return <LoadingSpinner label="Carregando a loja" />;
  }

  if (storeQuery.isError || !store) {
    return (
      <Box className="flex-1 bg-background-0 px-5 py-5">
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
      </Box>
    );
  }

  return (
    <>
      <Box className="flex-1 bg-background-0">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 20 }}
        >
          <Box className="rounded-[32px] border border-tertiary-300 bg-tertiary-100 px-5 py-6">
            <VStack className="gap-5">
              <VStack className="gap-2">
                <HStack className="flex-wrap gap-2">
                  <RetailBadge label={`Loja #${store.id}`} tone="accent" />
                  <RetailBadge
                    label={store.productsCount > 0 ? "Catalogo ativo" : "Sem produtos"}
                    tone={store.productsCount > 0 ? "success" : "warning"}
                  />
                </HStack>
                <Heading size="xl">{store.name}</Heading>
                <Text className="text-typography-700" size="sm">
                  {store.address}
                </Text>
              </VStack>

              <Button onPress={() => router.push(`/stores/${store.id}/products` as never)}>
                <ButtonText>Ver produtos da loja</ButtonText>
              </Button>
            </VStack>
          </Box>

          <HStack className="flex-wrap gap-3">
            <MetricCard
              title="Catalogo local"
              value={`${store.productsCount} SKUs`}
              helper="Produtos atualmente vinculados a esta unidade"
              badge="mix"
              tone="accent"
              className="min-w-[48%]"
            />
            <MetricCard
              title="Status operacional"
              value={store.productsCount > 0 ? "Ativa" : "Em montagem"}
              helper={
                store.productsCount > 0
                  ? "A unidade ja participa da operacao comercial."
                  : "Cadastre produtos para ativar o painel da unidade."
              }
              badge="status"
              tone={store.productsCount > 0 ? "success" : "warning"}
              className="min-w-[48%]"
            />
          </HStack>

          <Box className="rounded-[28px] border border-outline-200 bg-background-50 p-5">
            <VStack className="gap-3">
              <VStack className="gap-1">
                <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                  Acoes da unidade
                </Text>
                <Text bold className="text-typography-950" size="lg">
                  Mantenha a operacao atualizada
                </Text>
              </VStack>

              <Button variant="outline" action="secondary" onPress={() => setIsEditOpen(true)}>
                <ButtonText>Editar dados da loja</ButtonText>
              </Button>

              <Button variant="outline" action="negative" onPress={() => setIsDeleteOpen(true)}>
                <ButtonText>Excluir loja</ButtonText>
              </Button>

              <Button variant="link" action="secondary" onPress={() => router.back()}>
                <ButtonText>Voltar para a rede</ButtonText>
              </Button>
            </VStack>
          </Box>
        </ScrollView>
      </Box>

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
