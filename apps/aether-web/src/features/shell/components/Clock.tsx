import { useEffect, useState } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Her saniye saati güncellemek için bir interval oluştur
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Bileşen kaldırıldığında interval'ı temizle
    return () => {
      clearInterval(timerId);
    };
  }, []); // Boş dependency array, bu effect'in sadece bir kez çalışmasını sağlar

  // Saati HH:MM formatında formatla
  const formattedTime = time.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="text-sm font-medium text-foreground px-2">
      {formattedTime}
    </div>
  );
}
