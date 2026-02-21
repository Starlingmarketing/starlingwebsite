import { createContext } from 'react';

export const NavOverrideContext = createContext({
  activeOverride: null,
  setActiveOverride: () => {},
  triggerGalleryTransition: () => {},
});
