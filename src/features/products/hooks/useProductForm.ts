import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  Product,
  ProductInput,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";

const productFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do produto."),
  category: z.string().trim().min(1, "Informe a categoria do produto."),
  price: z
    .string()
    .trim()
    .min(1, "Informe o preco do produto.")
    .refine((value) => {
      const normalizedValue = Number(value.replace(",", "."));
      return Number.isFinite(normalizedValue) && normalizedValue >= 0;
    }, "Informe um preco valido."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

type UseProductFormParams = {
  isOpen: boolean;
  product?: Product | null;
};

const getProductFormDefaultValues = (
  product?: Product | null
): ProductFormValues => ({
  name: product?.name ?? "",
  category: product?.category ?? "",
  price: product ? String(product.price).replace(".", ",") : "",
});

const parsePriceValue = (price: string) => Number(price.replace(",", "."));

export const mapFormValuesToProductInput = (
  values: ProductFormValues,
  storeId: string
): ProductInput => ({
  name: values.name.trim(),
  category: values.category.trim(),
  price: parsePriceValue(values.price),
  storeId: storeId.trim(),
});

export const mapFormValuesToProductUpdateInput = (
  values: ProductFormValues
): ProductUpdateInput => ({
  name: values.name.trim(),
  category: values.category.trim(),
  price: parsePriceValue(values.price),
});

export const useProductForm = ({ isOpen, product }: UseProductFormParams) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getProductFormDefaultValues(product),
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    form.reset(getProductFormDefaultValues(product));
  }, [form, isOpen, product]);

  return form;
};
