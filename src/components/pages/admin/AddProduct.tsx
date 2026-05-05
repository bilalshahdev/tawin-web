"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Import resolver
import { useAddProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/form/ProductForm";
import ProductImageForm from "@/components/form/ProductImageForm";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import { useTranslations } from "next-intl";
import { productFormSchema, ProductFormValues } from "@/validations/product";

export default function AddProductPage() {
    const t = useTranslations("translation");
    
    const { mutate: addProduct, isPending } = useAddProduct();

    const methods = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            title: { en: "", ar: "" },
            description: { en: "", ar: "" },
            price: "",
            category: "",
            remainingPieces: 0,
            isNewArrival: false,
            variant : "",
            photo: null,
            images: []
        },
    });

    const onSubmit = (values: ProductFormValues) => {
        const fd = new FormData();

        fd.append("title[en]", values.title.en);
        if (values.title.ar) fd.append("title[ar]", values.title.ar);
        fd.append("description[en]", values.description.en);
        if (values.description.ar) fd.append("description[ar]", values.description.ar);
        fd.append("category", values.category);
        fd.append("price", String(values.price));
        fd.append("variant", values.variant || "");
        fd.append("remainingPieces", String(values.remainingPieces));
        fd.append("isNewArrival", String(values.isNewArrival));

        if (values.photo) {
            fd.append("photo", values.photo);
        }

        values.images?.forEach((img) => {
            fd.append("images", img);
        });

        addProduct(fd);
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6 p-1 mb-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
                    <ProductForm />
                    <ProductImageForm />
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="submit"
                        disabled={isPending}
                        variant="primary"
                        className="h-12 max-w-34 px-8 rounded-md"
                    >
                        {isPending ? <SpinnerLoader /> : t("saveProduct")}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}