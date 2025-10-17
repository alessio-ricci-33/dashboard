'use client';

import { Separator } from '@/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';

import templates from './_templates/_export';

export default function Page() {
	return (
		<div className="flex flex-col justify-start items-start gap-p px-p">
			{templates.map((section, index) => (
				<>
					{index > 0 && <Separator />}
					<section
						key={index}
						className="flex flex-col justify-start items-start gap-1">
						<h1 className="text-2xl font-bold font-secondary">
							{section.title}
						</h1>
						<ul className="flex flex-row gap-p overflow-x-scroll">
							{section.templates.map((Template, index) => (
								<li key={index} className="overflow-visible">
									<Template.component />
								</li>
							))}
						</ul>
					</section>
				</>
			))}
		</div>
	);
}
