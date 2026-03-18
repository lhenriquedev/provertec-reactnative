import { Box } from "@/src/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/src/components/ui/button";
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
  mapFormValuesToProductUpdateInput,
  useProductForm,
} from "@/src/features/products/hooks/useProductForm";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import type {
  Product,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";

type EditProductActionsheetProps = {
  product: Product | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: ProductUpdateInput) => Promise<void> | void;
};

export function EditProductActionsheet({
  product,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: EditProductActionsheetProps) {
  const isOpen = Boolean(product);
  const { control, handleSubmit, formState } = useProductForm({
    isOpen,
    product,
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(mapFormValuesToProductUpdateInput(values));
  });

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop className="bg-background-950/70" />
      <ActionsheetContent className="rounded-t-[36px] border-outline-200 bg-background-0 px-0 pb-safe">
        <ActionsheetDragIndicatorWrapper className="pt-2">
          <ActionsheetDragIndicator className="w-20 bg-background-300" />
        </ActionsheetDragIndicatorWrapper>

        <VStack className="w-full gap-5 px-5 pb-6 pt-2">
          <Box className="rounded-[28px] border border-tertiary-300 bg-tertiary-100 px-4 py-5">
            <VStack className="gap-2">
              <RetailBadge label="Editar produto" tone="accent" className="self-start" />
              <Text bold className="text-typography-950" size="lg">
                Revisar item do catalogo.
              </Text>
              <Text className="text-typography-700" size="sm">
                {product ? `Atualize ${product.name} para refletir o catalogo real.` : "Atualize os dados do produto selecionado."}
              </Text>
            </VStack>
          </Box>

          <VStack className="gap-2">
            <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
              Dados do produto
            </Text>
            <Text className="text-typography-600" size="sm">
              Revise o cadastro para manter a leitura de preco e categoria consistente.
            </Text>
          </VStack>

          <ProductForm
            control={control}
            errors={formState.errors}
            isDisabled={isSubmitting}
          />

          <ProductSubmitError message={errorMessage} />

          <VStack className="gap-2">
            <Button className="h-12 rounded-2xl" onPress={handleFormSubmit} isDisabled={isSubmitting}>
              {isSubmitting ? <ButtonSpinner /> : null}
              <ButtonText>{isSubmitting ? "Salvando..." : "Salvar alteracoes"}</ButtonText>
            </Button>
            <Button
              className="h-12 rounded-2xl"
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
