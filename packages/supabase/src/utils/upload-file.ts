import type { FileOptions } from "@supabase/storage-js";
import type { SupabaseInstance } from "../types";

export async function upload(
	supabase: SupabaseInstance,
	bucket: string,
	path: string,
	file: File,
	options?: FileOptions,
) {
	return await supabase.storage.from(bucket).upload(path, file, options);
}

export async function uploadFile(
	supabase: SupabaseInstance,
	bucket: string,
	path: string,
	file: File,
	options?: FileOptions,
) {
	const { data, error } = await upload(supabase, bucket, path, file, options);

	if (error) {
		throw error;
	}

	const {
		data: { publicUrl },
	} = supabase.storage.from(bucket).getPublicUrl(data.path);

	return publicUrl;
}

export async function uploadUserAvatar(
	supabase: SupabaseInstance,
	path: string,
	file: File,
	options?: FileOptions,
) {
	return await uploadFile(supabase, "avatars", path, file, options);
}

export async function uploadOrganizationLogo(
	supabase: SupabaseInstance,
	path: string,
	file: File,
	options?: FileOptions,
) {
	return await uploadFile(supabase, "avatars", path, file, options);
}
