import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatClinicName(name) {
  if (!name) return ''
  if (name.includes('Patadiya')) {
    return "Pratham's Clinic"
  }
  return name
}
