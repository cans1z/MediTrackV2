import type { FC } from "react";

import { HeaderNavigation } from "@/shared/config/navigation";

import { NavigationItem } from "./NavigationItem";

export const Navigation: FC = () => {
  return (
    <nav className="flex gap-2.5 w-full justify-center">
      {HeaderNavigation.map((item, idx) => (
        <NavigationItem item={item} key={item.label + idx}/>
      ))}
    </nav>
  );
};
