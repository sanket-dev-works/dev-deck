export type JsonResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function parseJson(input: string): JsonResult<unknown> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: '' };
  }
  try {
    return { ok: true, value: JSON.parse(trimmed) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Invalid JSON',
    };
  }
}

export function formatJson(input: string, indent: number): JsonResult<string> {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return parsed.error === '' ? { ok: true, value: '' } : parsed;
  }
  try {
    return { ok: true, value: JSON.stringify(parsed.value, null, indent) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Could not format JSON',
    };
  }
}

export function minifyJson(input: string): JsonResult<string> {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return parsed.error === '' ? { ok: true, value: '' } : parsed;
  }
  try {
    return { ok: true, value: JSON.stringify(parsed.value) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Could not minify JSON',
    };
  }
}
