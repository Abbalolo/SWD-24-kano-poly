/**
 * Registration number format used by our school:
 *   <LEVEL>/<DEPT>/<YY>/<NUMBER>
 * e.g. HND/SWD/24/0032
 *
 * Rules:
 *  - LEVEL: 2-4 uppercase letters (HND, ND, BSC, …)
 *  - DEPT:  2-5 uppercase letters or digits
 *  - YY:    two digits
 *  - NUM:   one or more digits
 * Slashes are required. Spaces are trimmed. Case is normalized to upper.
 */
export const REG_NUMBER_REGEX = /^[A-Z]{2,4}\/[A-Z0-9]{2,5}\/\d{2}\/\d{1,6}$/;

export function normalizeRegNumber(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

export function isValidRegNumber(input: string): boolean {
  return REG_NUMBER_REGEX.test(normalizeRegNumber(input));
}

export function formatRegNumberExample(): string {
  return "HND/SWD/24/0032";
}