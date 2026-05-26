// hooks/useAuth.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { storage, indexedDBStore } from '@/utils/storage';
import { usePersistentState } from './usePersistentState';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
	user: any | null;
	loading: boolean;
	login: (userData: any, token?: string) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter(),
		pathname = usePathname();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = usePersistentState('user', null, 'local');
	const [hasAuthToken, setHasAuthToken] = useState(false);

	const readAuthToken = () => {
		if (typeof document === 'undefined') return null;

		return document.cookie
			.split('; ')
			.find(cookie => cookie.startsWith('auth_token='))
			?.split('=')[1]
			? decodeURIComponent(
					document.cookie
						.split('; ')
						.find(cookie => cookie.startsWith('auth_token='))
						?.split('=')[1] || ''
				)
			: null;
	};

	useEffect(() => {
		if (hasAuthToken && user && pathname === '/login') {
			router.replace('/');
			router.refresh();
		}
	}, [hasAuthToken, pathname, router, user]);

	useEffect(() => {
		const initAuth = async () => {
			const token = readAuthToken();
			setHasAuthToken(!!token);

			if (!token) {
				storage.remove('user');
				await indexedDBStore.set('user', null);
				setUser(null);
				setLoading(false);
				return;
			}

			const cached = storage.get('user');
			const dbUser = await indexedDBStore.get('user');
			setUser(cached || dbUser);
			setLoading(false);
		};
		initAuth();
	}, []);

	const login = async (userData: any, token?: string) => {
		storage.set('user', userData);
		await indexedDBStore.set('user', userData);
		if (token) {
			document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
			setHasAuthToken(true);
		}
		setUser(userData);
	};

	const logout = async () => {
		storage.remove('user');
		await indexedDBStore.set('user', null);
		document.cookie =
			'auth_token=; path=/; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		setHasAuthToken(false);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
				isAuthenticated: hasAuthToken,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
	return ctx;
};
