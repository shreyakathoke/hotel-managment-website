const API_URL = "https://web-production-d78058.up.railway.app";

export async function signupUser(data) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getProfile(email) {
  const res = await fetch(`${API_URL}/profile/${email}`);
  return res.json();
}

export async function saveProfile(data) {
  const res = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Rooms
export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`);
  return res.json();
}

export async function getRoom(roomId) {
  const res = await fetch(`${API_URL}/rooms/${roomId}`);
  return res.json();
}

// Booking
export async function createBooking(data) {
  const res = await fetch(`${API_URL}/booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getBookings(email) {
  const res = await fetch(`${API_URL}/booking/${email}`);
  return res.json();
}

export async function cancelBooking(bookingId) {
  const res = await fetch(`${API_URL}/booking/cancel`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });
  return res.json();
}

// Payment
export async function createPayment(data) {
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getPayment(bookingId) {
  const res = await fetch(`${API_URL}/payments/${bookingId}`);
  return res.json();
}

// Contacts
export async function sendContact(data) {
  const res = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getContacts() {
  const res = await fetch(`${API_URL}/contacts`);
  return res.json();
}