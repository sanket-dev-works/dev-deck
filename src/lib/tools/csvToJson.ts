import Papa from 'papaparse';

export interface CsvParseSuccess {
  ok: true;
  json: string;
  rowCount: number;
  colCount: number;
}

export interface CsvParseFailure {
  ok: false;
  error: string;
}

export type CsvParseResult = CsvParseSuccess | CsvParseFailure;

export function csvToJson(
  input: string,
  options: { header: boolean }
): CsvParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: 'Please enter CSV data to convert.' };
  }

  try {
    const result = Papa.parse(trimmed, {
      header: options.header,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (result.errors.length > 0) {
      const errorMessages = result.errors
        .slice(0, 3)
        .map((e) => `Row ${e.row ?? '?'}: ${e.message}`)
        .join('; ');
      return { ok: false, error: `CSV parsing errors: ${errorMessages}` };
    }

    if (!result.data || result.data.length === 0) {
      return { ok: false, error: 'No data found in the CSV input.' };
    }

    const json = JSON.stringify(result.data, null, 2);
    const rowCount = result.data.length;

    let colCount = 0;
    if (options.header && result.meta.fields) {
      colCount = result.meta.fields.length;
    } else if (Array.isArray(result.data[0])) {
      colCount = (result.data[0] as unknown[]).length;
    }

    return { ok: true, json, rowCount, colCount };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Failed to parse CSV data.',
    };
  }
}
