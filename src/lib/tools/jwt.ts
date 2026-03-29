export interface DecodedJwtParts {
  header: string;
  payload: string;
  signature: string;
  parsedPayload: Record<string, unknown> | null;
}

function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export function decodeJwt(token: string): DecodedJwtParts {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error(
      `Invalid JWT: expected 3 parts separated by dots, but got ${parts.length}.`
    );
  }

  let header: string;
  try {
    header = JSON.stringify(JSON.parse(decodeBase64Url(parts[0])), null, 2);
  } catch {
    throw new Error('Invalid JWT: unable to decode header (malformed base64).');
  }

  let payload: string;
  let parsedPayload: Record<string, unknown> | null = null;
  try {
    parsedPayload = JSON.parse(decodeBase64Url(parts[1]));
    payload = JSON.stringify(parsedPayload, null, 2);
  } catch {
    throw new Error('Invalid JWT: unable to decode payload (malformed base64).');
  }

  return {
    header,
    payload,
    signature: parts[2],
    parsedPayload,
  };
}

export function jwtExpiryStatus(
  parsedPayload: Record<string, unknown> | null
): 'expired' | 'valid' | null {
  if (!parsedPayload?.exp || typeof parsedPayload.exp !== 'number') return null;
  const now = Date.now() / 1000;
  return parsedPayload.exp < now ? 'expired' : 'valid';
}

export function jwtIssuedAtIso(parsedPayload: Record<string, unknown> | null): string | null {
  if (!parsedPayload?.iat || typeof parsedPayload.iat !== 'number') return null;
  return new Date(parsedPayload.iat * 1000).toISOString();
}
