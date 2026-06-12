import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FilePlus, Plus, Trash2, FileText, ArrowLeft, X } from "lucide-react";
import { getClients } from "../../services/client.service";
import { getItems } from "../../services/item.service";
import { createInvoice, createInvoiceItem } from "../../services/invoice.service";
import { getUser } from "../../services/user.service";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function CreateInvoices() {
  const navigate = useNavigate();
  const user = getUser();

  const [clients, setClients] = useState([]);
  const [dbItems, setDbItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Form States
  const [invoiceNumber, setInvoiceNumber] = useState(`KF-${Math.floor(10000 + Math.random() * 90000)}`);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [paymentTerms, setPaymentTerms] = useState("Net 14 Days");
  const [status, setStatus] = useState("Pending");

  // Items in the current invoice
  const [invoiceItems, setInvoiceItems] = useState([
    { description: "", qty: 1, rate: 0, taxRate: 0.18 }
  ]);

  // Load clients and items
  useEffect(() => {
    if (user?.id) {
      Promise.all([getClients(user.id), getItems()])
        .then(([clientsData, itemsData]) => {
          setClients(clientsData);
          setDbItems(itemsData);
          if (clientsData.length > 0) {
            setSelectedClientId(clientsData[0].id);
          }
        })
        .catch((err) => {
          console.error("Failed to load initial data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?.id]);

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", qty: 1, rate: 0, taxRate: 0.18 }]);
  };

  const handleRemoveItem = (index) => {
    if (invoiceItems.length === 1) return;
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...invoiceItems];
    if (field === "rate" || field === "qty") {
      updated[index][field] = Number(value) || 0;
    } else if (field === "taxRate") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value;
    }
    setInvoiceItems(updated);
  };

  const handleSelectDbItem = (index, itemId) => {
    const selectedItem = dbItems.find(item => String(item.id) === String(itemId));
    if (selectedItem) {
      const updated = [...invoiceItems];
      updated[index].description = selectedItem.name;
      updated[index].rate = selectedItem.rate;
      setInvoiceItems(updated);
    }
  };

  // Calculations
  const subtotal = invoiceItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const totalTax = invoiceItems.reduce((sum, item) => sum + (item.qty * item.rate * item.taxRate), 0);
  const grandTotal = subtotal + totalTax;

  const getClientInfo = () => {
    return clients.find(c => String(c.id) === String(selectedClientId));
  };

  const formatDateString = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  // PDF Generation Function (Returns Blob URL)
  const generatePDFBlobUrl = async () => {
    const pdfContainer = document.getElementById("pdf-render-area");
    if (!pdfContainer) return "";

    try {
      const containerWidth = 794;
      const containerHeight = 1123;
      
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: containerWidth,
        height: containerHeight,
        windowWidth: containerWidth,
        windowHeight: containerHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      
      const pdfBlob = pdf.output("blob");
      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error("Failed to generate PDF Blob:", error);
      return "";
    }
  };

  // Submit form: Save to DB & then show Chrome's default PDF preview in modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert("Ju lutem zgjedhni një klient!");
      return;
    }

    setSubmitting(true);

    const newInvoice = {
      invoiceNumber,
      clientId: selectedClientId,
      userId: user?.id,
      issueDate,
      dueDate,
      paymentTerms,
      status,
      subtotal,
      tax: totalTax,
      total: grandTotal
    };

    try {
      // 1. Create Invoice in DB
      const createdInvoice = await createInvoice(newInvoice);

      // 2. Create Invoice Items in DB
      const itemPromises = invoiceItems.map(item => {
        return createInvoiceItem({
          invoiceId: createdInvoice.id,
          description: item.description,
          qty: item.qty,
          rate: item.rate,
          amount: item.qty * item.rate
        });
      });

      await Promise.all(itemPromises);

      // 3. Generate PDF and get Blob URL
      const blobUrl = await generatePDFBlobUrl();
      if (blobUrl) {
        setPdfUrl(blobUrl);
        setIsPreviewOpen(true);
      } else {
        alert("Fatura u ruajt por dështoi gjenerimi i PDF-së.");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Gabim gjatë krijimit të faturës:", error);
      alert("Ndodhi një gabim gjatë ruajtjes së faturës.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsPreviewOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
    navigate("/dashboard");
  };

  const selectedClient = getClientInfo();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-2 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-3 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <FilePlus className="w-8 h-8 text-blue-500" />
            Krijo Faturë të Re
          </h1>
          <p className="text-slate-400 text-sm mt-1">Lësho faturë të re dhe shkarko formatin PDF.</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-900 border border-slate-850 rounded-2xl animate-pulse flex items-center justify-center">
          <p className="text-slate-400">Duke ngarkuar të dhënat...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sender & Recipient Card */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Detajet e Palëve</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proj (Sender - Locked to ADORE Logo) */}
                <div className="space-y-3 p-4 bg-slate-955 rounded-xl border border-slate-850">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Dërguesi (Prej):</span>
                  <div className="mt-2">
                    <img src="/ADORE_LOGO.jpg" alt="ADORE Logo" className="w-48 h-auto rounded-lg bg-white p-1.5 object-contain" />
                  </div>
                  <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-800">
                    <p>Skenderaj, Kosovë</p>
                    <p>Email: info@adoretechno.com</p>
                    <p>Tel: +383 49173728</p>
                  </div>
                </div>

                {/* Faturuar për (Recipient) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1.5">Faturuar për (Klienti):</label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                      required
                    >
                      <option value="" disabled>Zgjedh klientin...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedClient && (
                    <div className="text-xs text-slate-400 bg-slate-955 p-3 rounded-xl border border-slate-855 space-y-1">
                      <p className="font-semibold text-white">{selectedClient.name}</p>
                      <p>Adresa: {selectedClient.address || "Pa adresë"}</p>
                      <p>Email: {selectedClient.email || "Pa email"}</p>
                      <p>Tel: {selectedClient.phone || "Pa telefon"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Items Card */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white">Shërbimet ose Produktet</h2>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 text-xs bg-slate-850 hover:bg-slate-800 text-blue-400 border border-slate-800 hover:border-blue-500/30 font-semibold py-1.5 px-3 rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  Shto Rresht
                </button>
              </div>

              <div className="space-y-4">
                {invoiceItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-955 rounded-xl border border-slate-850 items-end">
                    
                    {/* Database Item Select helper */}
                    <div className="md:col-span-3">
                      <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Përzgjedh Shërbim</label>
                      <select
                        onChange={(e) => handleSelectDbItem(index, e.target.value)}
                        className="w-full bg-slate-800 border border-slate-750 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        defaultValue=""
                      >
                        <option value="">-- Zgjidh opsionale --</option>
                        {dbItems.map(i => (
                          <option key={i.id} value={i.id}>{i.name} (€{i.rate})</option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Description */}
                    <div className="md:col-span-3">
                      <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Përshkrimi</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                        placeholder="Përshkrimi i shërbimit..."
                      />
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-1.5">
                      <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Sasia</label>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                        className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-2.5 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>

                    {/* Rate */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Çmimi / Njësi (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                        className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>

                    {/* Tax rate (TVSh) */}
                    <div className="md:col-span-1.5">
                      <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">TVSh</label>
                      <select
                        value={item.taxRate}
                        onChange={(e) => handleItemChange(index, "taxRate", e.target.value)}
                        className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="0">0%</option>
                        <option value="0.08">8%</option>
                        <option value="0.18">18%</option>
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={invoiceItems.length === 1}
                        className="p-2 text-slate-500 hover:text-red-400 bg-slate-850/50 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Summary & Settings Sidebar */}
          <div className="space-y-6">
            
            {/* Invoice Settings Card */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Detajet e Faturës</h2>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">Numri i Faturës</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Data e Faturimit</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Afati i Pagesës (Due Date)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Kushtet e Pagesës</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                >
                  <option value="Net 14 Days">Net 14 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Statusi Fillestar</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Calculations Card */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Përmbledhja e Faturës</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Totali (pa TVSh):</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TVSh:</span>
                  <span>€{totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-slate-800">
                  <span>Totali (me TVSh):</span>
                  <span className="text-blue-400">€{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 disabled:opacity-50 active:scale-[0.98]"
                >
                  <FileText className="w-5 h-5" />
                  {submitting ? "Duke e ruajtur..." : "Lësho Faturën"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold py-2.5 rounded-xl transition text-sm"
                >
                  Anulo
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ── Native Chrome PDF Preview Modal ── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden select-none">
          <div className="w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Fatura {invoiceNumber} Preview</h3>
                <p className="text-xs text-slate-500 mt-0.5">Shkarkoni ose printoni duke përdorur vegla e integruara të Chrome</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Native Chrome PDF Viewer */}
            <div className="flex-1 bg-slate-900 relative">
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-none"
                  title="Fatura PDF"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── HIDDEN PDF TEMPLATE AREA ── */}
      {/* Positioned off-screen, populated dynamically and compiled via html2canvas to create the PDF blob */}
      <div id="pdf-render-area" style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "794px", minHeight: "1123px", padding: "60px", boxSizing: "border-box", backgroundColor: "#ffffff", color: "#1e293b", fontFamily: "sans-serif" }}>
        
        {/* Title and Metadata */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "35px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 10px 0", letterSpacing: "1px", color: "#000000" }}>
              FATURË
            </h1>
            <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
              <p style={{ margin: 0 }}><strong>Numri i faturës:</strong> {invoiceNumber}</p>
              <p style={{ margin: 0 }}><strong>Data e faturimit:</strong> {formatDateString(issueDate)}</p>
              <p style={{ margin: 0 }}><strong>Afati i pagesës:</strong> {formatDateString(dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Sender & Recipient Two-column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", marginBottom: "40px", fontSize: "12px", lineHeight: "1.6" }}>
          {/* Sender Details (Large ADORE Logo, No text brand name) */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 8px 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px" }}>
              Proj:
            </h3>
            <div style={{ marginBottom: "15px" }}>
              <img src="/ADORE_LOGO.jpg" alt="ADORE Logo" style={{ width: "220px", height: "auto", display: "block" }} />
            </div>
            <p style={{ margin: 0 }}>Skenderaj , Kosove</p>
            <p style={{ margin: 0 }}>Email: info@adoretechno.com</p>
            <p style={{ margin: 0 }}>Tel: +383 49173728</p>
          </div>

          {/* Recipient Details */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 8px 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px" }}>
              Faturuar për:
            </h3>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "700" }}>{selectedClient?.name || "Klienti ShPK"}</p>
            <p style={{ margin: 0 }}>{selectedClient?.address || "Kosovë"}</p>
            <p style={{ margin: 0 }}>Email: {selectedClient?.email || "klienti@email.com"}</p>
            <p style={{ margin: 0 }}>Tel: {selectedClient?.phone || "+383 49 000 000"}</p>
          </div>
        </div>

        {/* Items List Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
              <th style={{ padding: "8px 10px", textAlign: "left", fontWeight: "700", color: "#334155", width: "40px" }}>Nr.</th>
              <th style={{ padding: "8px 10px", textAlign: "left", fontWeight: "700", color: "#334155" }}>Përshkrimi</th>
              <th style={{ padding: "8px 10px", textAlign: "center", fontWeight: "700", color: "#334155", width: "60px" }}>Sasia</th>
              <th style={{ padding: "8px 10px", textAlign: "right", fontWeight: "700", color: "#334155", width: "100px" }}>Çmimi për njësi</th>
              <th style={{ padding: "8px 10px", textAlign: "center", fontWeight: "700", color: "#334155", width: "70px" }}>TVSh</th>
              <th style={{ padding: "8px 10px", textAlign: "right", fontWeight: "700", color: "#334155", width: "100px" }}>Vlera e TVSh</th>
              <th style={{ padding: "8px 10px", textAlign: "right", fontWeight: "700", color: "#334155", width: "110px" }}>Çmimi me TVSh</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, index) => {
              const itemSubtotal = item.qty * item.rate;
              const itemTax = itemSubtotal * item.taxRate;
              const itemTotal = itemSubtotal + itemTax;

              return (
                <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 10px", textAlign: "left", color: "#475569" }}>{index + 1}</td>
                  <td style={{ padding: "10px 10px", color: "#1e293b", fontWeight: "500" }}>{item.description || "Shërbim shembull"}</td>
                  <td style={{ padding: "10px 10px", textAlign: "center", color: "#475569" }}>{item.qty}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right", color: "#475569" }}>€{item.rate.toFixed(2)}</td>
                  <td style={{ padding: "10px 10px", textAlign: "center", color: "#475569" }}>{(item.taxRate * 100)}%</td>
                  <td style={{ padding: "10px 10px", textAlign: "right", color: "#475569" }}>€{itemTax.toFixed(2)}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right", color: "#1e293b", fontWeight: "500" }}>€{itemTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Calculations Summary Block */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "60px" }}>
          <div style={{ width: "300px", fontSize: "12px", lineHeight: "2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "4px" }}>
              <span style={{ color: "#475569" }}>Totali (pa TVSH):</span>
              <span style={{ fontWeight: "500" }}>€{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", marginTop: "4px" }}>
              <span style={{ color: "#475569" }}>TVSH:</span>
              <span style={{ fontWeight: "500" }}>€{totalTax.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", marginTop: "6px" }}>
              <strong style={{ fontSize: "14px", color: "#000000" }}>Totali (me TVSH):</strong>
              <strong style={{ fontSize: "14px", color: "#000000" }}>€{grandTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Footer conditions */}
        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "80px", lineHeight: "1.6" }}>
          <p style={{ margin: "0 0 4px 0", fontWeight: "700", color: "#475569" }}>Kushtet:</p>
          <p style={{ margin: 0 }}>Pagesa duhet të kryhet brenda muajit.</p>
        </div>

        {/* Signature lines */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "100px", fontSize: "12px", color: "#475569" }}>
          <div style={{ width: "200px", borderTop: "1px solid #cbd5e1", paddingTop: "6px", textAlign: "left" }}>
            Dërgoi:
          </div>
          <div style={{ width: "200px", borderTop: "1px solid #cbd5e1", paddingTop: "6px", textAlign: "left" }}>
            Pranoi:
          </div>
        </div>

      </div>

    </div>
  );
}

export default CreateInvoices;