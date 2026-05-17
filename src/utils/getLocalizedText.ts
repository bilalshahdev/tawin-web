export function getLocalizedText(
  textObj: LocalizedString | undefined,
  locale: string,
  fallback: string = "en"
) {
  if (!textObj) return ""

  return (
    textObj[locale] ||
    textObj[fallback] ||
    Object.values(textObj).find(Boolean) ||
    ""
  )
}