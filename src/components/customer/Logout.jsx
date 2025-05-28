function Logout(props) {
  sessionStorage.clear();
  window.location.href = '/customer/login';
}
export default Logout;