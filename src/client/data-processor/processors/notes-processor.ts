import { Notes_ } from "../../../binary-parser/types/elf/elf-parsers-returns";
import { Notes_Table } from "../types";
import { toHex } from "../helper-functions";

/**
 * Processes ELF notes to create objects for frontend table components.
 * Converts raw note data into human-readable formats.
 *
 * @param data - The raw note data parsed from the binary-parser component.
 * @returns An array of processed notes with human-readable values or a message indicating no notes are present.
 */
export function processRawData(data: Notes_): Notes_Table {
  if (data.length === 0) {
    return "No notes present";
  }

  return data.map((note, index) => ({
    section: note.Section,
    owner: note.Name,
    dataSize: toHex(note.Table.n_descsz),
    description: note.Description,
  }));
}
