import bcrypt from 'bcrypt';
import prisma from '../middleware/prisma.intercepter.js';
import jwtService from '../services/jwtService.js';

export const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin', success: false });
        }

        const existingAccount = await prisma.account.findFirst({
            where: {
                username,
            },
        });

        if (existingAccount) {
            return res.status(400).json({
                message: 'Tài khoản đã tồn tại',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const now = new Date();
        const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

        const account = await prisma.account.create({
            data: {
                username,
                password: hashedPassword,
                email: username,
                role: role || 0,
                created_at: vietnamTime,
                updated_at: vietnamTime,
            },
        });

        if (account) {
            return res.status(201).json({
                message: 'Đăng ký thành công',
                success: true,
            });
        }

        return res.status(400).json({ message: 'Đăng ký thất bại', success: 'false' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin', success: false });
        }

        const account = await prisma.account.findFirst({
            where: { username, role },
        });

        if (!account) {
            return res.status(401).json({ message: 'Tên đăng nhập không chính xác', success: false });
        }

        const validPassword = await bcrypt.compare(password, account.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mật khẩu không chính xác', success: false });
        }

        const access_token = await jwtService.createAccessToken({
            id: account.id,
            role: account.role,
        });
        const refresh_token = await jwtService.createRefreshToken({
            id: account.id,
            role: account.role,
        });

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            success: true,
            access_token,
            refresh_token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const authMe = async (req, res) => {

    try {
        const access_token = req.headers?.Authorization?.split(' ')[1] || req.headers?.authorization?.split(' ')[1];
        if (!access_token) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        const user = jwtService.verifyAccessToken(access_token);
        
        const account = await prisma.account.findFirst({
            where: {
                id: user.id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            },
            include: {
                user: {
                    select: {
                        full_name: true,
                        avatar: true,
                    },
                },
            }
        });

        if (!account) {
            return res.status(401).json({ message: 'Account not found', success: false });
        }

        return res.status(200).json({ success: true, account });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        return res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refresh_token = req.headers.refresh_token;
        if (!refresh_token) {
            return res.status(401).json({ message: 'No refresh token provided', success: false });
        }

        const user = jwtService.verifyRefreshToken(refresh_token);
        
        const new_access_token = await jwtService.createAccessToken({
            id: user.id,
            role: user.role,
        });
        const new_refresh_token = await jwtService.createRefreshToken({
            id: user.id,
            role: user.role,
        });

        res.cookie('refresh_token', new_refresh_token, {
            expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 14),
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        res.cookie('access_token', new_access_token, {
            expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 14),
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({
            success: true,
            access_token: new_access_token,
            refresh_token: new_refresh_token
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid refresh token', success: false });
        }
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};
