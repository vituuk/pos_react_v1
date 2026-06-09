export function formatDateLabel(dateInput: string | Date | undefined, language: string, showYear = false) {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "—";

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const khMonths = [
    "មករា", // Jan
    "កុម្ភៈ", // Feb
    "មីនា", // Mar
    "មេសា", // Apr
    "ឧសភា", // May
    "មិថុនា", // Jun
    "កក្កដា", // Jul
    "សីហា", // Aug
    "កញ្ញា", // Sep
    "តុលា", // Oct
    "វិច្ឆិកា", // Nov
    "ធ្នូ"  // Dec
  ];

  const enMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  if (language === "kh") {
    // Khmer standard date format: day month year (e.g. 11 ឧសភា ២០២៦ or 11 ឧសភា)
    return showYear ? `${day} ${khMonths[monthIndex]} ${year}` : `${day} ${khMonths[monthIndex]}`;
  } else {
    // English standard date format: May 11, 2026 or May 11
    return showYear ? `${enMonths[monthIndex]} ${day}, ${year}` : `${enMonths[monthIndex]} ${day}`;
  }
}
