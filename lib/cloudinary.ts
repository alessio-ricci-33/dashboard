import { v2 as cloudinary } from 'cloudinary';

if (!globalThis.cloudinary) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	globalThis.cloudinary = cloudinary;
}

export async function deleteFolderRecursively(folder: string) {
	try {
		// 1. Elimina tutte le risorse dentro la cartella
		console.log(`Deleting all resources in ${folder}...`);
		await cloudinary.api.delete_resources_by_prefix(folder);

		// 2. Controlla se ci sono ancora risorse residue (loop di sicurezza)
		let result;
		do {
			result = await cloudinary.api.resources({
				type: 'upload',
				prefix: folder,
				max_results: 100,
			});

			if (result.resources.length > 0) {
				const ids = result.resources.map(r => r.public_id);
				await cloudinary.api.delete_resources(ids);
				// sleep di 500 ms per evitare race condition lato Cloudinary
				await new Promise(res => setTimeout(res, 500));
			}
		} while (result.resources.length > 0);

		// 3. Ora la cartella è vuota → può essere cancellata
		console.log(`Deleting folder ${folder}...`);
		await cloudinary.api.delete_folder(folder);

		console.log(`Folder ${folder} deleted successfully`);
	} catch (error) {
		console.error('Error deleting folder:', error);
	}
}

export default globalThis.cloudinary;
