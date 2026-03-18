import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/src/components/ui/alert-dialog";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { Product } from "@/src/features/products/types/product.types";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

type DeleteProductAlertDialogProps = {
  product: Product | null;
  isDeleting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export function DeleteProductAlertDialog({
  product,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteProductAlertDialogProps) {
  const isOpen = Boolean(product);

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop className="bg-background-950/70" />
      <AlertDialogContent className="rounded-md border-outline-200 bg-background-0 p-0">
        <AlertDialogHeader className="px-5 pt-5">
          <RetailBadge label="Acao destrutiva" tone="danger" />
        </AlertDialogHeader>

        <AlertDialogBody className="max-h-none px-5 py-4">
          <VStack className="gap-4">
            <Box className="rounded-md border border-error-300 bg-error-100 px-4 py-4">
              <VStack className="gap-2">
                <Text bold className="text-error-900" size="lg">
                  Excluir produto
                </Text>
                <Text className="text-error-800" size="sm">
                  Deseja remover <Text bold>{product?.name}</Text> do catalogo?
                  Essa exclusao e permanente.
                </Text>
              </VStack>
            </Box>

            <Text className="text-typography-600" size="sm">
              O item deixara de aparecer na loja, no painel e nos indicadores de
              ticket.
            </Text>

            {errorMessage ? (
              <Box className="rounded-2xl border border-error-300 bg-error-100 px-4 py-3">
                <Text className="text-error-800" size="sm">
                  {errorMessage}
                </Text>
              </Box>
            ) : null}
          </VStack>
        </AlertDialogBody>

        <AlertDialogFooter className="px-5 pb-5 pt-0">
          <Button
            className="h-12 flex-1 rounded-2xl"
            variant="outline"
            action="secondary"
            onPress={onClose}
            isDisabled={isDeleting}
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button
            className="h-12 flex-1 rounded-2xl"
            action="negative"
            onPress={onConfirm}
            isDisabled={isDeleting}
          >
            {isDeleting ? <ButtonSpinner /> : null}
            <ButtonText>Excluir</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
