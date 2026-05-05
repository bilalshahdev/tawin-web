"use client"

import { useSettings } from "@/hooks/useSettings"
import { useLocale } from "next-intl"
import HtmlContent from "@/components/common/HtmlContent"
import { useParams } from "next/navigation"
import { SpinnerLoader } from "@/components/common/SpinnerLoader"

const VALID_PAGES = ["privacyPolicy", "termsAndConditions", "about"]

export default function DynamicPage() {
  const { page } = useParams() as { page: string }
  const locale = useLocale() as "en" | "ar"
  const { data: settings, isLoading } = useSettings()

  if (!VALID_PAGES.includes(page)) return null

  const content = settings?.pages?.[page]?.[locale]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <SpinnerLoader />
        </div>
      ) : (
        <HtmlContent
          content={content ?? ""}
          className="prose prose-headings:font-semibold prose-h1:text-3xl prose-h3:text-xl prose-p:text-gray-500 prose-li:text-gray-500 max-w-none"
        />
      )}
    </div>
  )
}