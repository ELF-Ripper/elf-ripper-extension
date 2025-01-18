/**
 * Converts a decimal value to an 8-digit zero-padded hexadecimal string.
 * @param value - The decimal value to convert.
 * @returns A string representing the hexadecimal value, prefixed with "0x" and zero-padded to 8 digits.
 */
export const decimalToHex = (value: number) =>
  `0x${value.toString(16).padStart(8, "0").toUpperCase()}`;

/**
 * Formats a given number of bytes into a human-readable string.
 *
 * @param bytes - The number of bytes to format.
 * @returns A string representing the formatted bytes.
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  if (bytes === 1) {
    return "1 Byte";
  }

  const isNegative = bytes < 0;
  const absBytes = Math.abs(bytes);
  const multiplier = 1024;
  const sizeUnits = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(absBytes) / Math.log(multiplier));

  let formattedValue: string;
  if (index === 0) {
    formattedValue = `${absBytes} Bytes`;
  } else {
    formattedValue = (absBytes / Math.pow(multiplier, index)).toFixed(2) + " " + sizeUnits[index];
  }

  return isNegative ? "-" + formattedValue : formattedValue;
};
