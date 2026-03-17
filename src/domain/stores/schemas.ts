import { z } from "zod";

const nonEmptyTrimmedStringSchema = z.string().trim().min(1);

export const storeInputSchema = z.object({
  name: nonEmptyTrimmedStringSchema,
  address: nonEmptyTrimmedStringSchema,
});

export const storeDtoSchema = z.object({
  id: nonEmptyTrimmedStringSchema,
  name: nonEmptyTrimmedStringSchema,
  address: nonEmptyTrimmedStringSchema,
  productsCount: z.number().int().gte(0),
});

export const storeListResponseDtoSchema = z.object({
  stores: z.array(storeDtoSchema),
});

export const storeDetailResponseDtoSchema = z.object({
  store: storeDtoSchema,
});
