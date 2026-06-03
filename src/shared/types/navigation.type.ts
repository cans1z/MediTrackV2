import type { LucideProps } from "lucide-react"
import type { ComponentType } from "react"

export interface NavigationItem {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
};

export type Navigation = NavigationItem[];