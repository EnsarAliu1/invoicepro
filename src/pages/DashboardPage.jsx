import { Routes, Route } from "react-router";
import Sidebar from "../components/dashboard/Sidebar";
import Dashboard from "../components/dashboard/Dashboard";
import Clients from "../components/dashboard/Clients";
import ItemsAndServices from "../components/dashboard/ItemsAndServices";
import RecentInvoices from "../components/dashboard/RecentInvoices";
import CreateInvoices from "../components/dashboard/CreateInvoices";
import Payments from "../components/dashboard/Payments";

function DashboardPage() {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/items" element={<ItemsAndServices />} />
          <Route path="/invoices" element={<RecentInvoices />} />
          <Route path="/create-invoice" element={<CreateInvoices />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </main>
    </div>
  );
}

export default DashboardPage;
