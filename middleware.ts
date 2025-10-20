// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const token = req.cookies.get('auth_token')?.value;
	const url = req.nextUrl.clone();

	// Se non autenticato, redirect su /login
	if (!token && !url.pathname.startsWith('/login')) {
		url.pathname = '/login';
		return NextResponse.redirect(url);
	}

	// Se autenticato e prova ad accedere a /login, redirect su dashboard
	if (token && url.pathname.startsWith('/login')) {
		url.pathname = '/';
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	// Esclude API, file statici e asset
	matcher: ['/((?!api|_next|static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
