export const baseUrl = "http://localhost:5000";

export function createInvoice(newInvoice) {
  return fetch(`${baseUrl}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newInvoice),
  }).then((response) => response.json());
}

export function createInvoiceItem(newInvoiceItem) {
  return fetch(`${baseUrl}/invoiceItems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newInvoiceItem),
  }).then((response) => response.json());
}
