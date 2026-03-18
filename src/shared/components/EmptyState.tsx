import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box className="rounded-md border border-dashed border-outline-300 bg-background-50 px-6 py-10">
      <VStack className="items-center justify-center gap-4">
        <RetailBadge label="Retail manager" tone="neutral" />

        <VStack className="items-center gap-1">
          <Heading className="text-center" size="md">
            {title}
          </Heading>
          <Text className="text-center text-typography-600" size="sm">
            {description}
          </Text>
        </VStack>

        {actionLabel && onAction ? (
          <Button onPress={onAction}>
            <ButtonText>{actionLabel}</ButtonText>
          </Button>
        ) : null}
      </VStack>
    </Box>
  );
}
