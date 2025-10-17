
import { ReactNode } from 'react';

export interface HomeModuleCard {
  title: string;
  description: string;
  icon: ReactNode | string;
  link: string;
  color: string;
  performanceValue?: number;
  ringColor?: string;
  isNewFeature?: boolean;
}
