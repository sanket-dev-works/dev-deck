'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/tools/CopyButton';
import { Label } from '@/components/ui/label';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === rn) {
    h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  } else if (max === gn) {
    h = ((bn - rn) / d + 2) / 6;
  } else {
    h = ((rn - gn) / d + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const hn = h / 360;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

const PRESET_COLORS = ['#EF4444', '#22C55E', '#3B82F6', '#A855F7', '#F59E0B', '#EC4899', '#6B7280', '#FFFFFF'];

export default function ColorConverter() {
  const [hex, setHex] = useState('');
  const [rgb, setRgb] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [hsl, setHsl] = useState<HSL>({ h: 0, s: 0, l: 0 });
  const [error, setError] = useState('');

  function updateFromHex(value: string) {
    setHex(value);
    const parsed = hexToRgb(value);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
      setError('');
    } else if (value.replace(/^#/, '').length === 6) {
      setError('Invalid hex color');
    }
  }

  function updateFromRgb(newRgb: RGB) {
    setRgb(newRgb);
    const { r, g, b } = newRgb;
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      setHex(rgbToHex(r, g, b));
      setHsl(rgbToHsl(r, g, b));
      setError('');
    }
  }

  function updateFromHsl(newHsl: HSL) {
    setHsl(newHsl);
    const { h, s, l } = newHsl;
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
      const newRgb = hslToRgb(h, s, l);
      setRgb(newRgb);
      setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      setError('');
    }
  }

  function handleSample() {
    updateFromHex('#3B82F6');
  }

  function handleClear() {
    setHex('');
    setRgb({ r: 0, g: 0, b: 0 });
    setHsl({ h: 0, s: 0, l: 0 });
    setError('');
  }

  function handlePreset(color: string) {
    updateFromHex(color);
  }

  const displayColor = hexToRgb(hex) ? hex : '#000000';
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleSample} variant="outline" size="sm">
          Sample Data
        </Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      <div
        className="h-24 w-full rounded-lg border border-border transition-colors"
        style={{ backgroundColor: hex ? displayColor : 'transparent' }}
      />

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Presets:</span>
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handlePreset(color)}
            className="h-6 w-6 rounded-full border border-border transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card size="sm">
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">HEX</span>
              <CopyButton text={hex} size="sm" variant="ghost" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hex-input" className="text-xs text-muted-foreground">Hex</Label>
              <Input
                id="hex-input"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                placeholder="#000000"
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">RGB</span>
              <CopyButton text={rgbString} size="sm" variant="ghost" />
            </div>
            <div className="flex gap-2">
              <div className="space-y-1 flex-1">
                <Label htmlFor="rgb-r" className="text-xs text-muted-foreground">R</Label>
                <Input
                  id="rgb-r"
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.r}
                  onChange={(e) => updateFromRgb({ ...rgb, r: Number(e.target.value) })}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label htmlFor="rgb-g" className="text-xs text-muted-foreground">G</Label>
                <Input
                  id="rgb-g"
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.g}
                  onChange={(e) => updateFromRgb({ ...rgb, g: Number(e.target.value) })}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label htmlFor="rgb-b" className="text-xs text-muted-foreground">B</Label>
                <Input
                  id="rgb-b"
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.b}
                  onChange={(e) => updateFromRgb({ ...rgb, b: Number(e.target.value) })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">HSL</span>
              <CopyButton text={hslString} size="sm" variant="ghost" />
            </div>
            <div className="flex gap-2">
              <div className="space-y-1 flex-1">
                <Label htmlFor="hsl-h" className="text-xs text-muted-foreground">H</Label>
                <Input
                  id="hsl-h"
                  type="number"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) => updateFromHsl({ ...hsl, h: Number(e.target.value) })}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label htmlFor="hsl-s" className="text-xs text-muted-foreground">S</Label>
                <Input
                  id="hsl-s"
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) => updateFromHsl({ ...hsl, s: Number(e.target.value) })}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label htmlFor="hsl-l" className="text-xs text-muted-foreground">L</Label>
                <Input
                  id="hsl-l"
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) => updateFromHsl({ ...hsl, l: Number(e.target.value) })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
