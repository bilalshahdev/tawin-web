import {
    LayoutGrid,
    ShoppingCart,
    Users,
    Truck,
    Tag,
    DollarSign,
    Building,
    Package,
    List,
    AlertTriangle,
    Star,
    Shield,
    Settings,
    type LucideIcon,
    HardHat,
    Folder,
} from 'lucide-react';

export type SidebarLabel =
    | 'dashboard'
    | 'orders'
    | 'users'
    | 'staff'
    | 'products'
    | 'construction-basket'
    | 'reviews'
    | 'suppliers'
    | 'coupon codes'
    | 'financial transfers'
    | 'brand'
    | 'stock';

export interface MenuItem {
    title: string;
    icon: LucideIcon;
    path: string;
    label: SidebarLabel;
}

export const sidebarMenu: MenuItem[] = [
    // Main Menu
    { title: "dashboard", icon: LayoutGrid, path: "/admin", label: "dashboard" },
    { title: "orderManagement", icon: ShoppingCart, path: "/admin/orders", label: "orders" },
    { title: "users", icon: Users, path: "/admin/users", label: "users" },
    { title: "suppliers", icon: Truck, path: "/admin/suppliers", label: "suppliers" },
    { title: "couponCodes", icon: Tag, path: "/admin/coupons", label: "coupon codes" },
    { title: "financialTransfers", icon: DollarSign, path: "/admin/financial-transfers", label: "financial transfers" },
    { title: "brand", icon: Building, path: "/admin/brand", label: "brand" },
    { title: "constructionBasket", icon: HardHat, path: "/admin/construction-basket", label: "construction-basket" },
    // { title: "category", icon: Folder, path: "/admin/category", label: "..." },

    // Products
    { title: "addProduct", icon: Package, path: "/admin/products/add", label: "products" },
    { title: "productList", icon: List, path: "/admin/product-list", label: "products" },
    { title: "lowStock", icon: AlertTriangle, path: "/admin/low-stock", label: "products" },
    { title: "customerReviews", icon: Star, path: "/admin/reviews", label: "reviews" },

    // Administration
    { title: "manager", icon: Shield, path: "/admin/manager", label: "staff" },
    { title: "controlPermissions", icon: Settings, path: "/admin/permissions", label: "staff" },
    { title: "config", icon: Settings, path: "/admin/config", label: "staff" }
];