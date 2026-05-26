import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
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

// ✅ Esclusioni corrette per API, asset, PWA e immagini
export const config = {
	matcher: [
		'/((?!api|_next|static|manifest\.json|service-worker\.js|sw\.js|workbox-.*\.js|favicon\.ico|robots\.txt|sitemap\.xml|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
	],
};