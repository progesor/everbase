import { useEffect, useState } from 'react';
import { getContainers } from '@/lib/api';
import type { ContainerInfo } from '@/types/docker';

function App() {
    const [containers, setContainers] = useState<ContainerInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getContainers()
            .then(data => {
                setContainers(data);
            })
            .catch(err => {
                console.error("Failed to fetch containers:", err);
                setError("Konteynerler yüklenemedi.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Everbase</h1>

            <div className="w-full p-4 border rounded-md">
                <h2 className="text-xl font-semibold mb-4">Docker Konteynerleri</h2>
                {isLoading && <p>Yükleniyor...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && (
                    <div>
                        {containers.length > 0 ? (
                            <ul className="space-y-3">
                                {containers.map(container => (
                                    <li key={container.Id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border">
                                        <div className={`w-3 h-3 rounded-full ${container.State === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{container.Names[0].substring(1)}</p>
                                            <p className="text-sm text-gray-500">{container.Image}</p>
                                        </div>
                                        <span className="text-sm px-2 py-1 bg-slate-200 rounded-full">{container.State}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Hiç konteyner bulunamadı.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;