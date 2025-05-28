export function checkSession(role = 'customer') {
  const sessionExpiry = sessionStorage.getItem('session_expiry');
  const now = new Date().getTime();

  if (!sessionExpiry || now > sessionExpiry) {
    alert("Session expired. Please log in again.");
    sessionStorage.clear();
    if (role === 'seller') {
      window.location.href = '/seller/login';
    } else {
      window.location.href = '/customer/login';
    }
  }
}