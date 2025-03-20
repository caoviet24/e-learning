import Link from "next/link";

export default function ForbiddenPage() {
    return (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">403 - Truy cập bị từ chối</h1>
                <p className="text-muted-foreground">Bạn không có quyền truy cập trang này</p>
                <Link href="/">
                    <a className="text-blue-600 hover:underline">Quay lại trang chủ</a>
                </Link>
            </div>
        </div>
    );
}
