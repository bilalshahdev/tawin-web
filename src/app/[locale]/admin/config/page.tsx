"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import MyImage from "@/components/MyImage";
import { Save } from "lucide-react";
import { MultilingualInput } from "@/components/form/MultilingualInput";

const AdminSettingsPage = () => {
    const t = useTranslations("translation");
    const { data: settings, isLoading } = useSettings();
    const { mutate: update, isPending } = useUpdateSettings();

    const [previews, setPreviews] = useState<Record<string, string>>({});

    const methods = useForm({
        defaultValues: {
            businessName: { en: "", ar: "" },
            tagline: { en: "", ar: "" },
            enableContactEmail: true,
            currency: "",
            currencySymbol: "",
            socialLinks: { whatsapp: "", facebook: "", instagram: "", youtube: "" },
            header: {
                landing_page: { text: { en: "", ar: "" } },
                home: { text: { en: "", ar: "" } },
                shop: { text: { en: "", ar: "" } },
            },
            pages: {
                privacyPolicy: { en: "", ar: "" },
                termsAndConditions: { en: "", ar: "" },
                about: { en: "", ar: "" },
            },
        },
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (settings) {
            reset(settings);
        }
    }, [settings, reset]);

    const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
        }
    };

    const onSubmit = (data: any) => {
        const formData = new FormData();

        // Core Fields
        formData.append("enableContactEmail", String(data.enableContactEmail));
        formData.append("businessName[en]", data.businessName.en);
        formData.append("businessName[ar]", data.businessName.ar);
        formData.append("tagline[en]", data.tagline.en);
        formData.append("tagline[ar]", data.tagline.ar);
        formData.append("currency", data.currency);
        formData.append("currencySymbol", data.currencySymbol);

        // Socials
        Object.keys(data.socialLinks).forEach(key => {
            formData.append(`socialLinks[${key}]`, data.socialLinks[key]);
        });

        // Headers
        formData.append("header[landing_page][text][en]", data.header.landing_page.text.en);
        formData.append("header[landing_page][text][ar]", data.header.landing_page.text.ar);
        formData.append("header[home][text][en]", data.header.home.text.en);
        formData.append("header[home][text][ar]", data.header.home.text.ar);
        formData.append("header[shop][text][en]", data.header.shop.text.en); // Added Shop text en
        formData.append("header[shop][text][ar]", data.header.shop.text.ar); // Added Shop text ar

        // Pages
        formData.append("pages[privacyPolicy][en]", data.pages.privacyPolicy.en);
        formData.append("pages[privacyPolicy][ar]", data.pages.privacyPolicy.ar);
        formData.append("pages[termsAndConditions][en]", data.pages.termsAndConditions.en);
        formData.append("pages[termsAndConditions][ar]", data.pages.termsAndConditions.ar);
        formData.append("pages[about][en]", data.pages.about.en);
        formData.append("pages[about][ar]", data.pages.about.ar);

        // Files
        const logoFile = (document.getElementById("logo-input") as HTMLInputElement).files?.[0];
        const landingImg = (document.getElementById("landing-image-input") as HTMLInputElement).files?.[0];
        const homeImg = (document.getElementById("home-image-input") as HTMLInputElement).files?.[0];
        const shopImg = (document.getElementById("shop-image-input") as HTMLInputElement).files?.[0]; // Added Shop input check

        if (logoFile) formData.append("logo", logoFile);
        if (landingImg) formData.append("header[landing_page][image]", landingImg);
        if (homeImg) formData.append("header[home][image]", homeImg);
        if (shopImg) formData.append("header[shop][image]", shopImg); // Added Shop image append

        update(formData);
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><SpinnerLoader /></div>;

    return (
        <div className="space-y-6 p-4 max-w-5xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-2xl font-bold text-slate-800">{t("appSettings")}</h1>
                <Button onClick={handleSubmit(onSubmit)} variant="primary" disabled={isPending} className="w-40">
                    {isPending ? <SpinnerLoader /> : <><Save className="mr-2 h-4 w-4" /> {t("saveChanges")}</>}
                </Button>
            </div>

            <FormProvider {...methods}>
                <form className="space-y-10">
                    {/* Section: General Branding */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl border shadow-sm">
                        <div className="space-y-6">
                            <h2 className="font-semibold text-aqua border-b pb-2">{t("branding")}</h2>
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden">
                                    <MyImage src={previews.logo || settings?.logo} alt="logo" width={80} height={80} className="object-contain" />
                                    <input type="file" id="logo-input" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFilePreview(e, "logo")} />
                                </div>
                                <Label>{t("uploadLogo")}</Label>
                            </div>
                            <MultilingualInput label={t("businessName")} name="businessName" />
                            <MultilingualInput label={t("tagline")} name="tagline" />
                            <div className="space-y-1">
                                <Label>{t("currency")}</Label>
                                <Input variant="auth" {...methods.register("currency" as any)} placeholder="e.g. USD" />
                            </div>
                            <div className="space-y-1">
                                <Label>{t("currencySymbol")}</Label>
                                <Input variant="auth" {...methods.register("currencySymbol" as any)} placeholder="e.g. $" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="font-semibold text-aqua border-b pb-2">{t("socialMedia")}</h2>
                            <div className="space-y-4">
                                {["whatsapp", "facebook", "instagram", "youtube"].map((social) => (
                                    <div key={social} className="space-y-1">
                                        <Label className="capitalize">{social}</Label>
                                        <Input variant="auth" {...methods.register(`socialLinks.${social}` as any)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section: Header Config */}
                    <section className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
                        <h2 className="font-semibold text-aqua border-b pb-2">{t("headersConfig")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <MultilingualInput label={t("landingPageText")} name="header.landing_page.text" type="textarea" />
                                <div className="relative h-40 border-2 border-dashed rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                                    <MyImage src={previews.landing || settings?.header?.landing_page?.image} alt="Landing" width={300} height={150} className="object-cover" />
                                    <input type="file" id="landing-image-input" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFilePreview(e, "landing")} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <MultilingualInput label={t("homePageText")} name="header.home.text" type="textarea" />
                                <div className="relative h-40 border-2 border-dashed rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                                    <MyImage src={previews.home || settings?.header?.home?.image} alt="Home" width={300} height={150} className="object-cover" />
                                    <input type="file" id="home-image-input" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFilePreview(e, "home")} />
                                </div>
                            </div>
                            {/* New Shop Page Section Added Below */}
                            <div className="space-y-6">
                                <MultilingualInput label={t("shopPageText")} name="header.shop.text" type="textarea" />
                                <div className="relative h-40 border-2 border-dashed rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                                    <MyImage src={previews.shop || settings?.header?.shop?.image} alt="Shop" width={300} height={150} className="object-cover" />
                                    <input type="file" id="shop-image-input" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFilePreview(e, "shop")} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Legal & Information Pages */}
                    <section className="space-y-8 bg-white p-6 rounded-xl border shadow-sm">
                        <h2 className="font-semibold text-aqua border-b pb-2">{t("pagesContent")}</h2>
                        <div className="space-y-10">
                            <MultilingualInput
                                label={t("aboutUs")}
                                name="pages.about"
                                type="rich-text"
                            />
                            <MultilingualInput
                                label={t("privacyPolicy")}
                                name="pages.privacyPolicy"
                                type="rich-text"
                            />
                            <MultilingualInput
                                label={t("termsAndConditions")}
                                name="pages.termsAndConditions"
                                type="rich-text"
                            />
                        </div>
                    </section>

                </form>
            </FormProvider>
        </div>
    );
};

export default AdminSettingsPage;