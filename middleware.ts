import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
    const accessToken = cookies().get('accessToken')?.value || ""

    if (!accessToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // fetch to api to check if token is valid
    const data = await fetch((process.env.NEXT_PUBLIC_API_BASE_URL as string) + '/auth/verify-token', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const checkTokenResponse = await data.json()

    if (!checkTokenResponse.data.is_token_valid) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (checkTokenResponse.data.username) {
        // fetch to api to get user role
        const data = await fetch((process.env.NEXT_PUBLIC_API_BASE_URL as string) + `/users/${checkTokenResponse.data.username}/role`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        const getRoleResponse = await data.json()

        if (getRoleResponse.role === 'admin') {
            if (!request.nextUrl.pathname.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            } else {
                return NextResponse.next();
            }
        } else if (getRoleResponse.role === 'superadmin') {
            if (!request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/superadmin')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            } else {
                return NextResponse.next();
            }
        }
        else {
            if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/superadmin')) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            else {
                return NextResponse.next();
            }
        }
    }
}

export const config = {
    matcher: [
        '/academies/:academyId/module-groups/:moduleGroupId/modules/:path*',
        '/adememies/:academyId/discussions/:path*',
        '/academiessubmission/:path*',
        '/admin/:path*',
        '/superadmin/:path*',
    ]
}