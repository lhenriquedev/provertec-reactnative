import { Text } from "@/src/components/ui/text";

type ProductSubmitErrorProps = {
  message: string | null;
};

export function ProductSubmitError({ message }: ProductSubmitErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <Text className="text-error-700" size="sm">
      {message}
    </Text>
  );
}
