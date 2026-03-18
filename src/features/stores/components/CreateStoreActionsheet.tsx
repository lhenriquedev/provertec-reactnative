import { Button, ButtonSpinner, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/src/components/ui/actionsheet";
import { StoreForm } from "@/src/features/stores/components/StoreForm";
import { StoreSubmitError } from "@/src/features/stores/components/StoreSubmitError";
import { useStoreForm } from "@/src/features/stores/hooks/useStoreForm";
import type { StoreInput } from "@/src/features/stores/types/store.types";
import { getStoreSubmitLabel } from "@/src/features/stores/utils/getStoreSubmitLabel";

type CreateStoreActionsheetProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: StoreInput) => Promise<void> | void;
};

export function CreateStoreActionsheet({
  isOpen,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: CreateStoreActionsheetProps) {
  const { control, handleSubmit, formState } = useStoreForm({ isOpen });

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack className="w-full gap-5 px-2 pb-2 pt-3">
          <VStack className="gap-1">
            <Heading size="lg">Criar loja</Heading>
            <Text size="sm">Preencha os dados para cadastrar uma nova loja.</Text>
          </VStack>

          <StoreForm
            control={control}
            errors={formState.errors}
            isDisabled={isSubmitting}
          />

          <StoreSubmitError message={errorMessage} />

          <VStack className="gap-2">
            <Button onPress={handleFormSubmit} isDisabled={isSubmitting}>
              {isSubmitting ? <ButtonSpinner /> : null}
              <ButtonText>
                {getStoreSubmitLabel("create", isSubmitting)}
              </ButtonText>
            </Button>
            <Button
              variant="outline"
              action="secondary"
              onPress={onClose}
              isDisabled={isSubmitting}
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
