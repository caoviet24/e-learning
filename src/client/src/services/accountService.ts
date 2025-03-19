import Cookies from 'js-cookie';

export const accountService = {
    async login(data: any) {
        const {username, password, role} = data;

        if(username === username && password === password && role === role) {

            debugger;
            // Set auth cookies
            Cookies.set('auth', 'true', { expires: 7 });
            Cookies.set('role', String(role), { expires: 7 });
            Cookies.set('username', username, { expires: 7 });
            
            return {
                username,
                role,
                success: true
            };
        }
        return {
            message: 'Tài khoản hoặc mật khẩu không chính xác',
            success: false,
        };
    },

    logout() {
        Cookies.remove('auth');
        Cookies.remove('role');
        Cookies.remove('username');
        window.location.href = '/sign-in';
    }
};
