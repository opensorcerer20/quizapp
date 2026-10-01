// parseStringToColumns generated via Cursor prompting

/**
 * Counts unescaped quotes in a line, accounting for both backslash and double-quote escaping
 * @param {string} line - The line to count quotes in
 * @returns {number} Count of unescaped quotes
 */
const countUnescapedQuotes = (line) => {
  let count = 0;
  let i = 0;
  while (i < line.length) {
    if (line[i] === "\\" && i + 1 < line.length && line[i + 1] === '"') {
      i += 2; // Skip backslash-escaped quotes
    } else if (line[i] === '"') {
      if (i + 1 < line.length && line[i + 1] === '"') {
        i += 2; // Skip double-quote escaped quotes
      } else {
        count++;
        i++;
      }
    } else {
      i++;
    }
  }
  return count;
};

/**
 * Parses a line into columns, handling quoted values and escaped quotes
 * @param {string} line - The line to parse
 * @returns {Array<string>} Array of parsed columns
 */
const parseColumns = (line) => {
  const columns = [];
  let currentColumn = "";
  let insideQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === "\\" && i + 1 < line.length && line[i + 1] === '"') {
      currentColumn += '"';
      i += 2;
    } else if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        currentColumn += '"';
        i += 2;
      } else {
        insideQuotes = !insideQuotes;
        i++;
      }
    } else if (char === "," && !insideQuotes) {
      columns.push(currentColumn.trim());
      currentColumn = "";
      i++;
    } else {
      currentColumn += char;
      i++;
    }
  }

  columns.push(currentColumn.trim());
  return columns;
};

/**
 * Parses a string into an array of arrays with the specified column count
 * @param {string} inputString - The input string to parse
 * @param {number} columnCount - The number of columns each row should have
 * @returns {Array<Array>} Array of arrays, each with columnCount elements
 */
export const parseStringToColumns = (inputString, columnCount) => {
  if (!inputString || typeof inputString !== "string") return [];
  if (!columnCount || columnCount < 1 || !Number.isInteger(columnCount)) return [];

  const lines = inputString.split(/\r?\n/).filter((line) => line.trim().length > 0);

  return lines
    .map((line) => {
      // Check for balanced quotes
      if (countUnescapedQuotes(line) % 2 !== 0) {
        return ["Could not parse csv", line.substring(0, 50)];
      }

      // Parse columns
      const columns = parseColumns(line);

      // Return if we have enough columns
      if (columns.length >= columnCount) {
        return columns.slice(0, columnCount);
      }

      return null;
    })
    .filter((row) => row !== null);
};
