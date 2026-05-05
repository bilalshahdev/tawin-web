export default function getDirection(locale: string): "rtl" | "ltr" {
  const rtlLocales = ["ar", "ur", "fa", "he"];
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
