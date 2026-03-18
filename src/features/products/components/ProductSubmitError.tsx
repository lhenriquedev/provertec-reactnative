import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

type ProductSubmitErrorProps = {
  message: string | null;
};

export function ProductSubmitError({ message }: ProductSubmitErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <Box className="rounded-2xl border border-error-300 bg-error-100 px-4 py-3">
      <VStack className="gap-2">
        <RetailBadge label="Falha no envio" tone="danger" className="self-start" />
        <Text className="text-error-800" size="sm">
          {message}
        </Text>
      </VStack>
    </Box>
  );
}
