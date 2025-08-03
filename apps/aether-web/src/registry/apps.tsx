import { DockerDashboard } from '@/features/docker-dashboard/components/DockerDashboard';
import { AppLauncher } from '@/features/launcher/components/AppLauncher';
import {
  Terminal,
  BotMessageSquare,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import React from 'react';

export interface AppDefinition {
  id: string;
  name: string;
  icon: React.ElementType;
  component: React.ElementType;
  title?: string;
}

export const appRegistry: AppDefinition[] = [
  {
    id: 'app-launcher',
    name: 'App Launcher',
    icon: BotMessageSquare,
    component: AppLauncher,
  },
  {
    id: 'docker-dashboard',
    name: 'Docker Dashboard',
    icon: LayoutDashboard,
    component: DockerDashboard,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: Terminal,
    component: () => <div>Terminal App</div>,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    component: () => <div>Settings App</div>,
  },
];
