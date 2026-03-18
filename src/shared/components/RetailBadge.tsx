import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";

type RetailBadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

type RetailBadgeProps = {
  label?: string;
  children?: React.ReactNode;
  tone?: RetailBadgeTone;
  className?: string;
  textClassName?: string;
};

const toneClassNames: Record<RetailBadgeTone, { root: string; text: string }> = {
  neutral: {
    root: "border-outline-200 bg-background-100",
    text: "text-typography-700",
  },
  accent: {
    root: "border-tertiary-300 bg-tertiary-100",
    text: "text-tertiary-800",
  },
  success: {
    root: "border-success-300 bg-success-100",
    text: "text-success-800",
  },
  warning: {
    root: "border-warning-300 bg-warning-100",
    text: "text-warning-800",
  },
  danger: {
    root: "border-error-300 bg-error-100",
    text: "text-error-800",
  },
};

export function RetailBadge({
  label,
  children,
  tone = "neutral",
  className,
  textClassName,
}: RetailBadgeProps) {
  const content = label ?? children;

  return (
    <Box
      className={`rounded-full border px-3 py-1 ${toneClassNames[tone].root} ${className ?? ""}`}
    >
      <Text
        className={`text-2xs font-bold uppercase tracking-[0.8px] ${toneClassNames[tone].text} ${textClassName ?? ""}`}
      >
        {content}
      </Text>
    </Box>
  );
}
