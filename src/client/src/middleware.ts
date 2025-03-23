import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Role } from '@/types/enum';


export function middleware(request: NextRequest) {
    const isAuthenticated = request.cookies.has('access_token');
    const token = request.cookies.get('access_token')?.value;

    let role: string | undefined;
    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            role = typeof decoded.role === 'string' ? decoded.role : undefined;
        } catch (error) {
            console.error('Token decode error:', error);
        }
    }

    console.log('Role:', role);
    


    

    // Public paths that don't require authentication
    const publicPaths = ['/auth/sign-in', '/auth/forget-password', '/auth/sign-up', '/not-found'];
    const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    // If the user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    // Redirect root path to appropriate dashboard for authenticated users
    if (isAuthenticated && request.nextUrl.pathname === '/' && typeof role === 'string') {
        if (role === Role.STUDENT) {
            return NextResponse.redirect(new URL('/student', request.url));
        }

        if (role === Role.LECTURER) {
            return NextResponse.redirect(new URL('/lecturer', request.url));
        }
        
        if(role === Role.ADMIN) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // Role-based route protection for authenticated users
    if (isAuthenticated && typeof role === 'string') {
        const pathname = request.nextUrl.pathname;

        // Handle role-specific route access
        const isLecturerPath = pathname.startsWith('/lecturer');
        const isStudentPath = pathname.startsWith('/student');
        const isAdminPath = pathname.startsWith('/admin');

        if (role === Role.STUDENT && !isStudentPath && !isPublicPath) {
            return NextResponse.redirect(new URL('/not-found', request.url));
        }

        if (role === Role.LECTURER && !isLecturerPath && !isPublicPath) {
            return NextResponse.redirect(new URL('/not-found', request.url));
        }

        if (role === Role.ADMIN && !isAdminPath && !isPublicPath) {
            return NextResponse.redirect(new URL('/not-found', request.url));
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
