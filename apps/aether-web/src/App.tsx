import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api'; // Oluşturduğumuz istemciyi import ediyoruz

// Gelen verinin tipini tanımlamak iyi bir pratiktir
interface HealthStatus {
    status: string;
    time: string;
}

function App() {
    const [backendStatus, setBackendStatus] = useState<string>('Checking...');

    useEffect(() => {
        // Bileşen yüklendiğinde sağlık durumunu kontrol et
        apiClient.get<HealthStatus>('/api/health')
            .then(response => {
                // İstek başarılı olursa durumu güncelle
                setBackendStatus(`OK - Server time: ${response.data.time}`);
            })
            .catch(error => {
                // Hata olursa durumu güncelle
                console.error("Health check failed:", error);
                setBackendStatus('Error - Could not connect to backend.');
            });
    }, []); // Boş dependency array'i sayesinde bu kod sadece bir kez çalışır

    return (
        <div className="p-8 flex flex-col items-start gap-4">
            <h1 className="text-3xl font-bold text-blue-600">
                Everbase
            </h1>
            <Button>Shadcn Button</Button>
            <div className="mt-4 p-4 border rounded-md">
                <p>Backend Status: <strong>{backendStatus}</strong></p>
            </div>
        </div>
    );
}

export default App;