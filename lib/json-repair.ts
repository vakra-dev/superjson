import { jsonrepair } from "jsonrepair";

export interface RepairResult {
  original: string;
  repaired: string;
  parsed: unknown | null;
  error: string | null;
  wasRepaired: boolean;
}

/**
 * Attempt to repair and parse JSON using jsonrepair library
 */
export function repairJson(input: string): RepairResult {
  // First try native parse
  try {
    const parsed = JSON.parse(input);
    return {
      original: input,
      repaired: input,
      parsed,
      error: null,
      wasRepaired: false,
    };
  } catch {
    // Native parse failed, try repair
  }

  // Attempt repair
  try {
    const repaired = jsonrepair(input);
    const parsed = JSON.parse(repaired);
    return {
      original: input,
      repaired,
      parsed,
      error: null,
      wasRepaired: true,
    };
  } catch (e) {
    return {
      original: input,
      repaired: input,
      parsed: null,
      error: e instanceof Error ? e.message : "Invalid JSON",
      wasRepaired: false,
    };
  }
}

/**
 * Check if input can be repaired
 */
export function canRepair(input: string): boolean {
  try {
    JSON.parse(input);
    return false; // Already valid
  } catch {
    try {
      jsonrepair(input);
      return true; // Can be repaired
    } catch {
      return false; // Cannot be repaired
    }
  }
}
