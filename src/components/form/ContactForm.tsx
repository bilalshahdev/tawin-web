"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "@/components/MyImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { useSubmitContactForm } from "@/hooks/useContact"
import { SpinnerLoader } from "../common/SpinnerLoader"

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  message: z.string().min(1, 'Message is required'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

const ContactForm = ({ isHome }: { isHome?: boolean }) => {
  const t = useTranslations("translation");
  const { mutate, isPending } = useSubmitContactForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutate(data, { onSuccess: () => reset() });
  };

  return (
    <section className="max-w-7xl mx-auto md:ltr:pl-6 md:rtl:pr-6 my-16 bg-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Contact Form - Wrapped in a form tag */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-1/2 space-y-6">
          {
            isHome &&
            <p className="text-center flex-1 mt-8 px-4 md:px-12 text-gray-800 text-lg font-semibold leading-relaxed">
              {t("contact")}
            </p>
          }

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("fullName")}</Label>
              <Input
                placeholder={t("fullNamePlaceholder")}
                className="border-gray-200 bg-white rounded-lg h-12"
                {...register("name")}
                error={!!errors.name}
                errorMessage={errors.name?.message}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("email")}</Label>
              <Input
                placeholder={t("emailPlaceholder")}
                type="email"
                className="border-gray-200 bg-white rounded-lg h-12"
                {...register("email")}
                error={!!errors.email}
                errorMessage={errors.email?.message}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("message")}</Label>
              <Textarea
                placeholder={t("messagePlaceholder")}
                className="border-gray-200 bg-white rounded-xl min-h-[150px] resize-none"
                {...register("message")}
                error={!!errors.message}
                errorMessage={errors.message?.message}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className={isHome ? "w-full" : "w-40"}
            disabled={isPending}
          >
            {isPending ? <SpinnerLoader /> : t("send")}
          </Button>
        </form>

        <div className={`w-full lg:w-1/2 bg-gray-200 overflow-hidden relative ${isHome ? "h-[500px]" : "h-[415px]"}`}>
          {isHome ? (
            <Image
              src="/about-us.png"
              alt="Contact Background"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13340.574676104443!2d44.4255!3d33.3152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x155781a71e84a287%3A0xc3f34567890!2sKarrada%2C%20Baghdad%2C%20Iraq!5e0!3m2!1sen!2s!4v1709400000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactForm