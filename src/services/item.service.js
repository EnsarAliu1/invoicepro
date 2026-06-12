export const baseUrl = "http://localhost:5000";

export function getItems() {
  return fetch(`${baseUrl}/items`).then((response) => response.json());
}
