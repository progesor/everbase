import { DockerDashboard } from '@/features/docker-dashboard/components/DockerDashboard';
import { AppLauncher } from '@/features/launcher/components/AppLauncher';
import {
  Terminal,
  BotMessageSquare,
  Settings,
  LayoutDashboard,
  Image as ImageIcon,
} from 'lucide-react';
import React from 'react';
import { WallpaperPicker } from '@/features/shell/components/WallpaperPicker';

export interface AppDefinition {
  id: string;
  name: string;
  icon: React.ElementType;
  component: React.ElementType;
  title?: string;
  minWidth?: number; // Yeni özellik: Minimum genişlik
  minHeight?: number; // Yeni özellik: Minimum yükseklik
}

export const appRegistry: AppDefinition[] = [
  {
    id: 'app-launcher',
    name: 'App Launcher',
    icon: BotMessageSquare,
    component: AppLauncher,
    minWidth: 400,
    minHeight: 350,
  },
  {
    id: 'wallpaper-picker',
    name: 'Change Wallpaper',
    icon: ImageIcon,
    component: WallpaperPicker,
    // DÜZELTME: Bu uygulama için mantıklı bir minimum boyut belirlendi.
    // Bu boyut, içeriğin bozulmasını engeller. (140px * 2 sütun + boşluklar)
    minWidth: 340,
    minHeight: 400,
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
