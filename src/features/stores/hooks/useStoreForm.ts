import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { getStoreFormDefaultValues } from "@/src/domain/stores/get-store-form-default-values";
import { storeInputSchema } from "@/src/domain/stores/schemas";
import type { StoreInput } from "@/src/features/stores/types/store.types";

type UseStoreFormParams = {
  isOpen: boolean;
  store?: Partial<Pick<StoreInput, "name" | "address">> | null;
};

export const useStoreForm = ({ isOpen, store }: UseStoreFormParams) => {
  const form = useForm<StoreInput>({
    resolver: zodResolver(storeInputSchema),
    defaultValues: getStoreFormDefaultValues(store),
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    form.reset(getStoreFormDefaultValues(store));
  }, [form, isOpen, store]);

  return form;
};
