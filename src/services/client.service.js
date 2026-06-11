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
      localStorage.setItem("clientId", client.id);
    });
}
