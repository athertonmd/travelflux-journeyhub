
import { ReactNode } from 'react';

export interface FeatureSubItem {
  name: string;
  path: string;
  icon: ReactNode;
}

export interface NavLink {
  name: string;
  path: string;
  section?: string;
  hasSubmenu?: boolean;
}
