export const baseUrl = "http://localhost:5000";

export function registerUser(newUser) {
  return fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  }).then((response) => response.json());
}

export function getUserByEmail(email) {
  return fetch(`${baseUrl}/users?email=${encodeURIComponent(email)}`).then(
    (response) => response.json(),
  );
}

export function loginUser(email, password) {
  return fetch(`${baseUrl}/users?email=${email}`)
    .then((response) => response.json())
    .then((users) => {
      const user = users[0];
      if (!user) throw new Error("Invalid email or password.");
      if (user.password !== password) throw new Error("Invalid email or password.");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    });
}

export function getUser() {
  const currentUser = localStorage.getItem("user");
  if (!currentUser) return null;
  try {
    return JSON.parse(currentUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function logOutUser() {
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
}
