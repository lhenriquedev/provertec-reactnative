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
import { CreateProductActionsheet } from "@/src/features/products/components/CreateProductActionsheet";
import { useProducts } from "@/src/features/products/hooks/useProducts";
import type {
  Product,
  ProductInput,
} from "@/src/features/products/types/product.types";
import { DeleteStoreAlertDialog } from "@/src/features/stores/components/DeleteStoreAlertDialog";
import { EditStoreActionsheet } from "@/src/features/stores/components/EditStoreActionsheet";
import {
  useStoreDetails,
  useStores,
} from "@/src/features/stores/hooks/useStores";
import type { StoreInput } from "@/src/features/stores/types/store.types";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import { formatCurrency } from "@/src/shared/utils/formatCurrency";

import { getStoreErrorMessage } from "@/src/features/stores/utils/getStoreErrorMessage";

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

type StoreProductPreviewRowProps = {
  product: Product;
  onPress: (product: Product) => void;
};

function StoreProductPreviewRow({
  product,
  onPress,
}: StoreProductPreviewRowProps) {
  return (
    <Pressable
      className="rounded-md border border-outline-200 bg-background-50 px-4 py-3 active:opacity-90"
      onPress={() => onPress(product)}
    >
      <HStack className="items-center gap-3">
        <Box className="size-14 items-center justify-center rounded-2xl bg-tertiary-100">
          <MaterialCommunityIcons
            name={getCategoryIcon(product.category)}
            size={22}
            color="rgb(59 30 138)"
          />
        </Box>

        <VStack className="flex-1 gap-1">
          <Text bold className="text-typography-950" size="sm">
            {product.name}
          </Text>
          <Text className="text-typography-500" size="xs">
            {product.category}
          </Text>
          <Text className="text-tertiary-700" size="sm">
            {formatCurrency(product.price)}
          </Text>
        </VStack>

        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color="rgb(148 163 184)"
        />
      </HStack>
    </Pressable>
  );
}

export function StoreDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const storeId = typeof params.id === "string" ? params.id : "";
  const storeQuery = useStoreDetails(storeId);
  const { updateStoreMutation, deleteStoreMutation } = useStores();
  const { productsQuery, createProductMutation } = useProducts({ storeId });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  const store = storeQuery.data;
  const products = productsQuery.data ?? [];
  const previewProducts = products.slice(0, 3);

  const hasProductInsights = products.length > 0;

  const handleEdit = async (values: StoreInput) => {
    if (!store) return;
    await updateStoreMutation.mutateAsync({
      storeId: store.id,
      storeInput: values,
    });
    setIsEditOpen(false);
  };

  const handleCreateProduct = async (values: ProductInput) => {
    await createProductMutation.mutateAsync(values);
    createProductMutation.reset();
    setIsCreateProductOpen(false);
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
      <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
        <Box className="flex-1 bg-background-0">
          <ScrollView
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 144 }}
          >
            <Box className="border-b border-outline-300 bg-background-0 px-5 py-4">
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
                  {store.name}
                </Heading>
              </HStack>
            </Box>

            <VStack className="gap-5 px-5 pb-8 pt-5">
              <Box className="rounded-md border border-tertiary-200 bg-background-50 px-5 py-5">
                <VStack className="gap-5">
                  <HStack className="items-center gap-4">
                    <Box className="size-24 items-center justify-center rounded-md bg-tertiary-100">
                      <MaterialCommunityIcons
                        name="storefront-outline"
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
                          label={`${store.productsCount} produtos cadastrados`}
                          tone="accent"
                          className="border-tertiary-200 bg-tertiary-100"
                          textClassName="normal-case tracking-normal"
                        />
                        <RetailBadge
                          label={
                            hasProductInsights
                              ? "Catalogo ativo"
                              : "Sem catalogo"
                          }
                          tone={hasProductInsights ? "success" : "warning"}
                        />
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack className="gap-2">
                    <Button
                      className="flex-1 rounded-2xl"
                      onPress={() => setIsEditOpen(true)}
                    >
                      <ButtonText>Editar loja</ButtonText>
                    </Button>

                    <Button
                      className="rounded-2xl flex-1"
                      variant="outline"
                      action="negative"
                      onPress={() => setIsDeleteOpen(true)}
                    >
                      <ButtonText>Excluir loja</ButtonText>
                    </Button>
                  </HStack>
                </VStack>
              </Box>

              <VStack className="gap-3">
                <HStack className="items-center justify-between">
                  <Text bold className="text-typography-950" size="lg">
                    Produtos da loja
                  </Text>
                  <Button
                    action="primary"
                    variant="link"
                    onPress={() =>
                      router.push(`/stores/${store.id}/products` as never)
                    }
                  >
                    <ButtonText>Ver todos</ButtonText>
                  </Button>
                </HStack>

                {productsQuery.isLoading ? (
                  <Box className="rounded-md border border-outline-200 bg-background-50 px-5 py-6">
                    <Text className="text-typography-600" size="sm">
                      Carregando os produtos desta unidade...
                    </Text>
                  </Box>
                ) : null}

                {productsQuery.isError ? (
                  <Box className="rounded-md border border-error-200 bg-error-50 px-5 py-5">
                    <VStack className="gap-3">
                      <Text className="text-error-700" size="sm">
                        Nao foi possivel carregar a previa do catalogo.
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

                {!productsQuery.isLoading &&
                !productsQuery.isError &&
                previewProducts.length === 0 ? (
                  <EmptyState
                    title="Nenhum produto nesta loja"
                    description="Use o botao flutuante para cadastrar o primeiro item desta unidade."
                    actionLabel="Novo produto"
                    onAction={() => setIsCreateProductOpen(true)}
                  />
                ) : null}

                {!productsQuery.isLoading && !productsQuery.isError ? (
                  <VStack className="gap-3">
                    {previewProducts.map((product) => (
                      <StoreProductPreviewRow
                        key={product.id}
                        product={product}
                        onPress={(selectedProduct) =>
                          router.push(
                            `/stores/${store.id}/products/${selectedProduct.id}` as never,
                          )
                        }
                      />
                    ))}
                  </VStack>
                ) : null}
              </VStack>
            </VStack>
          </ScrollView>

          {!productsQuery.isError ? (
            <Pressable
              className="absolute bottom-4 right-5 size-14 items-center justify-center rounded-full bg-primary-500 active:opacity-90"
              style={{
                boxShadow: "0px 12px 24px rgba(59, 30, 138, 0.28)",
              }}
              onPress={() => setIsCreateProductOpen(true)}
            >
              <MaterialCommunityIcons name="plus" size={28} color="white" />
            </Pressable>
          ) : null}
        </Box>
      </SafeAreaView>

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

      <CreateProductActionsheet
        storeId={store.id}
        isOpen={isCreateProductOpen}
        isSubmitting={createProductMutation.isPending}
        errorMessage={
          createProductMutation.error
            ? "Nao foi possivel salvar o produto."
            : null
        }
        onClose={() => {
          createProductMutation.reset();
          setIsCreateProductOpen(false);
        }}
        onSubmit={handleCreateProduct}
      />
    </>
  );
}
