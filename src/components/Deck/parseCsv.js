import { parse } from "papaparse";

import { sanitizeAll } from "../../common/util";

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
 * @param {number} columnCount - The expected number of columns
 * @returns {Array<string>} Array of parsed columns
 */
const parseColumns = (line, columnCount) => {
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
      const columns = parseColumns(line, columnCount);

      // Return if we have enough columns
      if (columns.length >= columnCount) {
        return columns.slice(0, columnCount);
      }

      return null;
    })
    .filter((row) => row !== null);
};

// @deprecated
const parseRawCsv = (rawCsv, expectedColCount) => {
  if (expectedColCount < 1) {
    return [];
  }

  const parsedData = parse(rawCsv, { delimiter: "," });
  const errorRowNums = parsedData.errors.map((error) => error.row);

  const colData = [];
  parsedData.data.map((row, index) => {
    const sanitizedRow = [];
    row.map((row) => {
      const str = sanitizeAll(row.trim());
      if (str !== null && str.length > 0) {
        sanitizedRow.push(str);
      }
    });

    if (sanitizedRow.length > 0 && sanitizedRow[0] !== null) {
      const rowHasError = errorRowNums.includes(index);
      if (!rowHasError && sanitizedRow.length >= expectedColCount) {
        colData.push(sanitizedRow.slice(0, expectedColCount));
      } else {
        colData.push(["Could not parse csv", sanitizedRow[0].slice(0, 50)]);
      }
    }
  });

  return colData;
};

// @deprecated
const parseCsv = (csvLineArray, expectedColCount) => {
  if (expectedColCount < 1) {
    return [];
  }
  const parsedData = csvLineArray.map((line) => {
    // check if line uses quotation marks
    if (line.indexOf('"') > -1) {
      // replace triple or slash escaped quotes
      let parsed = line.replaceAll('"""', '""');
      parsed = parsed.replaceAll('\\"', '"');

      // attempt to split on quoted values, remove cols over expected count
      parsed = parsed.split('","').slice(0, expectedColCount);

      // return value based on if we got the expected column count
      if (parsed.length === expectedColCount) {
        // already removed quotes around commas, now remove the first and last quote
        parsed[0] = parsed[0].replace(/^"/, "");
        parsed[parsed.length - 1] = parsed[parsed.length - 1].replace(/"$/, "");
        return parsed;
      } else {
        // did not get expected num of columns
        let returnVal = new Array(expectedColCount);
        returnVal[0] = "could not parse csv line";

        if (expectedColCount > 1) {
          returnVal[1] = parsed.join(",");
        }

        return returnVal;
      }
    }

    // split on plain commas
    return line.split(",").slice(0, expectedColCount);
  });

  return parsedData;
};
