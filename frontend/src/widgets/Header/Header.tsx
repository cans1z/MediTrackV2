import type { FC } from 'react';

import { Actions } from "./ui/Actions";
import { Logo } from "./ui/Logo";
import { Navigation } from "./ui/Navigation/Navigation";

export const Header: FC = () => {
  return (
    <header className='flex max-w-7xl w-full justify-between items-center h-12.5 mx-auto'>
      <Logo />

      <Navigation />

      <Actions />
    </header>
  );
};