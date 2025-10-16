import { Button } from '@/ui/button';
import { FaPlus } from 'react-icons/fa6';
import { TbTemplate } from 'react-icons/tb';
import { FiGrid } from 'react-icons/fi';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/ui/dialog';
import {
	Sidebar,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from '@/ui/sidebar';

import type { PropsWithChildren } from 'react';
import Link from 'next/link';

export default ({ children }: PropsWithChildren) => {
	return (
		<Sidebar className="flex flex-col justify-start items-start bg-transparent !border-none gap-p">
			<SidebarHeader className=" w-full gap-p !p-0">
				<Dialog>
					<DialogTrigger asChild>
						<Button className="relative flex justify-center items-center cursor-pointer w-full text-sm font-medium border !border-muted-foreground/20 !bg-background hover:sepia-5 shadow-[0_0_10px_-1px_transparent] hover:!shadow-[0_0_7px_-2px_#b0e9ff4a] text-muted-foreground hover:text-sidebar-accent-foreground">
							<FaPlus className="collapsed:!size-5 hidden collapsed:block collapsed:opacity-100 collapse-sidebar-item" />

							<span className="collapsed:absolute self-center collapsed:inset-auto m-auto expand-sidebar-item">
								New post..
							</span>
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogTitle className="text-lg font-semibold leading-none tracking-tight">
							New post..
						</DialogTitle>
					</DialogContent>
				</Dialog>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem className="collapsed:!w-full">
							<SidebarMenuButton asChild>
								<Link
									href="/templates"
									className="rounded-md hover:bg-zinc-900 cursor-pointer p-sidebar-p collapsed:!w-full [&>svg]:size-5 [&>svg]:text-zinc-400">
									<TbTemplate className="collapse-sidebar-item opacity-100 collapsed:!w-full" />

									<hgroup className="expand-sidebar-item flex flex-col justify-around h-full text-muted-foreground menu-item-hover:text-sidebar-accent-foreground">
										<h2 className="font-bold leading-none">
											Templates
										</h2>
									</hgroup>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem className="collapsed:!w-full">
							<SidebarMenuButton asChild>
								<Link
									href="/tools"
									className="rounded-md hover:bg-zinc-900 cursor-pointer p-sidebar-p collapsed:!w-full [&>svg]:size-5 [&>svg]:text-zinc-400">
									<FiGrid className="collapse-sidebar-item opacity-100 collapsed:!w-full" />

									<hgroup className="expand-sidebar-item flex flex-col justify-around h-full text-muted-foreground menu-item-hover:text-sidebar-accent-foreground">
										<h2 className="font-bold leading-none">
											Tools
										</h2>
									</hgroup>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarHeader>

			{children}
			<SidebarFooter className="mt-auto">
				<SidebarTrigger className="hidden collapsed:block cursor-pointer [&>svg]:!text-zinc-300 !size-fit [&>svg]:!size-5.5 [&>svg]:!p-0" />
			</SidebarFooter>
		</Sidebar>
	);
};
