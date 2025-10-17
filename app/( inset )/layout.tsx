import { Separator } from '@/ui/separator';
import BreadcrumbNav from '@/components/BreadCrumbNav';
import { SidebarInset, SidebarRail, SidebarTrigger } from '@/ui/sidebar';

import ThemeSwitcher from '@/components/theme-switcher';
import { Sheet } from '@/ui/sheet';

import type { PropsWithChildren } from 'react';
import BreadCrumbNav from '@/components/BreadCrumbNav';

export default function Layout({ children }: PropsWithChildren) {
	return (
		<SidebarInset className="relative !max-h-full md:!max-h-svh shrink-0 gap-(--external-p)">
			<div
				id="chatContainer"
				className="relative size-full shrink-1 flex flex-col bg-background border-t border-l border-zinc-600/45 dark:shadow-[inset_4px_4px_17px_-10px_#b0e9ff4a] shadow-[inset_4px_4px_17px_-10px_#00000055] max-lg:rounded-t-3xl rounded-tl-lg gap-p py-p">
				<SidebarRail className="!bottom-0 !top-auto !-left-px !right-auto h-[calc(100%-.5rem)] group-data-[collapsible=offcanvas]:hover:after:!bg-zinc-700 hover:after:!bg-zinc-700 !w-6 cursor-e-resize" />
				<div className='z-20 absolute left-p top-p flex items-center gap-p md:[&:is(.group[data-collapsible="offcanvas"]_+_*_#header)]:h-4 transition-[height] ease-linear duration-300'>
					<SidebarTrigger className="cursor-pointer [&>svg]:text-zinc-400 !size-fit [&>svg]:!size-5 [&>svg]:!p-0" />
					<Separator
						orientation="vertical"
						className="h-3/5 aspect-[1/14] bg-zinc-600"
					/>
					<div className="shrink-0 flex flex-row justify-between items-center h-full gap-p ml-px">
						<BreadCrumbNav />
						{/* <InnerChatTrigger /> */}
					</div>
					{/* <Toolbar /> */}
				</div>

				<main className="relative flex-1 flex flex-col size-full gap-p mb-(--external-p) pt-clamp-10 transition-all duration-500 overflow-y-scroll overflow-x-hidden ">
					{children}
				</main>
				{/* <Sheet modal={false}>
					<InnerChat containerSelector="#chatContainer" /> 
				</Sheet> */}
			</div>
		</SidebarInset>
	);
}
