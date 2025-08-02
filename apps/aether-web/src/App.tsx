import { useEffect } from 'react';
import { useContainerStore } from '@/store/containerStore'; // Yeni store'umuzu import ediyoruz
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
    // Veriyi ve fonksiyonları useState yerine doğrudan store'dan çekiyoruz
    const { containers, isLoading, error, fetchContainers } = useContainerStore();

    useEffect(() => {
        // Bileşen ilk yüklendiğinde veri çekme eylemini tetikle
        fetchContainers();
    }, [fetchContainers]); // fetchContainers fonksiyonu değişmeyeceği için bu da sadece bir kez çalışır

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Everbase</h1>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Docker Konteynerleri</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500">{error}</p>}

                    {isLoading && (
                        // Skeleton Loader kısmı aynı kalıyor
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <Skeleton className="h-6 w-[60px] rounded-full" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                                <Skeleton className="h-6 w-[60px] rounded-full" />
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && (
                        // Veri listeleme kısmı aynı kalıyor
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
                </CardContent>
            </Card>
        </div>
    );
}

export default App;