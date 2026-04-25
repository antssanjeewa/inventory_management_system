import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userRole = request.cookies.get('user_role')?.value;
    const token = request.cookies.get('auth_token')?.value;

    const { pathname } = request.nextUrl;

    if (!token && pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const adminOnlyRoutes = ['/users', '/activity-logs'];
    if (userRole === 'staff' && adminOnlyRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        '/users/:path*',
        '/activity-logs/:path*',
        '/inventory/:path*',
        '/storage/:path*',
        '/borrowing/:path*',
        '/dashboard/:path*'
    ],
};