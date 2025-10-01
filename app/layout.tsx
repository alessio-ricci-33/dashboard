import './globals.css';
import '@/lib/cloudinary';

import { ThemeProvider } from '@/hooks/use-theme';
import { ReactNode } from 'react';
import { SidebarProvider } from '@/ui/sidebar';
import { Toaster } from '@/ui/sonner';

import type { Metadata, Viewport } from 'next';
import { Separator } from '@/ui/separator';
import BreadCrumbNav from '@/components/BreadCrumbNav';
import ThemeSwitcher from '@/components/theme-switcher';
import Image from 'next/image';
import { Dialog } from '@/ui/dialog';
import EnvSwitcher from '@/components/env-switcher';
import envs from '@/constants/projects';
import localFont from 'next/font/local';

const logo = localFont({
	src: './fonts/logo.otf',
	variable: '--font-logo',
});

const secondary = localFont({
	src: './fonts/secondary.ttf',
	variable: '--font-secondary',
});

export const metadata: Metadata = {
	title: 'msgi',
	robots: { index: false, follow: false },
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: '#000',
};

export default function RootLayout({ sidebar, children: inset }: Layouts) {
	return (
		<html
			lang="it"
			className={`${logo.variable} ${secondary.variable} antialiased`}
			data-theme="dark">
			<ThemeProvider defaultValue="dark">
				<body className="antialiased">
					<div id="content">
						<div id="entry">
							<header className="shrink-0 flex flex-row items-center justify-start h-clamp-8 w-full gap-p">
								<span className="flex flex-row items-center w-(--sidebar-width) h-full gap-1.5">
									<div className="relative shrink-0 !w-clamp-10 aspect-square -ml-0.5">
										<Image
											style={{
												WebkitBoxReflect:
													'below -21% linear-gradient(transparent 45%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.6) )',
											}}
											className="!w-full !h-auto object-contain py-0.5"
											src={'/favicon.ico'}
											alt="Acme Logo"
											fill
										/>
									</div>
									<span
										className="text-lg font-bold text-zinc-700"
										style={{
											WebkitBoxReflect:
												'below -30% linear-gradient(transparent 31%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6) )',
										}}>
										/
									</span>
									<EnvSwitcher
										className="shrink !bg-transparent !pl-1"
										envs={envs}
									/>
								</span>

								<ThemeSwitcher className="ml-auto" />
							</header>
							<div className="contents">
								<Dialog>
									<SidebarProvider className="relative flex flex-row size-full gap-p bg-transparent">
										{sidebar}
										{inset}
									</SidebarProvider>
								</Dialog>
							</div>
						</div>
					</div>
					<Toaster />
				</body>
			</ThemeProvider>
		</html>
	);
}

export interface Layouts {
	children: ReactNode;
	sidebar: ReactNode;
}
