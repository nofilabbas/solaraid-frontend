function SellerLogout(props){
    localStorage.removeItem('seller_login');
    localStorage.removeItem('seller_username');
    localStorage.removeItem('seller_id');
    window.location.href = '/seller/login';
}
export default SellerLogout;