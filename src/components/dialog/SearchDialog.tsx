"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Search, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const t = useTranslations("translation")
    const router = useRouter()
    const [query, setQuery] = useState("")

    const handleSearch = () => {
        const trimmed = query.trim()
        if (!trimmed) return
        onOpenChange(false)
        setQuery("")
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch()
        if (e.key === "Escape") onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>{t("searchPlaceholder")}</DialogTitle>
                </VisuallyHidden>
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t("searchPlaceholder") ?? "Search..."}
                        className="flex-1 mx-3 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="px-4 py-3">
                    {query.trim() ? (
                        <button
                            onClick={handleSearch}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                        >
                            <Search className="w-4 h-4 text-gray-400 group-hover:text-aqua transition-colors" />
                            <span className="text-sm text-gray-700">
                                {t("searchFor") ?? "Search for"}{" "}
                                <span className="font-semibold text-gray-900">"{query}"</span>
                            </span>
                        </button>
                    ) : (
                        <p className="text-xs text-gray-400 text-center py-4">
                            {t("searchHint") ?? "Type to start searching..."}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}