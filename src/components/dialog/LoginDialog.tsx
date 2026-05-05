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

interface LoginDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const LoginDialog = ({
    open,
    onOpenChange,
}: LoginDialogProps) => {
    const router = useRouter();
    const t = useTranslations("translation");

    const handleLoginRedirect = () => {
        router.push("/auth/signin")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>{t("signInRequired")}</DialogTitle>
                    <DialogDescription>
                        {t("signInRequiredDescription")}
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
                        onClick={handleLoginRedirect}
                        variant="primary"
                        className="rounded-full"
                    >
                        {t("signIn")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}