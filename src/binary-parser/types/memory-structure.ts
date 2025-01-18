/**
 * Represents the structure for the Memory allocation on LinkerScript file.
 */
export interface Memory {
  Name: string;
  Origin: number;
  Length: number;
  Attributes?: string;
  Fill?: number;
}
