import { Sidebar, SidebarFooter, SidebarTrigger } from '@/ui/sidebar';

import type { PropsWithChildren } from 'react';

export default ({ children }: PropsWithChildren) => {
	return (
		<Sidebar className="flex flex-col justify-start items-start bg-transparent !border-none gap-p">
			{children}
			<SidebarFooter className="mt-auto">
				<SidebarTrigger className="hidden collapsed:block cursor-pointer [&>svg]:!text-zinc-300 !size-fit [&>svg]:!size-5.5 [&>svg]:!p-0" />
			</SidebarFooter>
		</Sidebar>
	);
};
