import { ToastContainer } from "react-toastify";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative min-h-screen">
            <div
                className="absolute inset-0 bg-center bg-no-repeat blur-lg bg-background/50"
                style={{
                    backgroundImage: "url('/images/bg-utehy.jpg')"
                }}            
            />
            
            <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-background/80 backdrop-blur-sm py-8 rounded-lg">
                    {children}
                </div>
            </main>

            <ToastContainer />
        </div>
    );
}
