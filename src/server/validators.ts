import type { ProductInput, StoreInput } from "@/src/server/types";
import { z } from "zod";

type ProductParserOptions = {
  requireStoreId: boolean;
};

const nonEmptyTrimmedStringSchema = z.string().trim().min(1);

const storeInputSchema = z.object({
  name: nonEmptyTrimmedStringSchema,
  address: nonEmptyTrimmedStringSchema,
});

const baseProductInputSchema = z.object({
  name: nonEmptyTrimmedStringSchema,
  category: nonEmptyTrimmedStringSchema,
  price: z.number().finite().gte(0),
});

const productWithStoreIdSchema = baseProductInputSchema.extend({
  storeId: nonEmptyTrimmedStringSchema,
});

const productWithoutRequiredStoreIdSchema = baseProductInputSchema.extend({
  storeId: z
    .unknown()
    .optional()
    .transform((value) => {
      if (typeof value !== "string") {
        return "";
      }

      const trimmedValue = value.trim();
      return trimmedValue.length > 0 ? trimmedValue : "";
    }),
});

export function parseStoreInput(raw: unknown): StoreInput | null {
  const result = storeInputSchema.safeParse(raw);
  return result.success ? result.data : null;
}

export function parseProductInput(
  raw: unknown,
  options: ProductParserOptions
): ProductInput | null {
  const schema = options.requireStoreId
    ? productWithStoreIdSchema
    : productWithoutRequiredStoreIdSchema;
  const result = schema.safeParse(raw);

  return result.success ? result.data : null;
}
