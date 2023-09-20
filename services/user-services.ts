export function clearUser(setUser: any) {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token')
    localStorage.removeItem('wallet_address')
    setUser(null);
}