import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className="w-full max-w-md space-y-8 px-4 rounded-lg p-6">
            <div className="text-center flex items-center flex-col space-y-2">
                <Image src="/images/utehy-logo.png" alt="utehy logo" width={80} height={80} />
                <p className="text-base font-medium tracking-tight text-muted-foreground">Trường Sư Phạm Kỹ Thuật Hưng Yên</p>
                <p className="text-lg mt-2 text-muted-foreground">Hệ thống hỗ trợ học tập và thi trực tuyến</p>
            </div>
            <form className="mt-8 space-y-6">
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Mã sinh viên"
                />

                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Mật khẩu"
                />

                <Button type="submit" className="w-full">
                    Đăng nhập
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                    Quên mật khẩu ?
                    <Link href="/forget-password" className="text-primary hover:underline ml-2">
                        Lấy lại mật khẩu mới
                    </Link>
                </p>
            </form>
        </div>
    );
}
