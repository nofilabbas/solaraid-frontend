function Logout(props) {
  sessionStorage.clear();
  window.location.href = '/seller/login';
}
export default Logout;