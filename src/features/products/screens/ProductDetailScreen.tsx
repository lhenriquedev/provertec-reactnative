import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { DeleteProductAlertDialog } from "@/src/features/products/components/DeleteProductAlertDialog";
import { EditProductActionsheet } from "@/src/features/products/components/EditProductActionsheet";
import { useProductDetails, useProducts } from "@/src/features/products/hooks/useProducts";
import type {
  Product,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";
import { useStoreDetails } from "@/src/features/stores/hooks/useStores";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";
import { MetricCard } from "@/src/shared/components/MetricCard";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import { formatCurrency } from "@/src/shared/utils/formatCurrency";

import { getStoreErrorMessage } from "@/src/domain/stores/get-store-error-message";

export function ProductDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    productId?: string | string[];
  }>();
  const storeId = typeof params.id === "string" ? params.id : "";
  const productId = typeof params.productId === "string" ? params.productId : "";
  const storeQuery = useStoreDetails(storeId);
  const productQuery = useProductDetails(productId);
  const { updateProductMutation, deleteProductMutation } = useProducts({ storeId });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState(false);

  const store = storeQuery.data;
  const product = productQuery.data;

  const handleEdit = async (values: ProductUpdateInput) => {
    if (!product) return;
    await updateProductMutation.mutateAsync({ productId: product.id, productInput: values });
    updateProductMutation.reset();
    setEditingProduct(null);
  };

  const handleDelete = async () => {
    if (!product) return;

    await deleteProductMutation.mutateAsync(product.id);
    setDeletingProduct(false);
    deleteProductMutation.reset();
    router.replace(`/stores/${storeId}/products` as never);
  };

  if (storeQuery.isLoading || productQuery.isLoading) {
    return <LoadingSpinner label="Carregando o produto" />;
  }

  if (storeQuery.isError || !store || productQuery.isError || !product) {
    return (
      <Box className="flex-1 bg-background-0 px-5 py-5">
        <EmptyState
          title="Produto nao encontrado"
          description={
            storeQuery.error
              ? getStoreErrorMessage(storeQuery.error)
              : "Nao foi possivel localizar o produto selecionado."
          }
          actionLabel="Voltar para produtos"
          onAction={() => router.replace(`/stores/${storeId}/products` as never)}
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
                  <RetailBadge label={product.category} tone="accent" />
                  <RetailBadge label={`SKU #${product.id}`} tone="neutral" />
                </HStack>
                <Heading size="xl">{product.name}</Heading>
                <Text className="text-typography-700" size="sm">
                  {store.name}
                </Text>
              </VStack>

              <Box className="rounded-2xl border border-tertiary-300 bg-background-0 px-4 py-4">
                <Text className="text-typography-500" size="sm">
                  Preco cadastrado
                </Text>
                <Heading className="mt-1" size="2xl">
                  {formatCurrency(product.price)}
                </Heading>
              </Box>
            </VStack>
          </Box>

          <HStack className="flex-wrap gap-3">
            <MetricCard
              title="Categoria"
              value={product.category}
              helper="Segmento principal do item no catalogo"
              badge="mix"
              className="min-w-[48%]"
            />
            <MetricCard
              title="Loja vinculada"
              value={store.name}
              helper="Unidade atualmente responsavel pelo item"
              badge="rede"
              tone="accent"
              className="min-w-[48%]"
            />
          </HStack>

          {deleteProductMutation.error ? (
            <Text className="text-error-700" size="sm">
              Nao foi possivel excluir o produto.
            </Text>
          ) : null}

          <Box className="rounded-[28px] border border-outline-200 bg-background-50 p-5">
            <VStack className="gap-3">
              <VStack className="gap-1">
                <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                  Acoes do produto
                </Text>
                <Text bold className="text-typography-950" size="lg">
                  Atualize ou remova o item
                </Text>
              </VStack>

              <Button variant="outline" action="secondary" onPress={() => setEditingProduct(product)}>
                <ButtonText>Editar produto</ButtonText>
              </Button>

              <Button variant="outline" action="negative" onPress={() => setDeletingProduct(true)}>
                <ButtonText>Excluir produto</ButtonText>
              </Button>

              <Button variant="link" action="secondary" onPress={() => router.back()}>
                <ButtonText>Voltar para catalogo</ButtonText>
              </Button>
            </VStack>
          </Box>
        </ScrollView>
      </Box>

      <EditProductActionsheet
        product={editingProduct}
        isSubmitting={updateProductMutation.isPending}
        errorMessage={updateProductMutation.error ? "Nao foi possivel atualizar o produto." : null}
        onClose={() => {
          updateProductMutation.reset();
          setEditingProduct(null);
        }}
        onSubmit={handleEdit}
      />

      <DeleteProductAlertDialog
        product={deletingProduct ? product : null}
        isDeleting={deleteProductMutation.isPending}
        errorMessage={deleteProductMutation.error ? "Nao foi possivel excluir o produto." : null}
        onClose={() => {
          deleteProductMutation.reset();
          setDeletingProduct(false);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
