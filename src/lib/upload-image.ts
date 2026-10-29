import { IMAGE_TYPES, MAX_IMAGE_BYTES, storagePath } from '@/lib/images'
import { createClient } from '@/lib/supabase/client'

// Browser only. Uploads straight to Storage; the bucket's policies accept only admins.
export async function uploadImage(
  file: File,
  folder: 'experiences' | 'hosts' | 'creators',
): Promise<{ url: string } | { error: string }> {
  const extension = IMAGE_TYPES[file.type]
  if (!extension) return { error: `${file.name}: use JPG, PNG or WebP.` }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: `${file.name}: larger than 2 MB. Export a smaller version.` }
  }

  const supabase = createClient()
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from('images')
    .upload(path, file, { contentType: file.type, cacheControl: '31536000' })
  if (error) return { error: `${file.name}: ${error.message}` }
  return { url: supabase.storage.from('images').getPublicUrl(path).data.publicUrl }
}

// Deletes an upload that was never saved: nothing points at it, so it would sit in storage.
export function discardUpload(url: string) {
  const path = storagePath(url)
  if (path) void createClient().storage.from('images').remove([path])
}
