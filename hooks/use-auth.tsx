// hooks/useAuth.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { storage, indexedDBStore } from '@/utils/storage';

interface AuthContextType {
	user: any | null;
	loading: boolean;
	login: (userData: any, token: string) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			const cached = storage.get('user');
			const dbUser = await indexedDBStore.get('user');
			setUser(cached || dbUser);
			setLoading(false);
		};
		initAuth();
	}, []);

	const login = async (userData: any, token: string) => {
		storage.set('user', userData);
		await indexedDBStore.set('user', userData);
		document.cookie = `auth_token=${token}; path=/;`;
		setUser(userData);
	};

	const logout = async () => {
		storage.remove('user');
		await indexedDBStore.set('user', null);
		document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
				isAuthenticated: !!user,
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
