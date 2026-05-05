"use client"

import CategorySection from "./CategorySection"
import PromotionSection from "./PromotionSection"
import BestSellerSection from "./BestSellerSection"
import HeroSection from "./HeroSection"
import Container from "@/components/common/Container"

export default function Home() {
    return (
        <div className="w-full space-y-10">
            <HeroSection />
            <Container>
                <BestSellerSection />
                <CategorySection />
            </Container>
            <PromotionSection />
        </div>
    )
}