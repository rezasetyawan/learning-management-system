'use server'

import { cookies } from 'next/headers'

export async function create(data: string) {
    cookies().set({
        name: 'accessToken',
        value: data,
        httpOnly: true,
        path: '/',
        secure: true
    })
}

export async function deleteCookies(key: string) {
    cookies().delete(key)
}