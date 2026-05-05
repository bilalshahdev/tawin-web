import type { Metadata } from "next";
import "./globals.css";
import { cairo } from "@/lib/fonts";
import Provider from "@/components/providers/Provider";
import getDirection from "@/utils/getDirection";
import TopLoader from "@/components/ui/TopLoader";

export const metadata: Metadata = {
  title: "Construction | Home"
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params;
  const dir = getDirection(locale);
  return (
    <html dir={dir} lang={locale} suppressHydrationWarning>
      <body className={`${cairo.className} overflow-x-hidden`} suppressHydrationWarning>
        <Provider>
          {children}
          <TopLoader />
        </Provider>
      </body>
    </html>
  );
}
