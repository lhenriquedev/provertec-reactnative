import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/src/components/ui/alert-dialog";
import { Button, ButtonSpinner, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import type { Store } from "@/src/features/stores/types/store.types";

type DeleteStoreAlertDialogProps = {
  store: Store | null;
  isDeleting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export function DeleteStoreAlertDialog({
  store,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteStoreAlertDialogProps) {
  const isOpen = Boolean(store);

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="md">Excluir loja</Heading>
        </AlertDialogHeader>

        <AlertDialogBody>
          <Text size="sm">
            Deseja excluir a loja <Text bold>{store?.name}</Text>? Esta acao nao pode
            ser desfeita.
          </Text>
          {errorMessage ? (
            <Text className="mt-3 text-error-700" size="sm">
              {errorMessage}
            </Text>
          ) : null}
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={onClose}
            isDisabled={isDeleting}
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button action="negative" onPress={onConfirm} isDisabled={isDeleting}>
            {isDeleting ? <ButtonSpinner /> : null}
            <ButtonText>Excluir</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
