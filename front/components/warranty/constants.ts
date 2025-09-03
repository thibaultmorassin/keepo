import { Category, WarrantyDuration } from "./types";

export const CATEGORIES: Category[] = [
  { value: "electronics", label: "💻 Informatique" },
  { value: "appliances", label: "🔌 Électroménager" },
  { value: "small_appliances", label: "🔌 Petit électroménager" },
  { value: "furniture", label: "🪑 Meubles" },
  { value: "other", label: "Autre" },
];

export const WARRANTY_DURATIONS: WarrantyDuration[] = [
  { duration: 6, label: "6 mois" },
  { duration: 12, label: "1 an" },
  { duration: 24, label: "2 ans" },
  { duration: 36, label: "3 ans" },
];

export const TOTAL_STEPS = 3;
