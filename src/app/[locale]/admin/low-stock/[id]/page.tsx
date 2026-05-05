"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductForm from "@/components/form/ProductForm";
import ProductImageForm from "@/components/form/ProductImageForm";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import { useProductBySlug, useUpdateProduct } from "@/hooks/useProducts";
import { productFormSchema } from "@/validations/product";
import { z } from "zod";

type ProductFormValues = z.infer<typeof productFormSchema>;

const EditProductPage = () => {
    const { id } = useParams();
    const t = useTranslations("translation");
    const router = useRouter();

    const { data: productData, isLoading } = useProductBySlug(id as string);
    const { mutate: updateProduct, isPending } = useUpdateProduct();

    const methods = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            title: { en: "", ar: "" },
            description: { en: "", ar: "" },
            price: "",
            category: "",
            remainingPieces: 0,
            isNewArrival: false,
            // colors: [],
            // sizes: [],
            // weights: [{ unit: "", value: "" }],
            variant: "",
            photo: null,
            images: [],
        },
        values: productData ? {
            title: {
                en: productData.title?.en || "",
                ar: productData.title?.ar || "",
            },
            description: {
                en: productData.description?.en || "",
                ar: productData.description?.ar || "",
            },
            price: productData.price?.toString() ?? "",
            category: productData.category?._id ?? productData.category ?? "",
            remainingPieces: Number(productData.remainingPieces) || 0,
            isNewArrival: productData.isNewArrival ?? false,
            variant: productData.variant ?? "",
            // colors: productData.colors ?? [],
            // sizes: (productData.sizes as ProductFormValues["sizes"]) ?? [],
            // weights: productData.weights?.length
            //     ? (productData.weights as ProductFormValues["weights"])
            //     : [{ unit: "", value: "" }],
            photo: productData.photo || null,
            images: productData.images ?? [],
        } : undefined,
    });

    const onSubmit = (values: ProductFormValues) => {
        const fd = new FormData();

        fd.append("title[en]", values.title.en);
        if (values.title.ar) fd.append("title[ar]", values.title.ar);

        fd.append("description[en]", values.description.en);
        if (values.description.ar) fd.append("description[ar]", values.description.ar);

        fd.append("category", values.category);
        fd.append("price", String(values.price));
        fd.append("remainingPieces", String(values.remainingPieces));
        fd.append("isNewArrival", String(values.isNewArrival));
        fd.append("variant", values.variant || "");

        // values.colors?.forEach((c) => fd.append("colors", c));
        // values.sizes?.forEach((s) => fd.append("sizes", s));

        // if (values.weights?.[0]?.unit && values.weights?.[0]?.value) {
        //     fd.append("weights[0][unit]", values.weights[0].unit);
        //     fd.append("weights[0][value]", values.weights[0].value);
        // }

        if (values.photo) {
            fd.append("photo", values.photo);
        }

        values.images?.forEach((img) => {
            fd.append("images", img);
        });

        updateProduct({ id: productData?._id || (id as string), formData: fd },
    {
        onSuccess: () => {
            router.push("/admin/low-stock");
        }
    });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-60">
                <SpinnerLoader />
            </div>
        );
    }

    if (!productData) {
        return (
            <div className="p-6 text-gray-500 text-sm text-center">
                {t("productNotFound")}
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6 p-1 mb-10"
            >
                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => router.push("/admin/products/add")}
                    >
                        <Plus size={24} />
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
                    <ProductForm isEdit={true} />
                    <ProductImageForm
                        existingPhoto={productData?.photo}
                        existingImages={productData?.images ?? []}
                        isEdit={true}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="submit"
                        disabled={isPending}
                        variant="primary"
                        className="h-12 min-w-[140px] px-8 rounded-md"
                    >
                        {isPending ? <SpinnerLoader /> : t("saveProduct")}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default EditProductPage;
// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useTranslations, useLocale } from "next-intl";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import ProductForm from "@/components/form/ProductForm";
// import ProductImageForm from "@/components/form/ProductImageForm";
// import { lowStockData } from "@/components/pages/admin/LowStock";

// const EditLowStockPage = () => {
//     const router = useRouter();
//     const { id } = useParams();
//     const t = useTranslations("translation");
//     const locale = useLocale() as "en" | "ar";

//     const item = lowStockData.find((p) => String(p.id) === String(id));

//     if (!item) {
//         return (
//             <div className="p-6 text-gray-500 text-sm">
//                 {t("productNotFound")}
//             </div>
//         );
//     }

//     const productFormData = {
//         name: item.name[locale],
//         description: item.description,
//         price: item.price,
//         reducedPrice: item.reducedPrice,
//         expirationDate: item.expirationDate,
//         productionDate: item.productionDate,
//         warehouseAvailability: item.warehouseAvailability,
//         stockQuantity: item.stockQuantity,
//         unlimited: item.unlimited,
//         featured: item.featured,
//     };

//     const productImageData = {
//         mainImage: item.img,
//         thumbnails: item.thumbnails,
//         category: item.category.en.toLowerCase().replace(" ", "-"),
//         subcategory: item.subcategory,
//         selectedColors: item.selectedColors,
//     };

//     return (
//         <div className="space-y-6 p-1 mb-10">
//             <div className="flex items-center justify-end gap-3">
//                 <Button
//                     variant="outline"
//                     size="icon"
//                     className="h-12 w-12"
//                     onClick={() => router.push("/admin/products/add")}
//                 >
//                     <Plus size={24} />
//                 </Button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
//                 {/* <ProductForm product={productFormData} />
//                 <ProductImageForm product={productImageData} /> */}
//             </div>
//         </div>
//     );
// };

// export default EditLowStockPage;