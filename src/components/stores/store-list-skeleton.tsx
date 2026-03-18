import { Box } from "@/src/components/ui/box";
import { Skeleton, SkeletonText } from "@/src/components/ui/skeleton";
import { VStack } from "@/src/components/ui/vstack";

const PLACEHOLDER_ITEMS = ["a", "b", "c"];

export function StoreListSkeleton() {
  return (
    <VStack className="gap-3">
      {PLACEHOLDER_ITEMS.map((item) => (
        <Box
          key={item}
          className="rounded-xl border border-outline-200 bg-background-50 p-4"
        >
          <VStack className="gap-3">
            <Skeleton className="h-5 w-40" />
            <SkeletonText _lines={2} className="h-3" />
            <VStack className="gap-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </VStack>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}
