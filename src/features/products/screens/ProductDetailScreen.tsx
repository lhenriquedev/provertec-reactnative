import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { DeleteProductAlertDialog } from "@/src/features/products/components/DeleteProductAlertDialog";
import { EditProductActionsheet } from "@/src/features/products/components/EditProductActionsheet";
import {
  useProductDetails,
  useProducts,
} from "@/src/features/products/hooks/useProducts";
import type {
  Product,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";
import { useStoreDetails } from "@/src/features/stores/hooks/useStores";
import { getStoreErrorMessage } from "@/src/features/stores/utils/getStoreErrorMessage";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";
import { MetricCard } from "@/src/shared/components/MetricCard";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import { formatCurrency } from "@/src/shared/utils/formatCurrency";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "roupas":
      return "hanger";
    case "calcados":
      return "shoe-sneaker";
    case "eletronicos":
      return "laptop";
    case "casa":
      return "sofa-outline";
    default:
      return "package-variant-closed";
  }
};

export function ProductDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    productId?: string | string[];
  }>();
  const storeId = typeof params.id === "string" ? params.id : "";
  const productId =
    typeof params.productId === "string" ? params.productId : "";
  const storeQuery = useStoreDetails(storeId);
  const productQuery = useProductDetails(productId);
  const { productsQuery, updateProductMutation, deleteProductMutation } =
    useProducts({
      storeId,
    });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState(false);

  const store = storeQuery.data;
  const product = productQuery.data;
  const storeProducts = productsQuery.data ?? [];
  const catalogProducts = storeProducts.filter(
    (item) => item.id !== product?.id,
  );
  const catalogAveragePrice =
    storeProducts.length > 0
      ? storeProducts.reduce((total, item) => total + item.price, 0) /
        storeProducts.length
      : 0;
  const premiumProduct = [...storeProducts].sort(
    (left, right) => right.price - left.price,
  )[0];
  const sameCategoryCount = product
    ? storeProducts.filter((item) => item.category === product.category).length
    : 0;
  const isCatalogReady = storeProducts.length > 0;

  const handleEdit = async (values: ProductUpdateInput) => {
    if (!product) return;

    await updateProductMutation.mutateAsync({
      productId: product.id,
      productInput: values,
    });
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
          onAction={() =>
            router.replace(`/stores/${storeId}/products` as never)
          }
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

                <Heading className="flex-1" size="md">
                  {product.name}
                </Heading>
              </HStack>
            </Box>

            <VStack className="gap-5 px-5 pb-8 pt-5">
              <Box className="rounded-md border border-tertiary-200 bg-background-50 px-5 py-5">
                <VStack className="gap-5">
                  <HStack className="items-center gap-4">
                    <Box className="size-24 items-center justify-center rounded-md bg-tertiary-100">
                      <MaterialCommunityIcons
                        name={getCategoryIcon(product.category)}
                        size={38}
                        color="rgb(59 30 138)"
                      />
                    </Box>

                    <VStack className="flex-1 gap-2">
                      <VStack className="gap-1">
                        <Heading size="lg">{product.name}</Heading>
                        <HStack className="items-start gap-2">
                          <MaterialCommunityIcons
                            name="storefront-outline"
                            size={16}
                            color="rgb(100 116 139)"
                          />
                          <Text
                            className="flex-1 text-typography-600"
                            size="sm"
                          >
                            {store.name}
                          </Text>
                        </HStack>
                      </VStack>

                      <HStack className="flex-wrap gap-2">
                        <RetailBadge
                          label={product.category}
                          tone="accent"
                          className="border-tertiary-200 bg-tertiary-100"
                          textClassName="normal-case tracking-normal"
                        />
                        <RetailBadge
                          label={`SKU #${product.id}`}
                          tone="neutral"
                          textClassName="normal-case tracking-normal"
                        />
                        <RetailBadge label="Catalogado" tone="success" />
                      </HStack>
                    </VStack>
                  </HStack>

                  <Heading className="mt-1 text-typography-950" size="2xl">
                    {formatCurrency(product.price)}
                  </Heading>

                  <Button
                    className="h-12 rounded-2xl"
                    onPress={() => setEditingProduct(product)}
                  >
                    <ButtonText>Editar produto</ButtonText>
                  </Button>
                </VStack>
              </Box>

              <HStack className="flex-wrap gap-3">
                <MetricCard
                  title="Categoria"
                  value={product.category}
                  badge="mix"
                  tone="accent"
                  className="min-w-[48%]"
                />
                <MetricCard
                  title="Loja vinculada"
                  value={store.name}
                  badge="rede"
                  tone="neutral"
                  className="min-w-[48%]"
                />
              </HStack>

              <VStack className="gap-3">
                <HStack className="items-center justify-between">
                  <Text bold className="text-typography-950" size="lg">
                    Contexto do catalogo
                  </Text>
                  <Button
                    action="primary"
                    variant="link"
                    onPress={() =>
                      router.push(`/stores/${store.id}/products` as never)
                    }
                  >
                    <ButtonText>Ver catalogo</ButtonText>
                  </Button>
                </HStack>

                {productsQuery.isLoading ? (
                  <Box className="rounded-md border border-outline-200 bg-background-50 px-5 py-6">
                    <Text className="text-typography-600" size="sm">
                      Carregando a leitura do catalogo desta loja...
                    </Text>
                  </Box>
                ) : null}

                {productsQuery.isError ? (
                  <Box className="rounded-md border border-error-200 bg-error-50 px-5 py-5">
                    <VStack className="gap-3">
                      <Text className="text-error-700" size="sm">
                        Nao foi possivel carregar o contexto do catalogo.
                      </Text>
                      <Button
                        variant="outline"
                        action="negative"
                        onPress={() => {
                          void productsQuery.refetch();
                        }}
                      >
                        <ButtonText>Tentar novamente</ButtonText>
                      </Button>
                    </VStack>
                  </Box>
                ) : null}

                {!productsQuery.isLoading && !productsQuery.isError ? (
                  <Box className="rounded-md border border-outline-200 bg-background-50 p-5">
                    <VStack className="gap-4">
                      <VStack className="gap-1">
                        <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                          Catalogo da unidade
                        </Text>
                        <Text bold className="text-typography-950" size="lg">
                          {store.name}
                        </Text>
                        <Text className="text-typography-600" size="sm">
                          {store.address}
                        </Text>
                      </VStack>

                      <HStack className="flex-wrap gap-2">
                        <RetailBadge
                          label={`${store.productsCount} itens cadastrados`}
                          tone={isCatalogReady ? "accent" : "warning"}
                          textClassName="normal-case tracking-normal"
                        />
                        <RetailBadge
                          label={
                            catalogProducts.length > 0
                              ? `${catalogProducts.length} alem deste produto`
                              : "Item unico no catalogo"
                          }
                          tone={
                            catalogProducts.length > 0 ? "success" : "warning"
                          }
                          textClassName="normal-case tracking-normal"
                        />
                      </HStack>

                      <HStack className="flex-wrap gap-3">
                        <MetricCard
                          title="Preco medio"
                          value={formatCurrency(catalogAveragePrice)}
                          helper={
                            premiumProduct
                              ? `${premiumProduct.name} lidera o ticket da loja`
                              : "Sem leitura de ticket disponivel"
                          }
                          badge="ticket"
                          tone={isCatalogReady ? "neutral" : "warning"}
                          className="min-w-[48%]"
                        />
                        <MetricCard
                          title="Categoria"
                          value={product.category}
                          helper={
                            sameCategoryCount > 1
                              ? "Existe recorrencia desta categoria na unidade"
                              : "Categoria ainda pouco representada na unidade"
                          }
                          badge="portfolio"
                          tone={sameCategoryCount > 1 ? "success" : "accent"}
                          className="min-w-[48%]"
                        />
                      </HStack>

                      <Button
                        variant="outline"
                        action="secondary"
                        onPress={() =>
                          router.push(`/stores/${store.id}/products` as never)
                        }
                      >
                        <ButtonText>Abrir catalogo completo</ButtonText>
                      </Button>

                      <Button
                        variant="link"
                        action="secondary"
                        onPress={() =>
                          router.push(`/stores/${store.id}` as never)
                        }
                      >
                        <ButtonText>Ver detalhes da loja</ButtonText>
                      </Button>
                    </VStack>
                  </Box>
                ) : null}
              </VStack>

              {deleteProductMutation.error ? (
                <Text className="text-error-700" size="sm">
                  Nao foi possivel excluir o produto.
                </Text>
              ) : null}

              <Box className="rounded-md border border-outline-200 bg-background-50 p-5">
                <VStack className="gap-3">
                  <VStack className="gap-1">
                    <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                      Gestao do produto
                    </Text>
                    <Text bold className="text-typography-950" size="lg">
                      Atualize ou remova o item quando precisar.
                    </Text>
                  </VStack>

                  <Button
                    variant="outline"
                    action="secondary"
                    onPress={() => setEditingProduct(product)}
                  >
                    <ButtonText>Editar produto</ButtonText>
                  </Button>

                  <Button
                    variant="outline"
                    action="negative"
                    onPress={() => setDeletingProduct(true)}
                  >
                    <ButtonText>Excluir produto</ButtonText>
                  </Button>

                  <Button
                    variant="link"
                    action="secondary"
                    onPress={() =>
                      router.replace(`/stores/${storeId}/products` as never)
                    }
                  >
                    <ButtonText>Voltar para catalogo</ButtonText>
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </ScrollView>
        </Box>
      </SafeAreaView>

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
        product={deletingProduct ? product : null}
        isDeleting={deleteProductMutation.isPending}
        errorMessage={
          deleteProductMutation.error
            ? "Nao foi possivel excluir o produto."
            : null
        }
        onClose={() => {
          deleteProductMutation.reset();
          setDeletingProduct(false);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
