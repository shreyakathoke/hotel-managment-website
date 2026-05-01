const API_URL = "https://hotel-managment-backend-production.up.railway.app";

// ================= COMMON HANDLER =================
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

// ================= AUTH =================
export const signupApi = async (data) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const loginApi = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ================= PROFILE =================
export const saveProfileApi = async (data) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};



// ================= USERS =================
export const deleteUserApi = async (email) => {
  const res = await fetch(`${API_URL}/users/${email}`, { method: "DELETE" });
  return handleResponse(res);
};

// ================= ROOMS =================
export const getRoomsApi = async () => {
  const res = await fetch(`${API_URL}/rooms`);
  return handleResponse(res);
};

export const getRoomApi = async (roomId) => {
  const res = await fetch(`${API_URL}/rooms/${roomId}`);
  return handleResponse(res);
};




// ================= BOOKINGS =================
export const createBookingApi = async (data) => {
  const res = await fetch(`${API_URL}/booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const cancelBookingApi = async (bookingId) => {
  const res = await fetch(`${API_URL}/booking/cancel`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });
  return handleResponse(res);
};

// ================= PAYMENTS =================
export const createPaymentApi = async (data) => {
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};



export const cancelPaymentApi = async (paymentId) => {
  const res = await fetch(`${API_URL}/payments/${paymentId}`, { method: "PUT" });
  return handleResponse(res);
};


// ================= CONTACTS =================
export const createContactApi = async (data) => {
  const res = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

