import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput } from "react-native";
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

import { getStoreErrorMessage } from "@/src/domain/stores/get-store-error-message";

const ALL_CATEGORY_LABEL = "Todos";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_LABEL);

  const store = storeQuery.data;
  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const categories = useMemo(
    () => [
      ALL_CATEGORY_LABEL,
      ...Array.from(new Set(products.map((product) => product.category))).sort(
        (left, right) => left.localeCompare(right),
      ),
    ],
    [products],
  );
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          activeCategory === ALL_CATEGORY_LABEL ||
          product.category === activeCategory;
        const matchesSearch =
          normalizedSearchTerm.length === 0 ||
          product.name.toLowerCase().includes(normalizedSearchTerm) ||
          product.category.toLowerCase().includes(normalizedSearchTerm);

        return matchesCategory && matchesSearch;
      }),
    [activeCategory, normalizedSearchTerm, products],
  );
  const hasActiveFilters =
    normalizedSearchTerm.length > 0 || activeCategory !== ALL_CATEGORY_LABEL;

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
            contentContainerStyle={{ paddingBottom: 128 }}
          >
            <Box className="border-b border-outline-100 bg-background-0">
              <VStack className="gap-4 px-5 py-4">
                <HStack className="items-start gap-3">
                  <Pressable
                    className="mt-0.5 size-10 items-center justify-center rounded-full bg-background-50 active:opacity-80"
                    onPress={() => router.back()}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={22}
                      color="rgb(59 30 138)"
                    />
                  </Pressable>

                  <VStack className="flex-1 gap-1">
                    <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                      Catalogo da loja
                    </Text>
                    <Heading size="md">{`Produtos - ${store.name}`}</Heading>
                    <Text className="text-typography-500" size="sm">
                      {store.address}
                    </Text>
                  </VStack>
                </HStack>

                <HStack className="h-12 items-center rounded-xl bg-background-50 px-3">
                  <MaterialCommunityIcons
                    name="magnify"
                    size={20}
                    color="rgb(148 163 184)"
                  />
                  <TextInput
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholder="Buscar produto..."
                    placeholderTextColor="rgb(148 163 184)"
                    className="flex-1 px-2 text-sm text-typography-900"
                    autoCorrect={false}
                  />
                </HStack>

                {products.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingRight: 4 }}
                  >
                    {categories.map((category) => {
                      const isActive = activeCategory === category;

                      return (
                        <Pressable
                          key={category}
                          className={`h-9 items-center justify-center rounded-full px-5 ${
                            isActive
                              ? "bg-tertiary-700"
                              : "bg-background-100"
                          }`}
                          onPress={() => setActiveCategory(category)}
                        >
                          <Text
                            className={
                              isActive ? "text-white" : "text-typography-700"
                            }
                            bold={isActive}
                            size="sm"
                          >
                            {category}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                ) : null}
              </VStack>
            </Box>

            <VStack className="gap-5 px-5 pb-8 pt-5">
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

                {!productsQuery.isError &&
                products.length > 0 &&
                filteredProducts.length === 0 ? (
                  <Box className="rounded-3xl border border-dashed border-outline-300 bg-background-50 px-6 py-10">
                    <VStack className="items-center gap-4">
                      <Box className="size-20 items-center justify-center rounded-full bg-background-100">
                        <MaterialCommunityIcons
                          name="package-variant-closed-remove"
                          size={34}
                          color="rgb(148 163 184)"
                        />
                      </Box>

                      <VStack className="items-center gap-1">
                        <Text
                          bold
                          className="text-center text-typography-950"
                          size="lg"
                        >
                          Nenhum produto encontrado
                        </Text>
                        <Text
                          className="text-center text-typography-600"
                          size="sm"
                        >
                          Ajuste a busca ou os filtros para encontrar outro
                          item.
                        </Text>
                      </VStack>

                      {hasActiveFilters ? (
                        <Button
                          variant="outline"
                          action="secondary"
                          onPress={() => {
                            setSearchTerm("");
                            setActiveCategory(ALL_CATEGORY_LABEL);
                          }}
                        >
                          <ButtonText>Limpar filtros</ButtonText>
                        </Button>
                      ) : null}
                    </VStack>
                  </Box>
                ) : null}

                {!productsQuery.isError && filteredProducts.length > 0 ? (
                  <ProductList
                    products={filteredProducts}
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

          <Pressable
            className="absolute bottom-6 right-6 size-14 items-center justify-center rounded-full bg-tertiary-700"
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
          deleteProductMutation.error
            ? "Nao foi possivel excluir o produto."
            : null
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
