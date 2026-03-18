import { ActivityIndicator } from "react-native";

import { Box } from "@/src/components/ui/box";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";

type LoadingSpinnerProps = {
  label?: string;
  description?: string;
};

export function LoadingSpinner({
  label = "Carregando painel",
  description = "Sincronizando os dados para montar a proxima visao.",
}: LoadingSpinnerProps) {
  return (
    <Box className="flex-1 items-center justify-center bg-background-0 px-6">
      <VStack className="items-center gap-3 rounded-md border border-outline-200 bg-background-50 px-6 py-8">
        <ActivityIndicator size="large" />
        <VStack className="items-center gap-1">
          <Heading size="md">{label}</Heading>
          <Text className="text-center text-typography-600" size="sm">
            {description}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
