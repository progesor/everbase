import { useWallpaperStore, wallpapers } from '@/store/wallpaperStore';
import { Check } from 'lucide-react';

export function WallpaperPicker() {
  const { currentWallpaper, setWallpaper } = useWallpaperStore();

  return (
    // Ana konteyner, pencerenin tamamını dolduracak ve dikey flexbox kullanacak şekilde ayarlandı.
    <div className="flex flex-col h-full bg-transparent">
      {/* Sabit Başlık Alanı */}
      <header className="p-4 border-b border-border flex-shrink-0">
        <h1 className="text-lg font-semibold">Duvar Kağıdını Değiştir</h1>
      </header>

      {/* Kaydırılabilir İçerik Alanı: Kalan tüm alanı doldurur ve dikey scroll özelliği kazanır. */}
      <main className="flex-1 overflow-y-auto p-4">
        {/*
          DÜZELTME: Grid yapısı, sabit genişlikli sütunlar kullanacak ve
          tüm ızgara bloğunu yatayda ortalayacak şekilde güncellendi.
          Bu, dar pencerelerde görsellerin orantısız büyümesini engeller.
        */}
        <div
          className="grid gap-4 justify-center"
          style={{ gridTemplateColumns: 'repeat(auto-fill, 140px)' }}
        >
          {wallpapers.map((url) => (
            <button
              key={url}
              onClick={() => setWallpaper(url)}
              className="aspect-video relative group rounded-lg overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {/* Duvar kağıdı resmi */}
              <img
                src={url}
                alt="Duvar kağıdı küçük resmi"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                // Resim yüklenemezse bir yedek göster
                onError={(e) => {
                  e.currentTarget.src =
                    'https://placehold.co/600x400/27272a/a1a1aa?text=Not+Found';
                }}
              />

              {/* Seçili duvar kağıdı için gösterge */}
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
