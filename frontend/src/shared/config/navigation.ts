import type { Navigation, NavigationItem } from "../types";

import { Plus } from "lucide-react";

const GlobalNavigation = {
  pizda: {
    href: "",
    label: "Пизда",
    icon: Plus,
  },
  pizda1: {
    href: "",
    label: "Пизда",
    icon: Plus,
  },
  pizda2: {
    href: "",
    label: "Пизда",
    icon: Plus,
  },
  pizda3: {
    href: "",
    label: "Пизда",
    icon: Plus,
  },
};

export const HeaderNavigation: Navigation = [
  GlobalNavigation.pizda,
  GlobalNavigation.pizda1,
  GlobalNavigation.pizda2,
];

export const SidebarNavigation: Navigation = [
  GlobalNavigation.pizda,
  GlobalNavigation.pizda,
  GlobalNavigation.pizda,
];
