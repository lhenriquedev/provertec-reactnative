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
import { getStoreSubmitLabel } from "@/src/domain/stores/get-store-submit-label";
import type { Store, StoreInput } from "@/src/domain/stores/types";
import { useStoreForm } from "@/src/domain/stores/use-store-form";

import { StoreFormFields } from "@/src/components/stores/store-form-fields";
import { StoreSubmitError } from "@/src/components/stores/store-submit-error";

type EditStoreActionsheetProps = {
  store: Store | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: StoreInput) => Promise<void> | void;
};

export function EditStoreActionsheet({
  store,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: EditStoreActionsheetProps) {
  const isOpen = Boolean(store);
  const { control, handleSubmit, formState } = useStoreForm({
    isOpen,
    store,
  });

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
            <Heading size="lg">Editar loja</Heading>
            <Text size="sm">Atualize os dados da loja selecionada.</Text>
          </VStack>

          <StoreFormFields
            control={control}
            errors={formState.errors}
            isDisabled={isSubmitting}
          />

          <StoreSubmitError message={errorMessage} />

          <VStack className="gap-2">
            <Button onPress={handleFormSubmit} isDisabled={isSubmitting}>
              {isSubmitting ? <ButtonSpinner /> : null}
              <ButtonText>{getStoreSubmitLabel("edit", isSubmitting)}</ButtonText>
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
