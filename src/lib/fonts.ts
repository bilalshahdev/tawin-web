import { Cairo } from "next/font/google";

export const cairo = Cairo({
  subsets: ["latin", "arabic"],
  display: "swap",
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});
