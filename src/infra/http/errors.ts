import { isAxiosError } from "axios";

export type ApiError = {
  message: string;
  statusCode?: number;
  details?: unknown;
};

const FALLBACK_MESSAGE = "Nao foi possivel concluir a requisicao.";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export const normalizeHttpError = (error: unknown): ApiError => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data;
    const responseStatusCode = error.response?.status;

    if (isRecord(responseData) && typeof responseData.message === "string") {
      return {
        message: responseData.message,
        statusCode: responseStatusCode,
        details: responseData,
      };
    }

    return {
      message: error.message || FALLBACK_MESSAGE,
      statusCode: responseStatusCode,
      details: responseData,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: FALLBACK_MESSAGE, details: error };
};
