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
import { ProductForm } from "@/src/features/products/components/ProductForm";
import { ProductSubmitError } from "@/src/features/products/components/ProductSubmitError";
import {
  mapFormValuesToProductInput,
  useProductForm,
} from "@/src/features/products/hooks/useProductForm";
import type { ProductInput } from "@/src/features/products/types/product.types";

type CreateProductActionsheetProps = {
  storeId: string;
  isOpen: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: ProductInput) => Promise<void> | void;
};

export function CreateProductActionsheet({
  storeId,
  isOpen,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: CreateProductActionsheetProps) {
  const { control, handleSubmit, formState } = useProductForm({ isOpen });

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(mapFormValuesToProductInput(values, storeId));
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
            <Heading size="lg">Criar produto</Heading>
            <Text size="sm">Cadastre um novo produto para esta loja.</Text>
          </VStack>

          <ProductForm
            control={control}
            errors={formState.errors}
            isDisabled={isSubmitting}
          />

          <ProductSubmitError message={errorMessage} />

          <VStack className="gap-2">
            <Button onPress={handleFormSubmit} isDisabled={isSubmitting}>
              {isSubmitting ? <ButtonSpinner /> : null}
              <ButtonText>{isSubmitting ? "Salvando..." : "Salvar produto"}</ButtonText>
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
