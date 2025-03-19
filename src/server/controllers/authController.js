import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../middleware/prisma.intercepter.js';

export const register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        
        // Validate required fields
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const existingAccount = await prisma.account.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            },
        });

        if (existingAccount) {
            return res.status(400).json({
                message: existingAccount.username === username
                    ? 'Tên đăng nhập đã tồn tại'
                    : 'Email đã được sử dụng'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const now = new Date();
        const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

        const account = await prisma.account.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role || 0,
                created_at: vietnamTime,
                updated_at: vietnamTime
            },
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                accountId: account.id,
                email: account.email,
                role: account.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Đăng ký thành công',
            token,
            account: {
                id: account.id,
                username: account.username,
                email: account.email,
                role: account.role,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        // Find account
        const account = await prisma.account.findFirst({
            where: { username },
            include: {
                user: true
            }
        });

        if (!account) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, account.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                accountId: account.id,
                email: account.email,
                role: account.role,
                username: account.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Đăng nhập thành công',
            token,
            account: {
                id: account.id,
                username: account.username,
                email: account.email,
                role: account.role,
                user: account.user
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
