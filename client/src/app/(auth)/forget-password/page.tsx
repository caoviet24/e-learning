'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export default function ForgetPasswordPage() {
    const [payLoad, setPayLoad] = useState({
        email: '',
        student_id: '',
    });


    const handleOnChangeInfoStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPayLoad({ ...payLoad, [name]: value });
    };

    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
    const [step, setStep] = useState(1);
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        setCaptcha({
            num1,
            num2,
            answer: num1 + num2,
        });
    }, []);

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple characters

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace in OTP inputs
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (parseInt(captchaAnswer) === captcha.num1 + captcha.num2) {
                setStep(2);
            } else {

                setCaptcha({
                    num1: Math.floor(Math.random() * 10),
                    num2: Math.floor(Math.random() * 10),
                    answer: 0,
                })
                toast.error('Captcha không chính xác', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } else {
            const otpValue = otp.join('');
            if (otpValue.length === 6) {
                // Here you would verify the OTP with your API
                console.log('Verifying OTP:', otpValue);
            }
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 px-4 borde rounded-lg p-4">
            <div className="text-center flex items-center flex-col space-y-4">
                <div className="text-center flex items-center flex-col space-y-2">
                    <Image src="/images/utehy-logo.png" alt="utehy logo" width={80} height={80} />
                    <p className="text-base font-medium tracking-tight text-muted-foreground">
                        Trường Sư Phạm Kỹ Thuật Hưng Yên
                    </p>
                    <p className="text-lg mt-2 text-muted-foreground">Hệ thống hỗ trợ học tập và thi trực tuyến</p>
                </div>
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Hỗ trợ sinh viên lấy lại mật khẩu</h1>
                    <span className='!text-red-500 opacity-75'>Lưu ý: mật khẩu sẽ được gửi trong hộp thoại email đăng kí của sinh viên</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {step === 1 ? (
                    <div className="space-y-2">
                        <input
                            name='student_id'
                            value={payLoad.student_id}
                            onChange={handleOnChangeInfoStudent}
                            required
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Mã sinh viên"
                        />

                        <input
                            name='email'
                            value={payLoad.email}
                            onChange={handleOnChangeInfoStudent}
                            required
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Email đăng kí"
                        />

                        <div className="flex items-center space-x-4">
                            <div className="flex-1 bg-muted p-2 rounded-md text-center font-mono">
                                {captcha.num1} + {captcha.num2} = ?
                            </div>
                            <input
                                type="number"
                                value={captchaAnswer}
                                onChange={(e) => setCaptchaAnswer(e.target.value)}
                                className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="?"
                                required
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Lấy OTP</label>
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        otpRefs.current[index] = el;
                                    }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    className="w-10 h-12 text-center border rounded-md border-input bg-background text-lg font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Bạn chưa nhận được mã OTP ?
                            <button type="button" onClick={() => setStep(1)} className="text-primary hover:underline ml-2">
                                Gửi lại mã OTP
                            </button>
                        </p>
                    </div>
                )}

                <Button type="submit" className="w-full">
                    {step === 1 ? 'Lấy OTP' : 'Xác nhận'}
                </Button>

                <p className="text-center text-sm">
                    Bạn đã có tài khoản ?
                    <Link href="/sign-in" className="text-primary hover:underline ml-2">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
}
