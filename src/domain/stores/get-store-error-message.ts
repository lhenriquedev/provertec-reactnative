const FALLBACK_MESSAGE = "Nao foi possivel concluir a operacao.";

export const getStoreErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return FALLBACK_MESSAGE;
};
