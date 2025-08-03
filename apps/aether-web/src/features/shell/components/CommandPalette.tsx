import { useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { appRegistry } from '@/registry/apps';
import { useWindowStore } from '@/features/window-manager/windowStore';
import { useCommandPaletteStore } from '@/store/commandPaletteStore';

/**
 * Sistem genelinde kullanılan komut paleti.
 * Kendi açılış kısayolunu kendi yönetir.
 */
export function CommandPalette() {
  const { isOpen, setOpen, toggle } = useCommandPaletteStore();
  const { openWindow } = useWindowStore();

  // DÜZELTME: Kısayol dinleyicisi, en güvenilir yöntem olan useEffect ile
  // doğrudan bu bileşene geri eklendi.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle(); // Global store'daki toggle fonksiyonunu çağırır.
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]); // toggle fonksiyonu bağımlılık olarak eklendi.

  const handleSelectApp = (appId: string) => {
    const app = appRegistry.find((app) => app.id === appId);
    if (app) {
      openWindow(app);
      setOpen(false);
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Bir komut yazın veya arama yapın..." />
      <CommandList>
        <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
        <CommandGroup heading="Uygulamalar">
          {appRegistry.map((app) => (
            <CommandItem
              key={app.id}
              onSelect={() => handleSelectApp(app.id)}
              value={app.name}
            >
              <app.icon className="mr-2 h-4 w-4" />
              <span>{app.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
