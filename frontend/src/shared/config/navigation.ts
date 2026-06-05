import type { Navigation, NavigationItem } from "../types";

import { Calendar, FileText, LayoutDashboard, Pill, Plus } from "lucide-react";

const GlobalNavigation = {
  dashboard: {
    href: "/dashboard",
    label: "Главная",
    icon: LayoutDashboard,
  },
  medications: {
    href: "/medications",
    label: "Медикаменты",
    icon: Pill,
  },
  prescriptions: {
    href: "/prescriptions",
    label: "Рецепты",
    icon: FileText,
  },
  intakes: {
    href: "/intakes",
    label: "График приема",
    icon: Calendar,
  },
};

export const HeaderNavigation: Navigation = [
  GlobalNavigation.dashboard,
  GlobalNavigation.medications,
  GlobalNavigation.prescriptions,
  GlobalNavigation.intakes
];

export const SidebarNavigation: Navigation = [
  GlobalNavigation.dashboard,
  GlobalNavigation.medications,
  GlobalNavigation.prescriptions,
  GlobalNavigation.intakes
];
