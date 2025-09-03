import * as z from "zod";

export const formSchema = z.object({
  itemName: z.string().min(1, "Merci d'entrer le nom de l'article."),
  category: z.string().min(1, "Merci de sélectionner une catégorie."),
  amountCents: z.string().min(1, "Merci d'entrer le montant."),
  purchaseDate: z.date({
    message: "Merci de sélectionner la date d'achat.",
  }),
  warrantyDuration: z.string({
    message: "Merci de sélectionner la durée de la garantie.",
  }),
  file: z.any(), // For image file upload
});

export type FormData = z.infer<typeof formSchema>;

export interface Category {
  value: string;
  label: string;
}

export interface WarrantyDuration {
  duration: number;
  label: string;
}

export interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export interface StepProps {
  form: any; // React Hook Form instance
  onNext?: () => void;
  onPrev?: () => void;
}
