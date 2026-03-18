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
import { RetailBadge } from "@/src/shared/components/RetailBadge";
import type { StoreInput } from "@/src/features/stores/types/store.types";

type StoreFormProps = {
  control: Control<StoreInput>;
  errors: FieldErrors<StoreInput>;
  isDisabled: boolean;
};

export function StoreForm({ control, errors, isDisabled }: StoreFormProps) {
  return (
    <VStack className="gap-4">
      <Box className="rounded-[24px] border border-outline-200 bg-background-50 p-4">
        <VStack className="gap-2">
          <RetailBadge label="Identidade da loja" tone="neutral" className="self-start" />
          <Text className="text-typography-600" size="sm">
            Defina um nome claro para localizar a unidade com rapidez.
          </Text>
        </VStack>
      </Box>

      <FormControl className="gap-2" isInvalid={Boolean(errors.name)}>
        <FormControlLabel>
          <FormControlLabelText>Nome da loja</FormControlLabelText>
        </FormControlLabel>
        <FormControlHelper>
          <FormControlHelperText>
            Esse nome aparece no dashboard, na rede e nas telas de produtos.
          </FormControlHelperText>
        </FormControlHelper>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input className="h-12 rounded-2xl border-outline-200 bg-background-0" isDisabled={isDisabled}>
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
        <FormControlHelper>
          <FormControlHelperText>
            Use um endereco curto e reconhecivel para facilitar a operacao.
          </FormControlHelperText>
        </FormControlHelper>
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <Input className="h-12 rounded-2xl border-outline-200 bg-background-0" isDisabled={isDisabled}>
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
            <FormControlErrorText>{errors.address.message}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>
    </VStack>
  );
}
