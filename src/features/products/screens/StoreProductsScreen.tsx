import { useState } from "react";
import { Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { CreateProductActionsheet } from "@/src/features/products/components/CreateProductActionsheet";
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

  const store = storeQuery.data;
  const products = productsQuery.data ?? [];

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

  const confirmDelete = (product: Product) => {
    Alert.alert("Excluir produto", `Deseja excluir ${product.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          void deleteProductMutation.mutateAsync(product.id);
        },
      },
    ]);
  };

  if (storeQuery.isLoading || productsQuery.isLoading) {
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
              : "Nao foi possivel carregar a loja selecionada."
          }
          actionLabel="Voltar para lojas"
          onAction={() => router.replace("/stores")}
        />
      </View>
    );
  }

  if (productsQuery.isError) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <EmptyState
          title="Erro ao carregar produtos"
          description="Nao foi possivel carregar os produtos desta loja."
          actionLabel="Tentar novamente"
          onAction={() => {
            void productsQuery.refetch();
          }}
        />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, padding: 20 }}>
        <VStack className="flex-1 gap-4">
          <VStack className="gap-1">
            <Text className="text-typography-600" size="sm">
              Produtos da loja
            </Text>
            <Heading size="xl">{store.name}</Heading>
            <Text size="sm">{store.address}</Text>
          </VStack>

          <Button onPress={() => setIsCreateOpen(true)}>
            <ButtonText>Novo produto</ButtonText>
          </Button>

          {deleteProductMutation.error ? (
            <Text className="text-error-700" size="sm">
              Nao foi possivel excluir o produto.
            </Text>
          ) : null}

          <View style={{ flex: 1 }}>
            {products.length === 0 ? (
              <EmptyState
                title="Nenhum produto nesta loja"
                description="Cadastre o primeiro produto para montar o catalogo desta unidade."
                actionLabel="Novo produto"
                onAction={() => setIsCreateOpen(true)}
              />
            ) : (
              <ProductList
                products={products}
                onOpenDetails={(product) =>
                  router.push(`/stores/${store.id}/products/${product.id}` as never)
                }
                onEdit={setEditingProduct}
                onDelete={confirmDelete}
              />
            )}
          </View>

          <Button variant="link" action="secondary" onPress={() => router.back()}>
            <ButtonText>Voltar para loja</ButtonText>
          </Button>
        </VStack>
      </View>

      <CreateProductActionsheet
        storeId={store.id}
        isOpen={isCreateOpen}
        isSubmitting={createProductMutation.isPending}
        errorMessage={createProductMutation.error ? "Nao foi possivel salvar o produto." : null}
        onClose={() => {
          createProductMutation.reset();
          setIsCreateOpen(false);
        }}
        onSubmit={handleCreate}
      />

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
    </>
  );
}
