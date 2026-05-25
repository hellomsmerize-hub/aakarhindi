import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_ROUTES = ['/', '/login']
const TEACHER_ROUTE_PREFIX = '/teacher'
const COOKIE_NAME = 'aakar_token'

async function getPayload(token: string, secret: string) {
  try {
    const key = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, key)
    return payload as {
      userId: string
      username: string
      role: 'student' | 'teacher'
      track?: string
      grade?: string
      name: string
    }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(COOKIE_NAME)?.value

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isTeacherRoute =
      pathname.startsWith('/teacher') ||
      pathname === TEACHER_ROUTE_PREFIX

    const jwtSecret = process.env.JWT_SECRET ?? ''

    if (isPublicRoute) {
      if (token && jwtSecret) {
        const payload = await getPayload(token, jwtSecret)
        if (payload) {
          const dest = payload.role === 'teacher' ? '/teacher' : '/dashboard'
          return NextResponse.redirect(new URL(dest, request.url))
        }
      }
      return NextResponse.next()
    }

    if (!token || !jwtSecret) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const payload = await getPayload(token, jwtSecret)

    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete(COOKIE_NAME)
      return response
    }

    if (isTeacherRoute && payload.role !== 'teacher') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // On error, redirect to login instead of crashing
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
