import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'

const ProductError = () => {
    const t = useTranslations("translation");
    return (
        <div className="min-h-screen flex flex-col items-center justify-center container mx-auto px-4 py-20 text-center">
            <div className="bg-red-100 p-6 rounded-full mb-4">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">{t("productNotFound")}</h1>
            <p className="text-muted-foreground">{t("productNotFoundDescription")}</p>
            <Button
                variant="link"
                className="mt-4 text-aqua"
                onClick={() => window.location.href = '/shop'}
            >
                {t("viewAllProducts")}
            </Button>
        </div>
    )
}

export default ProductError