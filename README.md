# Everbase

A self-hosted, open-source project to turn a personal device (like a Raspberry Pi) into a full-fledged, secure, and smart personal cloud OS.

## Projenin Amacı

Everbase, kişisel bir cihazı (Raspberry Pi 5 gibi) tam teşekküllü, güvenli ve akıllı bir kişisel bulut işletim sistemine dönüştürmeyi amaçlayan, modern teknolojilerle geliştirilmiş, açık kaynaklı bir projedir. Kendi sunucusunu yönetmenin (self-hosting) getirdiği karmaşıklığı ortadan kaldırarak, verilerinizin ve dijital servislerinizin tam kontrolünü, estetik ve sezgisel bir web tabanlı masaüstü arayüzü üzerinden sunar.

## Kullanılan Teknolojiler

- **Backend:** Bun, Elysia.js, TypeScript
- **Frontend:** Vite, React, TypeScript, Tailwind CSS, shadcn/ui
- **Durum Yönetimi:** Zustand
- **Paket Yöneticisi:** Bun Workspaces
- **Kod Kalitesi:** ESLint, Prettier, Husky, lint-staged

## Nasıl Çalıştırılır?

1.  **Gerekli Bağımlılıkları Yükleyin:**

    ```bash
    bun install
    ```

2.  **Geliştirme Sunucularını Başlatın:**
    Bu komut, hem backend API'sini hem de frontend web uygulamasını aynı anda çalıştıracaktır.
    ```bash
    bun run dev
    ```

- Frontend uygulaması `http://localhost:5173` adresinde çalışacaktır.
- Backend API'si `http://localhost:3000` adresinde çalışacaktır.
