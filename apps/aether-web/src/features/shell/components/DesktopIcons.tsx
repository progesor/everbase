import { appRegistry, AppDefinition } from '@/registry/apps';
import { useWindowStore } from '@/features/window-manager/windowStore';
import { useDesktopStore } from '@/store/desktopStore';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * Masaüstü uygulama kısayollarını render eder ve yönetir.
 */
export function DesktopIcons() {
  const { openWindow } = useWindowStore();
  const {
    selectedIcons,
    selectIcon,
    toggleIconSelection,
    iconPositions,
    setIconPosition,
    clearSelection, // DÜZELTME: Seçimi temizleme fonksiyonu store'dan alındı.
  } = useDesktopStore();

  useEffect(() => {
    let yOffset = 16;
    const PADDING = 16;
    const ICON_HEIGHT = 96;
    const GAP = 16;

    appRegistry.forEach((app) => {
      if (!iconPositions[app.id]) {
        setIconPosition(app.id, { x: PADDING, y: yOffset });
        yOffset += ICON_HEIGHT + GAP;
      }
    });
  }, []);

  const handleIconMouseDown = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    if (e.shiftKey) {
      toggleIconSelection(appId);
    } else {
      if (!selectedIcons.includes(appId)) {
        selectIcon(appId);
      }
    }
  };

  // DÜZELTME: Çift tıklama için ayrı bir handle fonksiyonu oluşturuldu.
  const handleDoubleClick = (app: AppDefinition) => {
    openWindow(app);
    clearSelection(); // Uygulama açıldıktan sonra seçimi temizle.
  };

  return (
    <div className="absolute inset-0">
      {appRegistry.map((app) => {
        const isSelected = selectedIcons.includes(app.id);
        const position = iconPositions[app.id] || { x: 16, y: 16 };

        return (
          <motion.div
            key={app.id}
            drag
            dragMomentum={false}
            onDragEnd={(_event, info) => {
              const newPosition = {
                x: position.x + info.offset.x,
                y: position.y + info.offset.y,
              };
              setIconPosition(app.id, newPosition);
            }}
            onDragStart={() => {
              if (!selectedIcons.includes(app.id)) {
                selectIcon(app.id);
              }
            }}
            style={{
              position: 'absolute',
              x: position.x,
              y: position.y,
              zIndex: isSelected ? 10 : 1,
            }}
          >
            <button
              onMouseDown={(e) => handleIconMouseDown(e, app.id)}
              // DÜZELTME: onDoubleClick artık yeni handle fonksiyonunu çağırıyor.
              onDoubleClick={() => handleDoubleClick(app)}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-2 rounded-lg text-white w-24 h-24 transition-colors focus:outline-none focus:ring-2 focus:ring-primary',
                isSelected ? 'bg-blue-500/30' : 'hover:bg-black/20'
              )}
              title={app.name}
            >
              <app.icon className="w-8 h-8 drop-shadow-lg" />
              <span className="text-xs text-center truncate w-full font-semibold drop-shadow-lg">
                {app.name}
              </span>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
