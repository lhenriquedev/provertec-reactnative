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
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import type { ProductFormValues } from "@/src/features/products/hooks/useProductForm";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

type ProductFormProps = {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  isDisabled: boolean;
};

export function ProductForm({ control, errors, isDisabled }: ProductFormProps) {
  return (
    <VStack className="gap-4">
      <Box className="rounded-[24px] border border-outline-200 bg-background-50 p-4">
        <VStack className="gap-2">
          <RetailBadge label="Cadastro de produto" tone="neutral" className="self-start" />
          <Text className="text-typography-600" size="sm">
            Complete os campos essenciais para manter o catalogo da loja consistente.
          </Text>
        </VStack>
      </Box>

      <FormControl className="gap-2" isInvalid={Boolean(errors.name)}>
        <FormControlLabel>
          <FormControlLabelText>Nome do produto</FormControlLabelText>
        </FormControlLabel>
        <FormControlHelper>
          <FormControlHelperText>
            Escolha um nome comercial facil de reconhecer no painel.
          </FormControlHelperText>
        </FormControlHelper>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input className="h-12 rounded-2xl border-outline-200 bg-background-0" isDisabled={isDisabled}>
              <InputField
                className="text-sm"
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

      <FormControl className="gap-2" isInvalid={Boolean(errors.category)}>
        <FormControlLabel>
          <FormControlLabelText>Categoria</FormControlLabelText>
        </FormControlLabel>
        <FormControlHelper>
          <FormControlHelperText>
            Agrupe o item pela categoria usada no mix do dashboard.
          </FormControlHelperText>
        </FormControlHelper>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Input className="h-12 rounded-2xl border-outline-200 bg-background-0" isDisabled={isDisabled}>
              <InputField
                className="text-sm"
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
            <FormControlErrorText>{errors.category.message}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>

      <FormControl className="gap-2" isInvalid={Boolean(errors.price)}>
        <FormControlLabel>
          <FormControlLabelText>Preco</FormControlLabelText>
        </FormControlLabel>
        <FormControlHelper>
          <FormControlHelperText>
            Informe o valor no formato decimal para compor os indicadores de ticket.
          </FormControlHelperText>
        </FormControlHelper>
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <Input className="h-12 rounded-2xl border-outline-200 bg-background-0" isDisabled={isDisabled}>
              <InputField
                className="text-sm"
                keyboardType="decimal-pad"
                placeholder="Ex.: 129,90"
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
