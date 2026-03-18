import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

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
      ? products.reduce((total, product) => total + product.price, 0) / products.length
      : 0;
  const premiumProduct = [...products].sort((left, right) => right.price - left.price)[0];

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
    setDeletingProduct(product);
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

  if (productsQuery.isError) {
    return (
      <Box className="flex-1 bg-background-0 px-5 py-5">
        <EmptyState
          title="Erro ao carregar produtos"
          description="Nao foi possivel carregar os produtos desta loja."
          actionLabel="Tentar novamente"
          onAction={() => {
            void productsQuery.refetch();
          }}
        />
      </Box>
    );
  }

  return (
    <>
      <Box className="flex-1 bg-background-0 px-5 py-5">
        <VStack className="flex-1 gap-4">
          <Box className="rounded-[32px] border border-tertiary-300 bg-tertiary-100 px-5 py-6">
            <VStack className="gap-5">
              <VStack className="gap-2">
                <HStack className="flex-wrap gap-2">
                  <RetailBadge label="Produtos da loja" tone="accent" />
                  <RetailBadge
                    label={`${products.length} itens`}
                    tone={products.length > 0 ? "success" : "warning"}
                  />
                </HStack>
                <Heading size="xl">{store.name}</Heading>
                <Text className="text-typography-700" size="sm">
                  {store.address}
                </Text>
              </VStack>

              <Button onPress={() => setIsCreateOpen(true)}>
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
              helper={premiumProduct ? `${premiumProduct.name} lidera o ticket` : "Sem preco medio calculado"}
              badge="ticket"
              className="min-w-[48%]"
            />
          </HStack>

          {deleteProductMutation.error ? (
            <Text className="text-error-700" size="sm">
              Nao foi possivel excluir o produto.
            </Text>
          ) : null}

          <Box className="flex-1">
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
          </Box>

          <Button variant="link" action="secondary" onPress={() => router.back()}>
            <ButtonText>Voltar para loja</ButtonText>
          </Button>
        </VStack>
      </Box>

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

      <DeleteProductAlertDialog
        product={deletingProduct}
        isDeleting={deleteProductMutation.isPending}
        errorMessage={deleteProductMutation.error ? "Nao foi possivel excluir o produto." : null}
        onClose={() => {
          deleteProductMutation.reset();
          setDeletingProduct(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
