import { useState, useEffect } from "react";
import { Plus, Mail, Phone, MapPin, X, Edit2, Trash2, Users } from "lucide-react";
import { getClients, addClient, editClient, deleteClient } from "../../services/client.service";
import { getUser } from "../../services/user.service";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingClient, setEditingClient] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const user = getUser();

  const fetchClients = () => {
    setLoading(true);
    getClients(user?.id)
      .then((data) => {
        setClients(data);
      })
      .catch((err) => {
        console.error("Failed to fetch clients:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.id) {
      fetchClients();
    }
  }, [user?.id]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingClient(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client) => {
    setModalMode("edit");
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || ""
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newClientData = {
        ...formData,
        userId: user?.id
      };
      addClient(newClientData)
        .then(() => {
          fetchClients();
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Error adding client:", err));
    } else if (modalMode === "edit" && editingClient) {
      const updatedClientData = {
        ...editingClient,
        ...formData
      };
      editClient(editingClient.id, updatedClientData)
        .then(() => {
          fetchClients();
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Error editing client:", err));
    }
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteClient(clientId)
        .then(() => {
          fetchClients();
        })
        .catch((err) => console.error("Error deleting client:", err));
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-2 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Clients
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage and view all your customer accounts.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Add New Client
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-800" />
                <div className="flex-1">
                  <div className="h-5 bg-slate-800 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-800 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-slate-850 flex items-center justify-center mb-4 text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Clients Found</h3>
          <p className="text-slate-400 text-sm max-w-sm mb-6">
            You haven't added any clients yet. Click the button above to add your first customer.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="bg-slate-800 hover:bg-slate-750 text-white font-medium py-2 px-5 rounded-xl transition duration-200"
          >
            Add First Client
          </button>
        </div>
      ) : (
        /* Clients Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="relative bg-slate-900/60 border border-slate-850 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                    {getInitials(client.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white truncate max-w-[150px] md:max-w-[180px]">
                      {client.name}
                    </h3>
                    <p className="text-xs text-slate-500">Customer ID: {client.id}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEditModal(client)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Client Info details */}
              <div className="space-y-2.5 pt-3 border-t border-slate-850">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{client.email || "No email provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>{client.phone || "No phone provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{client.address || "No address provided"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {modalMode === "add" ? "Add New Client" : "Edit Client"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Company or Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@company.com"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 019-2834"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="California, USA"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/30"
                >
                  {modalMode === "add" ? "Create Client" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;