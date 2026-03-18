import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";

type StoreEmptyStateProps = {
  onCreate: () => void;
};

export function StoreEmptyState({ onCreate }: StoreEmptyStateProps) {
  return (
    <Box className="rounded-xl border border-dashed border-outline-300 bg-background-50 p-5">
      <VStack className="gap-3">
        <Heading size="md">Nenhuma loja cadastrada</Heading>
        <Text size="sm">
          Comece criando sua primeira loja para organizar os produtos.
        </Text>
        <Button onPress={onCreate}>
          <ButtonText>Criar primeira loja</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
