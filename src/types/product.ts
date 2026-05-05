export interface Product {
  _id: string
  title: LocalizedString;
  category: Category;
  slug: string;
  description?: LocalizedString;
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  photo?: string
  reviews?: number
  measurements?: string
  colors?: string[]
  remainingPieces?: number
  isNewArrival?: boolean
  discount?: number
  reviewCount?: number
  isListView?: boolean,
  variant?: string,
  sizes?: string[]
  weights?: { unit: string; value: string }[]
}

export interface Review {
  _id: string
  name: LocalizedString
  rating: number
  date: string
  comment: LocalizedString
  avatar: string
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}