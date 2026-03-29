'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/tools/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AlertTriangle } from 'lucide-react';
import { decodeJwt, jwtExpiryStatus, jwtIssuedAtIso } from '@/lib/tools/jwt';
import { getToolBySlug } from '@/config/tools';

const SAMPLE_JWT =
  getToolBySlug('jwt-decoder')?.sampleInput ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<ReturnType<typeof decodeJwt> | null>(null);
  const [error, setError] = useState('');

  function handleDecode(value: string) {
    setInput(value);
    setError('');
    setDecoded(null);

    if (!value.trim()) return;

    try {
      setDecoded(decodeJwt(value));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to decode JWT.');
    }
  }

  function handleLoadSample() {
    handleDecode(SAMPLE_JWT);
  }

  const expStatus = jwtExpiryStatus(decoded?.parsedPayload ?? null);
  const issuedAt = jwtIssuedAtIso(decoded?.parsedPayload ?? null);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Signature is not verified. Decoding does not mean the token is trusted.</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">JWT token</span>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load sample
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => handleDecode(e.target.value)}
          placeholder="Paste your JWT token here…"
          className="min-h-24 font-mono text-xs"
        />
      </div>

      {error && <ErrorMessage message={error} />}

      {decoded && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Header</CardTitle>
              <CopyButton text={decoded.header} size="sm" variant="ghost" />
            </CardHeader>
            <CardContent>
              <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground">
                {decoded.header}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Payload</CardTitle>
              <CopyButton text={decoded.payload} size="sm" variant="ghost" />
            </CardHeader>
            <CardContent className="space-y-3">
              {decoded.parsedPayload?.exp != null && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">exp: </span>
                  {expStatus === 'expired' && (
                    <span className="text-red-400">Token expired</span>
                  )}
                  {expStatus === 'valid' && (
                    <span className="text-green-400">Not expired (by exp claim)</span>
                  )}
                </p>
              )}
              {issuedAt && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">iat: </span>
                  {issuedAt}
                </p>
              )}
              <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground">
                {decoded.payload}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      {decoded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Signature (opaque)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="break-all font-mono text-xs text-muted-foreground">{decoded.signature}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
