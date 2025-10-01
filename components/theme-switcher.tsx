'use client';
import { useState } from 'react';
import switchTheme from '@/utils/switch-theme';
import { Switch } from '@/ui/switch';
import { BsMoonStars } from 'react-icons/bs';
import { LucideSunMoon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/utils/shadcn';

export default function ThemeSwitcher({ className }: { className?: string }) {
	const [theme, setTheme] = useTheme();
	const [checked, setChecked] = useState(theme === 'dark');
	return (
		<Switch
			className={cn('w-10 h-5 !py-0.5 !px-px', className)}
			checked={checked}
			onCheckedChange={c => {
				setChecked(c);
				setTheme(switchTheme(true));
			}}
			icon={checked ? <BsMoonStars size={8} /> : <LucideSunMoon size={8} />}
		/>
	);
}
