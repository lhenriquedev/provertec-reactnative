import { Controller, type Control, type FieldErrors } from "react-hook-form";

import { Box } from "@/src/components/ui/box";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Input, InputField, InputSlot } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { ProductFormValues } from "@/src/features/products/hooks/useProductForm";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

type ProductFormVariant = "default" | "stitch";

type ProductFormProps = {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  isDisabled: boolean;
  variant?: ProductFormVariant;
};

type FieldCopy = {
  label: string;
  helperText: string;
  placeholder: string;
};

const fieldCopy: Record<
  ProductFormVariant,
  Record<keyof ProductFormValues, FieldCopy>
> = {
  default: {
    name: {
      label: "Nome do produto",
      helperText: "Escolha um nome comercial facil de reconhecer no painel.",
      placeholder: "Ex.: Fone Bluetooth",
    },
    category: {
      label: "Categoria",
      helperText: "Agrupe o item pela categoria usada no mix do dashboard.",
      placeholder: "Ex.: Eletronicos",
    },
    price: {
      label: "Preco",
      helperText:
        "Informe o valor no formato decimal para compor os indicadores de ticket.",
      placeholder: "Ex.: 129,90",
    },
  },
  stitch: {
    name: {
      label: "Nome do Produto",
      helperText: "",
      placeholder: "Ex.: Smartphone Galaxy S24",
    },
    category: {
      label: "Categoria",
      helperText: "",
      placeholder: "Ex.: Eletronicos",
    },
    price: {
      label: "Preco de Venda",
      helperText: "",
      placeholder: "0,00",
    },
  },
};

export function ProductForm({
  control,
  errors,
  isDisabled,
  variant = "default",
}: ProductFormProps) {
  const copy = fieldCopy[variant];
  const isStitchVariant = variant === "stitch";
  const fieldWrapperClassName = isStitchVariant ? "gap-2.5" : "gap-2";
  const inputClassName = isStitchVariant
    ? "h-14 rounded-xl border-tertiary-200 bg-background-0 data-[focus=true]:border-tertiary-500"
    : "h-12 rounded-2xl border-outline-200 bg-background-0";
  const inputFieldClassName = isStitchVariant
    ? "px-4 text-sm text-typography-900 placeholder:text-typography-400"
    : "text-sm";
  const labelTextClassName = isStitchVariant
    ? "ml-1 text-sm font-semibold text-typography-700"
    : undefined;

  return (
    <VStack className={isStitchVariant ? "gap-5" : "gap-4"}>
      {!isStitchVariant ? (
        <Box className="rounded-[24px] border border-outline-200 bg-background-50 p-4">
          <VStack className="gap-2">
            <RetailBadge
              label="Cadastro de produto"
              tone="neutral"
              className="self-start"
            />
            <Text className="text-typography-600" size="sm">
              Complete os campos essenciais para manter o catalogo da loja
              consistente.
            </Text>
          </VStack>
        </Box>
      ) : null}

      <FormControl className={fieldWrapperClassName} isInvalid={Boolean(errors.name)}>
        <FormControlLabel>
          <FormControlLabelText className={labelTextClassName}>
            {copy.name.label}
          </FormControlLabelText>
        </FormControlLabel>
        {copy.name.helperText ? (
          <FormControlHelper>
            <FormControlHelperText>{copy.name.helperText}</FormControlHelperText>
          </FormControlHelper>
        ) : null}
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input className={inputClassName} isDisabled={isDisabled}>
              <InputField
                className={inputFieldClassName}
                placeholder={copy.name.placeholder}
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

      <FormControl
        className={fieldWrapperClassName}
        isInvalid={Boolean(errors.category)}
      >
        <FormControlLabel>
          <FormControlLabelText className={labelTextClassName}>
            {copy.category.label}
          </FormControlLabelText>
        </FormControlLabel>
        {copy.category.helperText ? (
          <FormControlHelper>
            <FormControlHelperText>
              {copy.category.helperText}
            </FormControlHelperText>
          </FormControlHelper>
        ) : null}
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Input className={inputClassName} isDisabled={isDisabled}>
              <InputField
                className={inputFieldClassName}
                placeholder={copy.category.placeholder}
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
              />
            </Input>
          )}
        />
        {errors.category ? (
          <FormControlError>
            <FormControlErrorText>{errors.category.message}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>

      <FormControl className={fieldWrapperClassName} isInvalid={Boolean(errors.price)}>
        <FormControlLabel>
          <FormControlLabelText className={labelTextClassName}>
            {copy.price.label}
          </FormControlLabelText>
        </FormControlLabel>
        {copy.price.helperText ? (
          <FormControlHelper>
            <FormControlHelperText>{copy.price.helperText}</FormControlHelperText>
          </FormControlHelper>
        ) : null}
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <Input className={inputClassName} isDisabled={isDisabled}>
              {isStitchVariant ? (
                <InputSlot className="pl-4">
                  <Text bold className="text-tertiary-700">
                    R$
                  </Text>
                </InputSlot>
              ) : null}
              <InputField
                className={
                  isStitchVariant
                    ? "px-4 text-sm text-typography-900 placeholder:text-typography-400"
                    : "text-sm"
                }
                keyboardType="decimal-pad"
                placeholder={copy.price.placeholder}
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
