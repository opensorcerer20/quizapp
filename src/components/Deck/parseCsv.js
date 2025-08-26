import { parse } from "papaparse";

import { sanitizeAll } from "../../common/util";

export const parseRawCsv = (rawCsv, expectedColCount) => {
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

export const parseCsv = (csvLineArray, expectedColCount) => {
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
