import {
  BadgeCheck,
  Lightbulb,
  type LucideIcon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";

// Mapea claves de `lib/content` a iconos de línea (manual §9: line icons).
const ICONS: Record<string, LucideIcon> = {
  truck: Truck,
  "shield-check": ShieldCheck,
  zap: Zap,
  "badge-check": BadgeCheck,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  "trending-up": TrendingUp,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component className={className} strokeWidth={1.5} aria-hidden />;
}
