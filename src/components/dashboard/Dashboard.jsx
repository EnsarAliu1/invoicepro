import { useState, useEffect } from "react";
import { deleteInvoice, editInvoice, getTotalInvoices } from "../../services/dashboard.service";
import { getClients } from "../../services/client.service";
import { getUser } from "../../services/user.service";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editFormData, setEditFormData] = useState({
    invoiceNumber: "",
    clientId: "",
    total: 0,
    status: "Pending"
  });

  useEffect(() => {
    Promise.all([getTotalInvoices(user?.id), getClients(user?.id)])
      .then(([invoiceData, clientData]) => {
        setInvoices(invoiceData);
        setClients(clientData);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  const getClientName = (clientId) => {
    const foundClient = clients.find((c) => String(c.id) === String(clientId));
    return foundClient ? foundClient.name : `Client #${clientId}`;
  };

  const handleEditClick = (invoice) => {
    setEditingInvoice(invoice);
    setEditFormData({
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      total: invoice.total,
      status: invoice.status
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editingInvoice) return;

    const updatedInvoice = {
      ...editingInvoice,
      invoiceNumber: editFormData.invoiceNumber,
      clientId: isNaN(Number(editFormData.clientId)) ? editFormData.clientId : Number(editFormData.clientId),
      total: Number(editFormData.total),
      subtotal: Number(editFormData.total),
      status: editFormData.status
    };

    editInvoice(editingInvoice.id, updatedInvoice)
      .then(() => {
        return Promise.all([getTotalInvoices(user?.id), getClients(user?.id)]);
      })
      .then(([invoiceData, clientData]) => {
        setInvoices(invoiceData);
        setClients(clientData);
        setIsEditModalOpen(false);
        setEditingInvoice(null);
      })
      .catch((err) => {
        console.error("Failed to update invoice:", err);
      });
  };

  const handleDeleteClick = (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(invoiceId)
        .then(() => {
          return Promise.all([getTotalInvoices(user?.id), getClients(user?.id)]);
        })
        .then(([invoiceData, clientData]) => {
          setInvoices(invoiceData);
          setClients(clientData);
        })
        .catch((err) => {
          console.error("Failed to delete invoice:", err);
        });
    }
  };


  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 text-sm">Here's what's happening with your business.</p>

        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Total Invoices */}
            <div className="relative rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6 overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t-2xl" />
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Total Invoices</p>
              {loading ? (
                <div className="h-9 w-16 bg-slate-700 animate-pulse rounded-md mb-2" />
              ) : (
                <p className="text-4xl font-bold text-white mb-2">{invoices.length}</p>
              )}
              <p className="text-xs text-slate-500">View all your invoices</p>
            </div>

            {/* Paid Invoices */}
            <div className="relative rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6 overflow-hidden hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-t-2xl" />
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Paid Invoices</p>
              {loading ? (
                <div className="h-9 w-16 bg-slate-700 animate-pulse rounded-md mb-2" />
              ) : (
                <p className="text-4xl font-bold text-white mb-2">{invoices.filter(invoice => invoice.status === "Paid").length}</p>
              )}
              <p className="text-xs text-slate-500">View all paid invoices</p>
            </div>

            {/* Pending Invoices */}
            <div className="relative rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6 overflow-hidden hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-t-2xl" />
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Pending Invoices</p>
              {loading ? (
                <div className="h-9 w-16 bg-slate-700 animate-pulse rounded-md mb-2" />
              ) : (
                <p className="text-4xl font-bold text-white mb-2">{invoices.filter(invoice => invoice.status === "Pending").length}</p>
              )}
              <p className="text-xs text-slate-500">View all pending invoices</p>
            </div>

            {/* Overdue Invoices */}
            <div className="relative rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6 overflow-hidden hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-400 rounded-t-2xl" />
              <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">Overdue Invoices</p>
              {loading ? (
                <div className="h-9 w-16 bg-slate-700 animate-pulse rounded-md mb-2" />
              ) : (
                <p className="text-4xl font-bold text-white mb-2">{invoices.filter(invoice => invoice.status === "Overdue").length}</p>
              )}
              <p className="text-xs text-slate-500">View all overdue invoices</p>
            </div>

          </div>
        </section>

        <section className="table-section mt-10">
          <p className="text-lg font-semibold text-white mb-4">All Invoices</p>
          <table className="min-w-full bg-slate-800 border border-slate-700 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-slate-300 font-semibold">Invoice ID</th>
                <th className="py-2 px-4 text-left text-slate-300 font-semibold">Client</th>
                <th className="py-2 px-4 text-left text-slate-300 font-semibold">Amount</th>
                <th className="py-2 px-4 text-left text-slate-300 font-semibold">Status</th>
                <th className="py-2 px-4 text-left text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id} className="border-b border-slate-700">
                  <td className="py-2 px-4 text-slate-300">{invoice.invoiceNumber}</td>
                  <td className="py-2 px-4 text-slate-300">{getClientName(invoice.clientId)}</td>
                  <td className="py-2 px-4 text-slate-300">${invoice.total}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${invoice.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                      invoice.status === "Overdue" ? "bg-red-500/20 text-red-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-slate-300 flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-4 rounded-xl text-sm font-semibold transition"
                      onClick={() => handleEditClick(invoice)}
                    >
                      Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-500 text-white py-1.5 px-4 rounded-xl text-sm font-semibold transition"
                      onClick={() => handleDeleteClick(invoice.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Edit Invoice</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Invoice Number</label>
                <input
                  type="text"
                  required
                  value={editFormData.invoiceNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, invoiceNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Client</label>
                <select
                  value={editFormData.clientId}
                  onChange={(e) => setEditFormData({ ...editFormData, clientId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editFormData.total}
                  onChange={(e) => setEditFormData({ ...editFormData, total: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;