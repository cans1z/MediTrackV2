import type { FC } from "react";

import type { NavigationItem as NavigationItemType } from "@/shared/types";

import Link from "next/link";

interface Props {
  item: NavigationItemType;
}

export const NavigationItem: FC<Props> = ({ item }) => {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="flex gap-2.5">
      <Icon className="size-5" />

      <span>{item.label}</span>
    </Link>
  );
};
