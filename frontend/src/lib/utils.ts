import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateString;
  }
}

export function getAuthorityTierBadge(tier: string) {
  switch (tier.toUpperCase()) {
    case 'A':
      return { label: 'Tier A: Peer-Reviewed Science', color: 'bg-forest-700/10 text-forest-700 dark:text-forest-300 border-forest-700/30' };
    case 'B':
      return { label: 'Tier B: Intergovernmental / FAO', color: 'bg-sand-300/20 text-sand-800 dark:text-sand-300 border-sand-400/40' };
    case 'C':
      return { label: 'Tier C: University / Research Hub', color: 'bg-burgundy-700/8 text-burgundy-700 dark:text-burgundy-300 border-burgundy-700/20' };
    case 'D':
      return { label: 'Tier D: Vendor / Commercial', color: 'bg-burgundy-700/10 text-burgundy-700 dark:text-burgundy-400 border-burgundy-700/30' };
    case 'E':
      return { label: 'Tier E: Extension / Field Press', color: 'bg-sand-400/15 text-sand-700 dark:text-sand-400 border-sand-500/30' };
    default:
      return { label: 'Tier F: General Web', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30' };
  }
}

export function getVerificationStatusBadge(status: string) {
  switch (status) {
    case 'Verified':
      return { label: 'Verified Evidence', color: 'bg-forest-700/10 text-forest-700 dark:text-forest-300 border-forest-700/30' };
    case 'Needs Review':
      return { label: 'Needs Review', color: 'bg-sand-400/20 text-sand-700 dark:text-sand-300 border-sand-400/40' };
    case 'Conflicting Evidence':
      return { label: 'Conflicting Evidence', color: 'bg-burgundy-700/10 text-burgundy-700 dark:text-burgundy-300 border-burgundy-700/30' };
    case 'Outdated':
      return { label: 'Outdated / Superseded', color: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/40' };
    case 'Insufficient Evidence':
      return { label: 'Insufficient Evidence', color: 'bg-burgundy-700/15 text-burgundy-700 dark:text-burgundy-300 border-burgundy-700/35' };
    default:
      return { label: status, color: 'bg-slate-500/10 text-slate-600 border-slate-300' };
  }
}
