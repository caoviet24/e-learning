import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isAuthenticated = request.cookies.has('access_token');
    const token = request.cookies.get('access_token')?.value;
    
   var role;
    if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        role = decoded.role;
    }

    
    // Public paths that don't require authentication
    const publicPaths = ['/auth/sign-in', '/auth/forget-password', '/auth/sign-up', '/forbidden'];
    const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    // If the user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    // If the user is authenticated but trying to access auth pages
    if (isAuthenticated && request.nextUrl.pathname.startsWith('/auth')) {
        // Redirect to appropriate dashboard based on role
        if (role === 1) {
            return NextResponse.redirect(new URL('/lecturer', request.url));
        }
        if (role === 0) {
            return NextResponse.redirect(new URL('/student', request.url));
        }
    }

    // Role-based route protection for authenticated users
    if (isAuthenticated && role) {
        const pathname = request.nextUrl.pathname;

        // Redirect root path to appropriate dashboard
        if (pathname === '/') {
            if (role === 1) {
                return NextResponse.redirect(new URL('/lecturer', request.url));
            }
            if (role === 0) {
                return NextResponse.redirect(new URL('/student', request.url));
            }
        }

        // Lecturer role (1) can only access /lecturer/* routes
        if (role === 1 && !pathname.startsWith('/lecturer')) {
            return NextResponse.redirect(new URL('/forbidden', request.url));
        }

        // Student role (0) can only access /student/* routes
        if (role === 0 && !pathname.startsWith('/student')) {
            return NextResponse.redirect(new URL('/forbidden', request.url));
        }
    }

    return NextResponse.next();
}

// Configure which routes should be handled by middleware
export const config = {
    matcher: [
        /*
         * Match all routes except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /static (inside /public)
         * 4. .*\\..*$ (files)
         */
        '/((?!api|_next|static|.*\\..*$).*)',
    ],
};
