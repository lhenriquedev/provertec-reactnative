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
import { StoreForm } from "@/src/features/stores/components/StoreForm";
import { StoreSubmitError } from "@/src/features/stores/components/StoreSubmitError";
import { useStoreForm } from "@/src/features/stores/hooks/useStoreForm";
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import type { Store, StoreInput } from "@/src/features/stores/types/store.types";
import { getStoreSubmitLabel } from "@/src/features/stores/utils/getStoreSubmitLabel";

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
  const { control, handleSubmit, formState } = useStoreForm({ isOpen, store });

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
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
              <RetailBadge label="Editar loja" tone="accent" className="self-start" />
              <Text bold className="text-typography-950" size="lg">
                Ajustar a operacao da unidade.
              </Text>
              <Text className="text-typography-700" size="sm">
                {store ? `Voce esta atualizando ${store.name}.` : "Atualize os dados da loja selecionada."}
              </Text>
            </VStack>
          </Box>

          <VStack className="gap-2">
            <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
              Dados da unidade
            </Text>
            <Text className="text-typography-600" size="sm">
              Mantenha nome e endereco sincronizados com a operacao real.
            </Text>
          </VStack>

          <StoreForm
            control={control}
            errors={formState.errors}
            isDisabled={isSubmitting}
          />

          <StoreSubmitError message={errorMessage} />

          <VStack className="gap-2">
            <Button className="h-12 rounded-2xl" onPress={handleFormSubmit} isDisabled={isSubmitting}>
              {isSubmitting ? <ButtonSpinner /> : null}
              <ButtonText>{getStoreSubmitLabel("edit", isSubmitting)}</ButtonText>
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
