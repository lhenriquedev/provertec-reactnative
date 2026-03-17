import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { useProductsQuery } from "@/src/domain/products/queries";
import { useStoresQuery } from "@/src/domain/stores/queries";

export default function HomeScreen() {
  const storesQuery = useStoresQuery();
  const productsQuery = useProductsQuery();

  if (storesQuery.isLoading || productsQuery.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (storesQuery.isError || productsQuery.isError) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>
          Erro ao carregar dados
        </Text>
        {storesQuery.error ? <Text>{storesQuery.error.message}</Text> : null}
        {productsQuery.error ? <Text>{productsQuery.error.message}</Text> : null}
      </View>
    );
  }

  const stores = storesQuery.data ?? [];
  const products = productsQuery.data ?? [];

  return (
    <ScrollView contentContainerStyle={{ gap: 20, padding: 20 }}>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Dashboard</Text>
        <Text>Total de lojas: {stores.length}</Text>
        <Text>Total de produtos: {products.length}</Text>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Lojas</Text>
        {stores.map((store) => (
          <View
            key={store.id}
            style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 12, padding: 12 }}
          >
            <Text style={{ fontWeight: "600" }}>{store.name}</Text>
            <Text>{store.address}</Text>
            <Text>Produtos: {store.productsCount}</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Produtos</Text>
        {products.map((product) => (
          <View
            key={product.id}
            style={{ borderWidth: 1, borderColor: "#d4d4d8", borderRadius: 12, padding: 12 }}
          >
            <Text style={{ fontWeight: "600" }}>{product.name}</Text>
            <Text>Categoria: {product.category}</Text>
            <Text>Preco: R$ {product.price.toFixed(2)}</Text>
            <Text>Loja: {product.storeId}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
