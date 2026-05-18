"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { ShieldX } from "lucide-react"

interface InactiveProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const InactiveProfileDialog = ({
    open,
    onOpenChange,
}: InactiveProfileDialogProps) => {
    const router = useRouter();
    const t = useTranslations("translation");

    const handleRedirectToProfile = () => {
        router.push("/my-account")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] bg-background border-border">
                <DialogHeader className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-yellow-500/10">
                        <ShieldX className="w-6 h-6 text-red" />
                    </div>
                    <DialogTitle className="text-foreground">{t("verificationRequired")}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {t("verificationRequiredDescription")}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="grid grid-cols-2 gap-3 sm:justify-start mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full rounded-full border-gray-300"
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleRedirectToProfile}
                        variant="primary"
                        className="rounded-full"
                    >
                        {t("verifyNow")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}