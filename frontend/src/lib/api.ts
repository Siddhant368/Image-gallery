import { PaginatedImagesResponse, ImageItem } from '../types/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getImages(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  sort: string = 'newest'
): Promise<PaginatedImagesResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search ? { search } : {}),
    sort,
  });

  const res = await fetch(`${API_URL}/images?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch images');
  return res.json();
}

export async function getImage(id: string): Promise<ImageItem> {
  const res = await fetch(`${API_URL}/images/${id}`);
  if (!res.ok) throw new Error('Failed to fetch image');
  return res.json();
}

export async function uploadImage(title: string, file: File): Promise<ImageItem> {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('file', file);

  const res = await fetch(`${API_URL}/images`, {
    method: 'POST',
    body: formData, // Browser sets multipart/form-data boundary automatically
  });

  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
}

export async function updateImageTitle(id: string, title: string): Promise<ImageItem> {
  const res = await fetch(`${API_URL}/images/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error('Failed to update image');
  return res.json();
}

export async function deleteImage(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/images/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete image');
  return res.json();
}
