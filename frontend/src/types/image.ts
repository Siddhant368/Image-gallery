export interface ImageItem {
  _id: string;
  title: string;
  imageUrl: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedImagesResponse {
  data: ImageItem[];
  pagination: PaginationData;
}
