import { Box } from "@/src/components/ui/box";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { RetailBadge } from "@/src/shared/components/RetailBadge";

type MetricTone = "neutral" | "accent" | "success" | "warning";

type MetricCardProps = {
  title: string;
  value: string;
  helper?: string;
  badge?: string;
  tone?: MetricTone;
  className?: string;
};

const toneClassNames: Record<MetricTone, string> = {
  neutral: "border-outline-200 bg-background-50",
  accent: "border-tertiary-300 bg-tertiary-50",
  success: "border-success-300 bg-success-50",
  warning: "border-warning-300 bg-warning-50",
};

const badgeTones: Record<MetricTone, "neutral" | "accent" | "success" | "warning"> = {
  neutral: "neutral",
  accent: "accent",
  success: "success",
  warning: "warning",
};

export function MetricCard({
  title,
  value,
  helper,
  badge,
  tone = "neutral",
  className,
}: MetricCardProps) {
  return (
    <Box
      className={`min-h-[144px] flex-1 rounded-[28px] border p-5 ${toneClassNames[tone]} ${className ?? ""}`}
    >
      <VStack className="flex-1 justify-between gap-4">
        <HStack className="items-start justify-between gap-3">
          <Text className="flex-1 text-2xs font-bold uppercase tracking-[0.9px] text-typography-500">
            {title}
          </Text>
          {badge ? <RetailBadge tone={badgeTones[tone]}>{badge}</RetailBadge> : null}
        </HStack>

        <VStack className="gap-1">
          <Heading className="text-typography-950" size="2xl">
            {value}
          </Heading>
          {helper ? (
            <Text className="text-typography-600" size="sm">
              {helper}
            </Text>
          ) : null}
        </VStack>
      </VStack>
    </Box>
  );
}
