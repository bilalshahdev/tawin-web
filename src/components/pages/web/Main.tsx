"use client"

import HeroSection from "./HeroSection"
import Foundations from "./Foundations"
import ContactSection from "./ContactSection"

export default function Main() {
    return (
        <div className="w-full bg-[#F3FFFD]">
            <HeroSection />
            <Foundations />
            <ContactSection />
        </div>
    )
}