interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  allProducts?: boolean;
  featuredProducts?: boolean;
  reduced?: boolean;
  outOfStock?: boolean;
}

interface CardProps {
  title: LocalizedString;
  subtitle: LocalizedString;
  value?: string;
  change: string;
  changeLabel?: LocalizedString;
  changeType: 'increase' | 'decrease';
  footerValue?: string;
  footerLabel?: LocalizedString;
}

interface LocalizedString {
  en?: string;
  ar?: string;
  [key: string]: string | undefined;
}
interface Subcategory {
  _id: string | number;
  parentId: number;
  title: LocalizedString;
  slug: string;
}

interface Category {
  _id: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  slug: string;
  image: string;
  subcategories: Subcategory[];
}

interface Review {
  id: number
  name: string
  rating: number
  date: string
  comment: string
  avatar: string
}

interface OrderFormData {
  addressId: string;
  paymentMethod: string;
  couponCode?: string;
  phone: string;
}

interface AddStockFormData {
  supplierId: string;
  products: Array<{
    productId: string;
    quantity: number;
    batchNumber?: string;
    expiryDate?: string;
  }>;
  deliveryDate: string;
  invoiceNumber?: string;
  notes?: string;
}

interface UserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

