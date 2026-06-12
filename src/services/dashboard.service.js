export const baseUrl = "http://localhost:5000";

export function getTotalInvoices() {
  return fetch(`${baseUrl}/invoices`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

export function getInvoiceById(invoiceId) {
  return fetch(`${baseUrl}/invoices/${invoiceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

export function editInvoice(invoiceId, updatedInvoice) {
  return fetch(`${baseUrl}/invoices/${invoiceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedInvoice),
  }).then((response) => response.json());
}

export function deleteInvoice(invoiceId) {
  return fetch(`${baseUrl}/invoices/${invoiceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}
