import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { CreateProductActionsheet } from "@/src/features/products/components/CreateProductActionsheet";
import { DeleteProductAlertDialog } from "@/src/features/products/components/DeleteProductAlertDialog";
import { EditProductActionsheet } from "@/src/features/products/components/EditProductActionsheet";
import { ProductList } from "@/src/features/products/components/ProductList";
import { useProducts } from "@/src/features/products/hooks/useProducts";
import type {
  Product,
  ProductInput,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";
import { useStoreDetails } from "@/src/features/stores/hooks/useStores";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";
import { MetricCard } from "@/src/shared/components/MetricCard";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import { formatCurrency } from "@/src/shared/utils/formatCurrency";

import { getStoreErrorMessage } from "@/src/domain/stores/get-store-error-message";

export function StoreProductsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const storeId = typeof params.id === "string" ? params.id : "";
  const storeQuery = useStoreDetails(storeId);
  const {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProducts({ storeId });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const store = storeQuery.data;
  const products = productsQuery.data ?? [];
  const averagePrice =
    products.length > 0
      ? products.reduce((total, product) => total + product.price, 0) /
        products.length
      : 0;
  const premiumProduct = [...products].sort(
    (left, right) => right.price - left.price,
  )[0];

  const handleCreate = async (values: ProductInput) => {
    await createProductMutation.mutateAsync(values);
    createProductMutation.reset();
    setIsCreateOpen(false);
  };

  const handleEdit = async (values: ProductUpdateInput) => {
    if (!editingProduct) return;

    await updateProductMutation.mutateAsync({
      productId: editingProduct.id,
      productInput: values,
    });
    updateProductMutation.reset();
    setEditingProduct(null);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    await deleteProductMutation.mutateAsync(deletingProduct.id);
    deleteProductMutation.reset();
    setDeletingProduct(null);
  };

  if (storeQuery.isLoading || productsQuery.isLoading) {
    return <LoadingSpinner label="Carregando o catalogo da loja" />;
  }

  if (storeQuery.isError || !store) {
    return (
      <Box className="flex-1 bg-background-0 px-5 py-5">
        <EmptyState
          title="Loja nao encontrada"
          description={
            storeQuery.error
              ? getStoreErrorMessage(storeQuery.error)
              : "Nao foi possivel carregar a loja selecionada."
          }
          actionLabel="Voltar para lojas"
          onAction={() => router.replace("/stores")}
        />
      </Box>
    );
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
        <Box className="flex-1 bg-background-0">
          <ScrollView
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 48 }}
          >
            <Box className="border-b border-outline-100 bg-background-0 px-5 py-4">
              <HStack className="items-center gap-3">
                <Pressable
                  className="size-10 items-center justify-center rounded-full bg-background-50 active:opacity-80"
                  onPress={() => router.back()}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={22}
                    color="rgb(15 23 42)"
                  />
                </Pressable>

                <VStack className="flex-1 gap-0.5">
                  <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                    Catalogo da loja
                  </Text>
                  <Heading size="md">{store.name}</Heading>
                </VStack>
              </HStack>
            </Box>

            <VStack className="gap-5 px-5 pb-8 pt-5">
              <Box className="rounded-[32px] border border-tertiary-200 bg-background-50 px-5 py-5">
                <VStack className="gap-5">
                  <HStack className="items-center gap-4">
                    <Box className="size-24 items-center justify-center rounded-[28px] bg-tertiary-100">
                      <MaterialCommunityIcons
                        name="shopping-outline"
                        size={38}
                        color="rgb(59 30 138)"
                      />
                    </Box>

                    <VStack className="flex-1 gap-2">
                      <VStack className="gap-1">
                        <Heading size="lg">{store.name}</Heading>
                        <HStack className="items-start gap-2">
                          <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={16}
                            color="rgb(100 116 139)"
                          />
                          <Text
                            className="flex-1 text-typography-600"
                            size="sm"
                          >
                            {store.address}
                          </Text>
                        </HStack>
                      </VStack>

                      <HStack className="flex-wrap gap-2">
                        <RetailBadge
                          label={`${products.length} itens`}
                          tone={products.length > 0 ? "accent" : "warning"}
                          className={
                            products.length > 0
                              ? "border-tertiary-200 bg-tertiary-100"
                              : undefined
                          }
                          textClassName="normal-case tracking-normal"
                        />
                        <RetailBadge
                          label={
                            products.length > 0
                              ? "Catalogo ativo"
                              : "Sem catalogo"
                          }
                          tone={products.length > 0 ? "success" : "warning"}
                        />
                      </HStack>
                    </VStack>
                  </HStack>

                  <Button
                    className="h-12 rounded-2xl"
                    onPress={() => setIsCreateOpen(true)}
                  >
                    <ButtonText>Novo produto</ButtonText>
                  </Button>
                </VStack>
              </Box>

              <HStack className="flex-wrap gap-3">
                <MetricCard
                  title="Itens ativos"
                  value={String(products.length)}
                  helper="Quantidade atual de produtos cadastrados nesta unidade"
                  badge="mix"
                  tone="accent"
                  className="min-w-[48%]"
                />
                <MetricCard
                  title="Preco medio"
                  value={formatCurrency(averagePrice)}
                  helper={
                    premiumProduct
                      ? `${premiumProduct.name} lidera o ticket`
                      : "Sem preco medio calculado"
                  }
                  badge="ticket"
                  className="min-w-[48%]"
                />
              </HStack>

              {deleteProductMutation.error ? (
                <Text className="text-error-700" size="sm">
                  Nao foi possivel excluir o produto.
                </Text>
              ) : null}

              <VStack className="gap-3">
                <VStack className="gap-1">
                  <Text bold className="text-typography-950" size="lg">
                    Todos os produtos
                  </Text>
                  <Text className="text-typography-600" size="sm">
                    Acompanhe o mix desta unidade e ajuste o catalogo quando
                    necessario.
                  </Text>
                </VStack>

                {productsQuery.isError ? (
                  <EmptyState
                    title="Erro ao carregar produtos"
                    description="Nao foi possivel carregar os produtos desta loja."
                    actionLabel="Tentar novamente"
                    onAction={() => {
                      void productsQuery.refetch();
                    }}
                  />
                ) : null}

                {!productsQuery.isError && products.length === 0 ? (
                  <EmptyState
                    title="Nenhum produto nesta loja"
                    description="Cadastre o primeiro produto para montar o catalogo desta unidade."
                    actionLabel="Novo produto"
                    onAction={() => setIsCreateOpen(true)}
                  />
                ) : null}

                {!productsQuery.isError && products.length > 0 ? (
                  <ProductList
                    products={products}
                    onOpenDetails={(product) =>
                      router.push(
                        `/stores/${store.id}/products/${product.id}` as never,
                      )
                    }
                    onEdit={setEditingProduct}
                    onDelete={setDeletingProduct}
                  />
                ) : null}
              </VStack>
            </VStack>
          </ScrollView>
        </Box>
      </SafeAreaView>

      <CreateProductActionsheet
        storeId={store.id}
        isOpen={isCreateOpen}
        isSubmitting={createProductMutation.isPending}
        errorMessage={
          createProductMutation.error
            ? "Nao foi possivel salvar o produto."
            : null
        }
        onClose={() => {
          createProductMutation.reset();
          setIsCreateOpen(false);
        }}
        onSubmit={handleCreate}
      />

      <EditProductActionsheet
        product={editingProduct}
        isSubmitting={updateProductMutation.isPending}
        errorMessage={
          updateProductMutation.error
            ? "Nao foi possivel atualizar o produto."
            : null
        }
        onClose={() => {
          updateProductMutation.reset();
          setEditingProduct(null);
        }}
        onSubmit={handleEdit}
      />

      <DeleteProductAlertDialog
        product={deletingProduct}
        isDeleting={deleteProductMutation.isPending}
        errorMessage={
          deleteProductMutation.error ? "Nao foi possivel excluir o produto." : null
        }
        onClose={() => {
          deleteProductMutation.reset();
          setDeletingProduct(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
