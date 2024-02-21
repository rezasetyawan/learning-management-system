import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
    const publicUrl = ['/login', '/register', '/not-found.svg']
    if (publicUrl.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    const accessToken = cookies().get('accessToken')?.value

    if (!accessToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // fetch to api to check if token is valid
    const data = await fetch('http://localhost:3000/auth/verify-token', {
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
        const data = await fetch(`http://localhost:3000/users/${checkTokenResponse.data.username}/role`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        const getRoleResponse = await data.json()

        if (getRoleResponse.role === 'admin') {
            if (!request.nextUrl.pathname.startsWith('/admin')) {
                console.log("Redirect admin")
                return NextResponse.redirect(new URL('/admin', request.url));
            } else {
                console.log("Admin next")
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

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
        '/login',
        '/register',
        '/'
    ]
}