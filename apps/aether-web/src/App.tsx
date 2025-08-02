import { DockerDashboard } from "@/features/docker-dashboard/components/DockerDashboard";

function App() {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Everbase</h1>
            <DockerDashboard />
        </main>
    );
}

export default App;