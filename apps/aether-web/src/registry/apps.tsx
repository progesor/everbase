import React from 'react';
import { DockerDashboard } from '@/features/docker-dashboard/components/DockerDashboard';
import { AppWindow, Settings } from 'lucide-react'; // Ayarlar için daha uygun bir ikon import edelim

type IconComponent = React.ForwardRefExoticComponent<
  React.RefAttributes<SVGSVGElement> & { size?: number; className?: string }
>;

export interface AppDefinition {
  id: string;
  name: string;
  icon: IconComponent;
  component: React.ComponentType;
}

export const appRegistry: AppDefinition[] = [
  {
    id: 'docker-dashboard',
    name: 'Docker',
    icon: AppWindow,
    component: DockerDashboard,
  },
  {
    id: 'settings',
    name: 'Ayarlar',
    icon: Settings,
    component: () => <div>Ayarlar Uygulaması İçeriği</div>,
  },
];
