import Sidebar from "../components/dashboard/Sidebar";

function DashboardPage() {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome to InvoicePro 👋</p>
      </main>
    </div>
  );
}

export default DashboardPage;