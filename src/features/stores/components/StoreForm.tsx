import { Controller, type Control, type FieldErrors } from "react-hook-form";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Input, InputField } from "@/src/components/ui/input";
import { VStack } from "@/src/components/ui/vstack";
import type { StoreInput } from "@/src/features/stores/types/store.types";

type StoreFormProps = {
  control: Control<StoreInput>;
  errors: FieldErrors<StoreInput>;
  isDisabled: boolean;
};

export function StoreForm({ control, errors, isDisabled }: StoreFormProps) {
  return (
    <VStack className="gap-4">
      <FormControl className="gap-2" isInvalid={Boolean(errors.name)}>
        <FormControlLabel>
          <FormControlLabelText>Nome da loja</FormControlLabelText>
        </FormControlLabel>

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              className="h-12 rounded-2xl border-outline-200 bg-background-0"
              isDisabled={isDisabled}
            >
              <InputField
                className="text-sm"
                placeholder="Ex.: Loja Centro"
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
              />
            </Input>
          )}
        />
        {errors.name ? (
          <FormControlError>
            <FormControlErrorText>{errors.name.message}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>

      <FormControl className="gap-2" isInvalid={Boolean(errors.address)}>
        <FormControlLabel>
          <FormControlLabelText>Endereco</FormControlLabelText>
        </FormControlLabel>

        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <Input
              className="h-12 rounded-2xl border-outline-200 bg-background-0"
              isDisabled={isDisabled}
            >
              <InputField
                className="text-sm"
                placeholder="Ex.: Rua das Flores, 120"
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
              />
            </Input>
          )}
        />

        {errors.address ? (
          <FormControlError>
            <FormControlErrorText>
              {errors.address.message}
            </FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>
    </VStack>
  );
}
