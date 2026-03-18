import { Controller, type Control, type FieldErrors } from "react-hook-form";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Input, InputField, InputSlot } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { ProductFormValues } from "@/src/features/products/hooks/useProductForm";

type ProductFormVariant = "default" | "stitch";

type ProductFormProps = {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  isDisabled: boolean;
  variant?: ProductFormVariant;
};

export function ProductForm({
  control,
  errors,
  isDisabled,
  variant = "default",
}: ProductFormProps) {
  return (
    <VStack space="md">
      <FormControl isInvalid={Boolean(errors.name)}>
        <FormControlLabel>
          <FormControlLabelText>Nome do produto</FormControlLabelText>
        </FormControlLabel>

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input isDisabled={isDisabled}>
              <InputField
                placeholder="Ex.: Fone Bluetooth"
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

      <FormControl isInvalid={Boolean(errors.category)}>
        <FormControlLabel>
          <FormControlLabelText>Categoria do produto</FormControlLabelText>
        </FormControlLabel>

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Input isDisabled={isDisabled}>
              <InputField
                placeholder="Ex.: Eletronicos"
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
              />
            </Input>
          )}
        />
        {errors.category ? (
          <FormControlError>
            <FormControlErrorText>
              {errors.category.message}
            </FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>

      <FormControl isInvalid={Boolean(errors.price)}>
        <FormControlLabel>
          <FormControlLabelText>Preço do produto</FormControlLabelText>
        </FormControlLabel>

        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <Input isDisabled={isDisabled}>
              <InputSlot className="pl-4">
                <Text bold className="text-tertiary-700">
                  R$
                </Text>
              </InputSlot>
              <InputField
                keyboardType="decimal-pad"
                placeholder="Ex.: 129.90"
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
              />
            </Input>
          )}
        />
        {errors.price ? (
          <FormControlError>
            <FormControlErrorText>{errors.price.message}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>
    </VStack>
  );
}
