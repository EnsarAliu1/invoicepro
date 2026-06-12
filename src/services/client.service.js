export const baseUrl = "http://localhost:5000";

export function registerClient(newClient) {
  return fetch(`${baseUrl}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newClient),
  }).then((response) => response.json());
}

export function getClientByEmail(email) {
  return fetch(`${baseUrl}/clients?email=${encodeURIComponent(email)}`).then(
    (response) => response.json(),
  );
}

export function loginClient(email, password) {
  return fetch(`${baseUrl}/clients?email=${email}`)
    .then((response) => response.json())
    .then((clients) => {
      const client = clients[0];
      if (!client) throw new Error("Invalid email or password.");
      localStorage.setItem("clientId", client.id);
      localStorage.setItem("client", JSON.stringify(client));
      return client;
    });
}

export function getClient() {
  const currentClient = localStorage.getItem("client");
  if (!currentClient) return null;
  try {
    return JSON.parse(currentClient);
  } catch {
    localStorage.removeItem("client");
    return null;
  }
}

export function logOutUser() {
  localStorage.removeItem("clientId");
  localStorage.removeItem("client");
}

export function getClients() {
  return fetch(`${baseUrl}/clients`).then((response) => response.json());
}
