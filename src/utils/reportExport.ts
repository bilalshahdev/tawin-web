const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const humanize = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

const valueToText = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "object") {
    const maybeLocalized = value as { en?: unknown; ar?: unknown };
    if (maybeLocalized.en || maybeLocalized.ar) {
      return [maybeLocalized.en, maybeLocalized.ar].filter(Boolean).join(" / ");
    }
    if (Array.isArray(value)) return value.map(valueToText).filter(Boolean).join(", ");
    return JSON.stringify(value);
  }
  return String(value);
};

const flattenRow = (row: Record<string, unknown>) => {
  const flattened: Record<string, string> = {};

  Object.entries(row).forEach(([key, value]) => {
    if (key.startsWith("_") || key === "__v") return;
    flattened[humanize(key)] = valueToText(value);
  });

  return flattened;
};

const buildTable = (rows: Record<string, string>[]) => {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const header = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(row[column])}</td>`).join("")}</tr>`)
    .join("");

  return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
};

const download = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const exportReport = (title: string, data: unknown[]) => {
  const rows = (data || []).map((item) => flattenRow(item as Record<string, unknown>));
  const safeTitle = title.replace(/[^\w-]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "report";
  const generatedAt = new Date().toLocaleString();

  if (!rows.length) {
    window.alert("No report data available to export.");
    return;
  }

  const table = buildTable(rows);
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    p { color: #6b7280; margin: 0 0 18px; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; font-size: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; font-weight: 700; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>Generated at ${escapeHtml(generatedAt)}</p>
  ${table}
</body>
</html>`;

  download(html, `${safeTitle}.xls`, "application/vnd.ms-excel;charset=utf-8");

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
};
