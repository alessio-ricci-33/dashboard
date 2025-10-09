import _try from '@/utils/_try';
import { NextResponse } from 'next/server';

import cloudinary, { deleteFolderRecursively } from '@/lib/cloudinary';

// --- Funzione Principale di Upload ---
async function uploadFrame({ file, index, folder }: { file: File; index: number; folder: string }) {
	const timestamp = Date.now();
	const paddedIndex = String(index).padStart(5, '0'); // Usiamo 5 cifre per un range più ampio
	const publicId = `project-${timestamp}-frame-${paddedIndex}`;

	// 2. Conversione del File in Buffer e poi Base64 Data URL
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;

	// 3. Upload tramite Cloudinary SDK (v2)
	const uploadResult = await cloudinary.uploader.upload(dataUrl, {
		public_id: publicId,
		folder,
		resource_type: 'image',
		// Includi l'indice originale nei metadati (context) per maggiore sicurezza
		context: `frame_index=${index};display_name=Frame ${index + 1};original_filename=${
			file.name
		}`,
	});

	return {
		publicId: uploadResult.public_id,
		url: uploadResult.secure_url,
		displayName: `Frame ${index + 1}`,
		originalIndex: index, // Utile per il frontend/database
	};
}

export const POST = async (request: Request) =>
	await _try(async () => {
		if (!process.env.CLOUDINARY_CLOUD_NAME)
			throw new Error('Cloudinary non configurato correttamente.');

		const formData = await request.formData();

		// Recupera la lista di File/Blob. Usa la chiave che hai impostato nel FormData lato client (e.g., 'frames')
		const files = formData.getAll('frames') as File[];
		console.log(files);

		// Recupera il valore numerico di FPS
		const fpsValue = formData.get('fps'),
			fps = fpsValue ? parseInt(fpsValue.toString()) : 24,
			assetName = formData.get('assetName'); // Default a 24fps

		if (files.length === 0) {
			return NextResponse.json(
				{ message: 'Nessun frame (blob) trovato nel FormData.' },
				{ status: 400 }
			);
		}

		const folder = `tmp/${assetName}`;

		try {
			await deleteFolderRecursively(folder);
		} finally {
			const results = await Promise.all(
				files
					.filter(file => file.name && file.size > 0) // Filtra gli elementi vuoti
					.map((file, index) => uploadFrame({ file, index, folder }))
			);

			return NextResponse.json(
				{
					message: `Upload di ${results.length} frame completato.`,
					uploadedFrames: results,
				},
				{ status: 200 }
			);
		}
	});
