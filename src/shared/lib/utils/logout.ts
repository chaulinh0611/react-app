export const logout = () => {
    localStorage.clear();
    window.location.assign('/login');
};
