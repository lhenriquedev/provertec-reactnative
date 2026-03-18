import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";

type StoreErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function StoreErrorState({ message, onRetry }: StoreErrorStateProps) {
  return (
    <Box className="rounded-xl border border-error-300 bg-background-error p-5">
      <VStack className="gap-3">
        <Heading size="md">Erro ao carregar lojas</Heading>
        <Text className="text-error-700" size="sm">
          {message}
        </Text>
        <Button onPress={onRetry} action="secondary" variant="outline">
          <ButtonText>Tentar novamente</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
