import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login']
const COOKIE_NAME = 'aakar_token'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  // Public routes: allow all
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes: require token
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Token exists, allow through. Pages verify JWT server-side via getServerUser()
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
