type StoreFormMode = "create" | "edit";

export const getStoreSubmitLabel = (
  mode: StoreFormMode,
  isSubmitting: boolean
): string => {
  if (isSubmitting) {
    return mode === "create" ? "Criando loja..." : "Salvando alteracoes...";
  }

  return mode === "create" ? "Criar loja" : "Salvar alteracoes";
};
