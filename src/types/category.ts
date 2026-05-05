export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Category {
  _id: string;
  name: LocalizedString;
  slug: string;
  type: "category" | "subCategory";
  description: LocalizedString;
  thumbnail: string; // URL from server
  icon: string;      // URL from server
  isActive: boolean;
  parentCategory?: {
    _id: string;
    name: LocalizedString;
    slug: string;
    id: string;
  } | null;
  subcategories?: Category[];
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}
