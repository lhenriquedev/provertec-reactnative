import { Text } from "@/src/components/ui/text";

type StoreSubmitErrorProps = {
  message: string | null;
};

export function StoreSubmitError({ message }: StoreSubmitErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <Text className="text-error-700" size="sm">
      {message}
    </Text>
  );
}
