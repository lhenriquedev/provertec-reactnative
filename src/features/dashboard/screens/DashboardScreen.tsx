import { router } from "expo-router";
import { ScrollView } from "react-native";

import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useProductsQuery } from "@/src/features/products/queries/queries";
import { useStoresQuery } from "@/src/features/stores/queries/queries";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { LoadingSpinner } from "@/src/shared/components/LoadingSpinner";
import { MetricCard } from "@/src/shared/components/MetricCard";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import { formatCurrency } from "@/src/shared/utils/formatCurrency";

const getCategorySummary = (categories: string[]) => {
  const counts = categories.reduce<Record<string, number>>((acc, category) => {
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([category, total]) => ({ category, total }))
    .sort((left, right) => right.total - left.total);
};

export function DashboardScreen() {
  const storesQuery = useStoresQuery();
  const productsQuery = useProductsQuery();

  if (storesQuery.isLoading || productsQuery.isLoading) {
    return <LoadingSpinner label="Montando a visao operacional" />;
  }

  if (storesQuery.isError || productsQuery.isError) {
    const description = [storesQuery.error?.message, productsQuery.error?.message]
      .filter(Boolean)
      .join(" ");

    return (
      <Box className="flex-1 bg-background-0 px-5 py-6">
        <EmptyState
          title="Nao foi possivel carregar o painel"
          description={description || "Tente novamente para recuperar a visao do negocio."}
          actionLabel="Ir para lojas"
          onAction={() => router.push("/stores")}
        />
      </Box>
    );
  }

  const stores = storesQuery.data ?? [];
  const products = productsQuery.data ?? [];

  if (stores.length === 0 && products.length === 0) {
    return (
      <Box className="flex-1 bg-background-0 px-5 py-6">
        <EmptyState
          title="Seu painel retail começa pelas lojas"
          description="Crie a primeira loja para acompanhar catalogo, mix de categorias e prioridades da operacao."
          actionLabel="Cadastrar loja"
          onAction={() => router.push("/stores")}
        />
      </Box>
    );
  }

  const totalStores = stores.length;
  const totalProducts = products.length;
  const catalogValue = products.reduce((total, product) => total + product.price, 0);
  const averageTicket = totalProducts > 0 ? catalogValue / totalProducts : 0;
  const averageMix = totalStores > 0 ? totalProducts / totalStores : 0;
  const topStore = [...stores].sort((left, right) => right.productsCount - left.productsCount)[0];
  const premiumProduct = [...products].sort((left, right) => right.price - left.price)[0];
  const categorySummary = getCategorySummary(products.map((product) => product.category));
  const leadingCategory = categorySummary[0];
  const highlightedStores = [...stores].sort((left, right) => right.productsCount - left.productsCount).slice(0, 3);
  const totalCatalogItems = Math.max(totalProducts, 1);

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 20 }}
      >
        <Box className="rounded-[32px] border border-tertiary-300 bg-tertiary-100 px-5 py-6">
          <VStack className="gap-5">
            <VStack className="gap-2">
              <RetailBadge label="Retail manager" tone="accent" />
              <Heading className="text-typography-950" size="2xl">
                Operacao, catalogo e prioridades no mesmo painel.
              </Heading>
              <Text className="text-typography-700" size="sm">
                Acompanhe a rede, identifique a loja mais forte e encontre rapido onde o mix ainda precisa crescer.
              </Text>
            </VStack>

            <HStack className="flex-wrap gap-3">
              <Button onPress={() => router.push("/stores")}>
                <ButtonText>Abrir lojas</ButtonText>
              </Button>
              <Button
                action="secondary"
                variant="outline"
                onPress={() => {
                  if (topStore) {
                    router.push(`/stores/${topStore.id}` as never);
                  }
                }}
              >
                <ButtonText>Loja em foco</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Box>

        <HStack className="flex-wrap gap-3">
          <MetricCard
            title="Lojas ativas"
            value={String(totalStores)}
            helper={topStore ? `${topStore.name} lidera com ${topStore.productsCount} SKUs` : "Sem destaque ainda"}
            badge="rede"
            tone="accent"
            className="min-w-[48%]"
          />
          <MetricCard
            title="SKUs no catalogo"
            value={String(totalProducts)}
            helper={leadingCategory ? `${leadingCategory.category} e a maior categoria` : "Monte seu primeiro mix"}
            badge="catalogo"
            className="min-w-[48%]"
          />
          <MetricCard
            title="Ticket medio"
            value={formatCurrency(averageTicket)}
            helper={premiumProduct ? `${premiumProduct.name} e o produto premium` : "Sem ticket calculado"}
            badge="preco"
            className="min-w-[48%]"
          />
          <MetricCard
            title="Mix por loja"
            value={`${averageMix.toFixed(1)} itens`}
            helper="Media atual de produtos por unidade"
            badge="ritmo"
            tone="success"
            className="min-w-[48%]"
          />
        </HStack>

        <Box className="rounded-[28px] border border-outline-200 bg-background-50 p-5">
          <VStack className="gap-4">
            <VStack className="gap-1">
              <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                Destaques da operacao
              </Text>
              <Heading size="lg">Onde agir primeiro hoje</Heading>
            </VStack>

            <VStack className="gap-3">
              <Box className="rounded-2xl border border-outline-200 bg-background-0 px-4 py-4">
                <VStack className="gap-1">
                  <RetailBadge label="Loja mais forte" tone="success" />
                  <Heading size="md">{topStore?.name ?? "Sem loja em destaque"}</Heading>
                  <Text className="text-typography-600" size="sm">
                    {topStore
                      ? `${topStore.productsCount} produtos cadastrados e maior densidade do catalogo.`
                      : "Cadastre lojas para comparar a operacao."}
                  </Text>
                </VStack>
              </Box>

              <Box className="rounded-2xl border border-outline-200 bg-background-0 px-4 py-4">
                <VStack className="gap-1">
                  <RetailBadge label="Categoria lider" tone="warning" />
                  <Heading size="md">{leadingCategory?.category ?? "Sem categoria lider"}</Heading>
                  <Text className="text-typography-600" size="sm">
                    {leadingCategory
                      ? `${leadingCategory.total} itens concentram hoje a maior parte do mix.`
                      : "Adicione produtos para enxergar o mix de categorias."}
                  </Text>
                </VStack>
              </Box>

              <Box className="rounded-2xl border border-outline-200 bg-background-0 px-4 py-4">
                <VStack className="gap-1">
                  <RetailBadge label="Valor do mix" tone="accent" />
                  <Heading size="md">{formatCurrency(catalogValue)}</Heading>
                  <Text className="text-typography-600" size="sm">
                    Soma simples dos valores cadastrados para leitura rapida do catalogo atual.
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </Box>

        <Box className="rounded-[28px] border border-outline-200 bg-background-50 p-5">
          <VStack className="gap-4">
            <VStack className="gap-1">
              <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                Lojas em foco
              </Text>
              <Heading size="lg">Rede prioritaria</Heading>
            </VStack>

            <VStack className="gap-3">
              {highlightedStores.map((store, index) => (
                <Box
                  key={store.id}
                  className="rounded-2xl border border-outline-200 bg-background-0 px-4 py-4"
                >
                  <VStack className="gap-3">
                    <HStack className="items-start justify-between gap-3">
                      <VStack className="flex-1 gap-1">
                        <HStack className="items-center gap-2">
                          <RetailBadge tone={index === 0 ? "accent" : "neutral"}>
                            #{index + 1}
                          </RetailBadge>
                          <Heading size="md">{store.name}</Heading>
                        </HStack>
                        <Text className="text-typography-600" size="sm">
                          {store.address}
                        </Text>
                      </VStack>

                      <RetailBadge tone={store.productsCount > 0 ? "success" : "warning"}>
                        {store.productsCount} SKUs
                      </RetailBadge>
                    </HStack>

                    <Button
                      action="secondary"
                      variant="outline"
                      onPress={() => router.push(`/stores/${store.id}` as never)}
                    >
                      <ButtonText>Ver operacao da loja</ButtonText>
                    </Button>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>

        <Box className="rounded-[28px] border border-outline-200 bg-background-50 p-5">
          <VStack className="gap-4">
            <VStack className="gap-1">
              <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
                Mix de categorias
              </Text>
              <Heading size="lg">Distribuicao do catalogo</Heading>
            </VStack>

            <VStack className="gap-3">
              {categorySummary.slice(0, 4).map((item) => {
                const share = item.total / totalCatalogItems;

                return (
                  <VStack key={item.category} className="gap-2 rounded-2xl border border-outline-200 bg-background-0 px-4 py-4">
                    <HStack className="items-center justify-between gap-3">
                      <Text bold size="sm">
                        {item.category}
                      </Text>
                      <RetailBadge tone="neutral">{item.total} itens</RetailBadge>
                    </HStack>

                    <Box className="h-2 rounded-full bg-background-200">
                      <Box
                        className="h-2 rounded-full bg-tertiary-500"
                        style={{ width: `${Math.max(share * 100, 8)}%` }}
                      />
                    </Box>

                    <Text className="text-typography-600" size="sm">
                      {(share * 100).toFixed(0)}% do mix atual.
                    </Text>
                  </VStack>
                );
              })}
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}
