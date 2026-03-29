export type Base64Result = { ok: true; value: string } | { ok: false; error: string };

export function base64Encode(input: string): Base64Result {
  try {
    return { ok: true, value: btoa(unescape(encodeURIComponent(input))) };
  } catch {
    return { ok: false, error: 'Failed to encode the input string.' };
  }
}

export function base64Decode(input: string): Base64Result {
  try {
    return { ok: true, value: decodeURIComponent(escape(atob(input))) };
  } catch {
    return {
      ok: false,
      error: 'Invalid Base64 string. Please check your input.',
    };
  }
}
