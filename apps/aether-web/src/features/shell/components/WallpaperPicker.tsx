import { useWallpaperStore, wallpapers } from '@/store/wallpaperStore';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

export function WallpaperPicker() {
  const { currentWallpaper, setWallpaper } = useWallpaperStore();

  const handleWallpaperChange = (url: string) => {
    setWallpaper(url);
    toast.success('Duvar kağıdı başarıyla değiştirildi!');
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="p-4 border-b border-border flex-shrink-0">
        <h1 className="text-lg font-semibold">Duvar Kağıdını Değiştir</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div
          className="grid gap-4 justify-center"
          style={{ gridTemplateColumns: 'repeat(auto-fill, 140px)' }}
        >
          {wallpapers.map((url) => (
            <button
              key={url}
              onClick={() => handleWallpaperChange(url)}
              className="aspect-video relative group rounded-lg overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <img
                src={url}
                alt="Duvar kağıdı küçük resmi"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://placehold.co/600x400/27272a/a1a1aa?text=Not+Found';
                }}
              />

              {currentWallpaper === url && (
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
