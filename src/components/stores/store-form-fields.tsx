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
import type { StoreInput } from "@/src/domain/stores/types";

type StoreFormFieldsProps = {
  control: Control<StoreInput>;
  errors: FieldErrors<StoreInput>;
  isDisabled: boolean;
};

export function StoreFormFields({
  control,
  errors,
  isDisabled,
}: StoreFormFieldsProps) {
  return (
    <VStack className="gap-4">
      <FormControl isInvalid={Boolean(errors.name)}>
        <FormControlLabel>
          <FormControlLabelText>Nome da loja</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input isDisabled={isDisabled}>
              <InputField
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

      <FormControl isInvalid={Boolean(errors.address)}>
        <FormControlLabel>
          <FormControlLabelText>Endereco</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <Input isDisabled={isDisabled}>
              <InputField
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
            <FormControlErrorText>{errors.address.message}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>
    </VStack>
  );
}
