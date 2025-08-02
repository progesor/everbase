import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWindowStore } from '@/features/window-manager/windowStore';
import { AppWindow, LayoutGrid } from 'lucide-react';

// Başlangıç için sabit bir uygulama listesi
const applications = [
  { id: 'docker-dashboard', name: 'Docker Dashboard' },
  { id: 'settings', name: 'Ayarlar' },
];

export function AppLauncher() {
  const { openWindow } = useWindowStore();

  const handleAppClick = (appName: string) => {
    // TODO: Her uygulama için farklı içerik ve boyutlar belirle
    openWindow({
      id: `${appName}-${Date.now()}`,
      title: appName,
      position: { x: 200, y: 200 },
      size: { width: 700, height: 500 },
    });
    // Not: Şimdilik diyalog penceresini manuel kapatmamız gerekecek.
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <LayoutGrid />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Uygulamalar</DialogTitle>
          <DialogDescription>Bir uygulama seçerek başlatın.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {applications.map((app) => (
            <Button
              key={app.id}
              variant="outline"
              className="flex flex-col h-24"
              onClick={() => handleAppClick(app.name)}
            >
              <AppWindow className="mb-2" /> {/* Geçici ikon */}
              <span className="text-xs">{app.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
