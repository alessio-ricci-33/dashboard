import { ImageLoader } from '@/components/imageLoader';
import { Input } from '@/ui/input';

export function resolveInputComponent(type) {
	switch (type) {
		case 'image':
			return ImageLoader;

		default:
			return Input;
	}
}
