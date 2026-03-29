'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AlertTriangle } from 'lucide-react';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

interface DecodedJwt {
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

function decodeJwt(token: string): DecodedJwt {
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

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState('');

  function handleDecode(value: string) {
    setInput(value);
    setError('');
    setDecoded(null);

    if (!value.trim()) return;

    try {
      const result = decodeJwt(value);
      setDecoded(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to decode JWT.');
    }
  }

  function handleLoadSample() {
    handleDecode(SAMPLE_JWT);
  }

  const expStatus = (() => {
    if (!decoded?.parsedPayload?.exp) return null;
    const exp = decoded.parsedPayload.exp as number;
    const now = Date.now() / 1000;
    return exp < now ? 'expired' : 'valid';
  })();

  const issuedAt = (() => {
    if (!decoded?.parsedPayload?.iat) return null;
    const iat = decoded.parsedPayload.iat as number;
    return new Date(iat * 1000).toISOString();
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          Signature is not verified. Decoding does not mean the token is trusted.
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">JWT Token</label>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load Sample
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => handleDecode(e.target.value)}
          placeholder="Paste your JWT token here..."
          className="min-h-24 font-mono text-xs"
        />
      </div>

      {error && <ErrorMessage message={error} />}

      {decoded && (
        <div className="space-y-4">
          {expStatus && (
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  expStatus === 'expired'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {expStatus === 'expired' ? 'Expired' : 'Valid'}
              </span>
              {issuedAt && (
                <span className="text-xs text-muted-foreground">
                  Issued at: {issuedAt}
                </span>
              )}
            </div>
          )}

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Header</CardTitle>
              <CopyButton text={decoded.header} />
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded-md bg-muted p-3 text-xs font-mono text-foreground">
                {decoded.header}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Payload</CardTitle>
              <CopyButton text={decoded.payload} />
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded-md bg-muted p-3 text-xs font-mono text-foreground">
                {decoded.payload}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Signature</CardTitle>
              <CopyButton text={decoded.signature} />
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded-md bg-muted p-3 text-xs font-mono text-foreground break-all">
                {decoded.signature}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
