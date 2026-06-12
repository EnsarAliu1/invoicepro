export const baseUrl = "http://localhost:5000";

export function getClients(userId) {
  const url = userId ? `${baseUrl}/clients?userId=${userId}` : `${baseUrl}/clients`;
  return fetch(url).then((response) => response.json());
}

export function addClient(newClient) {
  return fetch(`${baseUrl}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newClient),
  }).then((response) => response.json());
}

export function editClient(clientId, updatedClient) {
  return fetch(`${baseUrl}/clients/${clientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedClient),
  }).then((response) => response.json());
}

export function deleteClient(clientId) {
  return fetch(`${baseUrl}/clients/${clientId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).then((response) => response.json());
}
