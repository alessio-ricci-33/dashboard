'use client';

import * as React from 'react';

import Image from 'next/image';
import { Separator } from '@/ui/separator';
import { useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { cn } from '@/utils/shadcn';

const Env = ({
	name,
	icon,
	description,
}: {
	name: string;
	icon?: string;
	description?: string;
}) => {
	return (
		<SelectItem value={name.toLowerCase()} className="cursor-pointer !rounded-none">
			<div className="flex flex-row size-full justify-start items-center gap-2 !pr-2.5 overflow-hidden">
				<div className={'relative h-3/4 rounded-full aspect-square'}>
					<Image
						className="!w-auto !h-full my-auto rounded-full object-contain"
						src={icon}
						alt="Acme Logo"
						fill
					/>
				</div>
				<span className="flex flex-col items-start justify-center w-full gap-1">
					<h2 className="text-start w-full text-sm font-bold leading-none [font-family:var(--font-righteous)] line-clamp-1 text-ellipsis my-auto">
						{name}
					</h2>
					{description && (
						<p className="text-start text-[.7rem] leading-none line-clamp-1 text-ellipsis text-zinc-600 italic">
							{description}
						</p>
					)}
				</span>
			</div>
		</SelectItem>
	);
};

export default ({
	envs,
	className,
}: {
	className?: string;
	envs: {
		name: string;
		icon?: string;
		description?: string;
	}[];
}) => {
	const path = usePathname(),
		[open, setOpen] = React.useState(false);
	const segments = path.split('/').filter(Boolean);

	return (
		<>
			{open && (
				<div className="z-30 fixed left-0 top-[calc(var(--p)*3.5)] w-screen h-screen backdrop-blur-[1px]" />
			)}
			<Select defaultValue={envs[0].name} onOpenChange={setOpen}>
				<SelectTrigger
					className={cn(
						'[&>span]:flex [&>span]:size-full [&>span]:w-full shadow-none bg-transparent relative flex-row justify-start items-start size-full !p-0 cursor-pointer !outline-none focus-within:outline-none !ring-0 !border-none  focus-visible:ring-0 overflow-hidden',
						className
					)}>
					<SelectValue
						placeholder={
							<div className="flex flex-col justify-around items-start gap-y-0.5">
								<h2 className="text-sm font-bold leading-none">
									Select a project
								</h2>
								<p className="text-[.7rem] text-zinc-600 leading-none">
									Edita i contenuti
								</p>
							</div>
						}
					/>
				</SelectTrigger>
				<SelectContent
					side="bottom"
					align="start"
					sideOffset={7}
					alignOffset={-4}
					className="flex gap-p items-center w-full text-neutral-400 rounded-md border border-zinc-600/45 bg-sidebar dark:shadow-[0_0_7px_-1px_#b0e9ff4a] shadow-[0_0_7px_-1px_#00000055]">
					{envs.map((env, i) => (
						<div
							key={i}
							className="relative group grid grid-rows-subgrid grid-cols-subgrid !p-0 w-full overflow-hidden">
							{i !== 0 && (
								<Separator className="z-30 absolute top-0 left-0 bg-neutral-800 w-full" />
							)}
							<Env {...env} />
						</div>
					))}
				</SelectContent>
			</Select>
		</>
	);
};
