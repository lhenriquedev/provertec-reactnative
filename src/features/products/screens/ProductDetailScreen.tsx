import { useState } from "react";
import { Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { EditProductActionsheet } from "@/src/features/products/components/EditProductActionsheet";
import { useProductDetails, useProducts } from "@/src/features/products/hooks/useProducts";
import type {
  Product,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";
import { useStoreDetails } from "@/src/features/stores/hooks/useStores";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";
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

  const store = storeQuery.data;
  const product = productQuery.data;

  const handleEdit = async (values: ProductUpdateInput) => {
    if (!product) return;
    await updateProductMutation.mutateAsync({ productId: product.id, productInput: values });
    updateProductMutation.reset();
    setEditingProduct(null);
  };

  const handleDelete = () => {
    if (!product) return;

    Alert.alert("Excluir produto", `Deseja excluir ${product.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          void deleteProductMutation.mutateAsync(product.id).then(() => {
            router.replace(`/stores/${storeId}/products` as never);
          });
        },
      },
    ]);
  };

  if (storeQuery.isLoading || productQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (storeQuery.isError || !store || productQuery.isError || !product) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
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
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, padding: 20 }}>
        <VStack className="gap-4">
          <VStack className="gap-1">
            <Text className="text-typography-600" size="sm">
              {store.name}
            </Text>
            <Heading size="xl">{product.name}</Heading>
            <Text size="sm">Categoria: {product.category}</Text>
            <Text size="sm">Preco: {formatCurrency(product.price)}</Text>
          </VStack>

          {deleteProductMutation.error ? (
            <Text className="text-error-700" size="sm">
              Nao foi possivel excluir o produto.
            </Text>
          ) : null}

          <Button variant="outline" action="secondary" onPress={() => setEditingProduct(product)}>
            <ButtonText>Editar produto</ButtonText>
          </Button>

          <Button variant="outline" action="negative" onPress={handleDelete}>
            <ButtonText>Excluir produto</ButtonText>
          </Button>

          <Button variant="link" action="secondary" onPress={() => router.back()}>
            <ButtonText>Voltar</ButtonText>
          </Button>
        </VStack>
      </View>

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
