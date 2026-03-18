import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "@/src/components/ui/actionsheet";
import { Button, ButtonSpinner, ButtonText } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { ProductForm } from "@/src/features/products/components/ProductForm";
import { ProductSubmitError } from "@/src/features/products/components/ProductSubmitError";
import {
  mapFormValuesToProductInput,
  useProductForm,
} from "@/src/features/products/hooks/useProductForm";
import type { ProductInput } from "@/src/features/products/types/product.types";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

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
      <ActionsheetBackdrop className="bg-background-950/70" />
      <ActionsheetContent className="max-h-[92%] rounded-t-[36px] border-outline-200 bg-background-50 px-0 pb-safe">
        <ActionsheetDragIndicatorWrapper className="pt-2">
          <ActionsheetDragIndicator className="w-16 bg-tertiary-300" />
        </ActionsheetDragIndicatorWrapper>

        <ActionsheetScrollView
          className="w-full"
          contentContainerClassName="px-5 pb-6 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <VStack className="gap-6">
            <VStack className="gap-4">
              <VStack className="gap-2">
                <RetailBadge
                  label="Novo produto"
                  tone="accent"
                  className="self-start border-tertiary-200 bg-tertiary-100"
                />
                <Text bold className="text-typography-950" size="2xl">
                  Novo Produto
                </Text>
                <Text className="leading-6 text-typography-600" size="sm">
                  Cadastre um item com nome, categoria e preco para ele entrar
                  imediatamente no catalogo da unidade.
                </Text>
              </VStack>
            </VStack>

            <ProductForm
              control={control}
              errors={formState.errors}
              isDisabled={isSubmitting}
              variant="stitch"
            />

            <ProductSubmitError message={errorMessage} />

            <VStack className="gap-3 pt-2">
              <Button
                className="h-12 rounded-xl bg-primary-500 shadow-lg shadow-primary-200"
                onPress={handleFormSubmit}
                isDisabled={isSubmitting}
              >
                {isSubmitting ? <ButtonSpinner /> : null}
                <ButtonText>
                  {isSubmitting ? "Salvando..." : "Salvar Produto"}
                </ButtonText>
              </Button>
              <Button
                className="h-12 rounded-xl border-0 bg-tertiary-100"
                action="secondary"
                onPress={onClose}
                isDisabled={isSubmitting}
              >
                <ButtonText className="text-tertiary-800">Cancelar</ButtonText>
              </Button>
            </VStack>

            <Text className="px-2 text-center text-2xs leading-5 text-typography-500">
              As alteracoes sao aplicadas instantaneamente ao catalogo da loja.
            </Text>
          </VStack>
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
}
