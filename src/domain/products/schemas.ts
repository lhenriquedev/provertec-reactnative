import { z } from "zod";

const nonEmptyTrimmedStringSchema = z.string().trim().min(1);

export const productInputSchema = z.object({
  name: nonEmptyTrimmedStringSchema,
  category: nonEmptyTrimmedStringSchema,
  price: z.number().gte(0),
  storeId: nonEmptyTrimmedStringSchema,
});

export const productUpdateInputSchema = z.object({
  name: nonEmptyTrimmedStringSchema,
  category: nonEmptyTrimmedStringSchema,
  price: z.number().gte(0),
});

export const productDtoSchema = z.object({
  id: nonEmptyTrimmedStringSchema,
  name: nonEmptyTrimmedStringSchema,
  category: nonEmptyTrimmedStringSchema,
  price: z.number().gte(0),
  storeId: nonEmptyTrimmedStringSchema,
});

export const productListResponseDtoSchema = z.object({
  products: z.array(productDtoSchema),
});

export const productDetailResponseDtoSchema = z.object({
  product: productDtoSchema,
});
