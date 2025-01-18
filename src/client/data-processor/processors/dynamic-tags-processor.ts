import { DynamicTags_ } from "../../../binary-parser/types/elf/elf-parsers-returns";
import { getDynTagType } from "../../../binary-parser/utils/dictionary/mapping-functions";
import { toHex } from "../helper-functions";
import { DynamicTags_Table } from "../types";

/**
 * Processes ELF dynamic tags to create objects for frontend table components.
 * Converts raw dynamic tag data into human-readable formats using dictionary functions.
 *
 * @param data - The raw dynamic tag data parsed from the binary-parser component.
 * @returns An array of processed dynamic tags with human-readable values or a message indicating no tags are present.
 */
export function processRawData(data: DynamicTags_): DynamicTags_Table {
  if (data.length === 0) {
    return "No dynamic tags present";
  }

  return data.map((dynTag, index) => ({
    tag: toHex(dynTag.d_tag),
    type: getDynTagType(dynTag.d_tag),
    nameValue: toHex(dynTag.d_un),
  }));
}
