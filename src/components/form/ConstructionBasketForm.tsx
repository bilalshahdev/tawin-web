"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Paperclip } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/button"
import { useApplyForBasket } from "@/hooks/useBasket"
import { ConstructionBasketSchema, ConstructionBasketType } from "@/validations/basket"
import { useSettings } from "@/hooks/useSettings"

const ConstructionBasketForm = () => {
    const t = useTranslations("translation");
    const { mutate: applyForBasket, isPending } = useApplyForBasket();
    const { data: settings } = useSettings();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ConstructionBasketType>({
        resolver: zodResolver(ConstructionBasketSchema),
        defaultValues: {
            country: "Iraq",
        },
    });

    const handleFileChange = (
        field: "residenceCard" | "unifiedCard",
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue(field, file.name, { shouldValidate: true });
        }
    };

    const onSubmit = (data: ConstructionBasketType) => {
        applyForBasket(data, {
            onSuccess: () => {
                reset();
            }
        });
    };

    const inputStyles = "border-gray-300 rounded-lg h-[50px]";
    const selectTriggerStyles = "w-full py-[25px] border-gray-300 bg-gray-50 rounded-lg";

    return (
        <div className="space-y-10 animate-in fade-in duration-300">
            <div className="border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">{t("personalInformation")}</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <Label>{t("fullName")}</Label>
                    <Input
                        placeholder={t("fullNamePlaceholder")}
                        className={inputStyles}
                        {...register("fullRegistrationName")}
                    />
                    {errors.fullRegistrationName && (
                        <p className="text-sm text-red-500">{errors.fullRegistrationName.message}</p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label>{t("phoneNumber")}</Label>
                    <Input
                        placeholder="+964 000 000 0000"
                        className={inputStyles}
                        {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                        <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                    )}
                </div>

                {/* Occupation + Monthly Income */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>{t("occupation")}</Label>
                        <Controller
                            name="occupation"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={selectTriggerStyles}>
                                        <SelectValue placeholder={t("selectEmployer")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="private">{t("privateSector")}</SelectItem>
                                        <SelectItem value="government">{t("government")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.occupation && (
                            <p className="text-sm text-red-500">{errors.occupation.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>{t("monthlyIncome")}</Label>
                        <Input
                            placeholder={`e.g. 1,000,000 ${settings?.currencySymbol || 'USD'}`}
                            className={inputStyles}
                            type="number"
                            {...register("monthlyIncome", { valueAsNumber: true })}
                        />
                        {errors.monthlyIncome && (
                            <p className="text-sm text-red-500">{errors.monthlyIncome.message}</p>
                        )}
                    </div>
                </div>

                {/* Residence Card + Unified Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>{t("residenceCard")}</Label>
                        <div className="relative">
                            <Input
                                placeholder={t("uploadResidence")}
                                className={`${inputStyles} ltr:pl-10 rtl:pr-10 bg-gray-50 cursor-pointer`}
                                readOnly
                                onClick={() => document.getElementById("residenceCardInput")?.click()}
                                value={undefined}
                                {...register("residenceCard")}
                            />
                            <input
                                id="residenceCardInput"
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileChange("residenceCard", e)}
                            />
                            <Paperclip className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        {errors.residenceCard && (
                            <p className="text-sm text-red-500">{errors.residenceCard.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>{t("unifiedCard")}</Label>
                        <div className="relative">
                            <Input
                                placeholder={t("uploadUnified")}
                                className={`${inputStyles} ltr:pl-10 rtl:pr-10 bg-gray-50 cursor-pointer`}
                                readOnly
                                onClick={() => document.getElementById("unifiedCardInput")?.click()}
                                value={undefined}
                                {...register("unifiedCard")}
                            />
                            <input
                                id="unifiedCardInput"
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileChange("unifiedCard", e)}
                            />
                            <Paperclip className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        {errors.unifiedCard && (
                            <p className="text-sm text-red-500">{errors.unifiedCard.message}</p>
                        )}
                    </div>
                </div>

                {/* Property Type + Property Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>{t("propertyType")}</Label>
                        <Controller
                            name="propertyType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={selectTriggerStyles}>
                                        <SelectValue placeholder={t("selectPropertyType")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Freehold">{t("freehold")}</SelectItem>
                                        <SelectItem value="Leasehold">{t("leasehold")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.propertyType && (
                            <p className="text-sm text-red-500">{errors.propertyType.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>{t("propertyArea")}</Label>
                        <Input
                            placeholder="e.g. 200"
                            className={inputStyles}
                            {...register("propertyArea")}
                        />
                        {errors.propertyArea && (
                            <p className="text-sm text-red-500">{errors.propertyArea.message}</p>
                        )}
                    </div>
                </div>

                <Button variant="primary" className="w-54" type="submit" disabled={isPending}>
                    {isPending ? t("submitting") : t("completeRegistration")}
                </Button>
            </form>
        </div>
    );
};

export default ConstructionBasketForm;