'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CopyButton } from '@/components/tools/CopyButton';

const PRESETS = [
  { label: 'Avatar', width: 150, height: 150 },
  { label: 'Thumbnail', width: 300, height: 200 },
  { label: 'Banner', width: 1200, height: 400 },
  { label: 'OG Image', width: 1200, height: 630 },
];

export default function PlaceholderImageGenerator() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState('#374151');
  const [textColor, setTextColor] = useState('#9CA3AF');
  const [text, setText] = useState('');
  const [dataUri, setDataUri] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw centered text
    const displayText = text || `${width} \u00D7 ${height}`;
    const fontSize = Math.max(12, Math.min(width / 10, 48));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, width / 2, height / 2);

    // Generate data URI
    const uri = canvas.toDataURL('image/png');
    setDataUri(uri);
  }, [width, height, bgColor, textColor, text]);

  useEffect(() => {
    generateImage();
  }, [generateImage]);

  function handleDownload() {
    if (!dataUri) return;
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `placeholder-${width}x${height}.png`;
    link.click();
  }

  function applyPreset(preset: { width: number; height: number }) {
    setWidth(preset.width);
    setHeight(preset.height);
  }

  function handleSample() {
    setWidth(800);
    setHeight(400);
    setBgColor('#1E40AF');
    setTextColor('#BFDBFE');
    setText('Hero Banner');
  }

  function handleClear() {
    setWidth(400);
    setHeight(300);
    setBgColor('#374151');
    setTextColor('#9CA3AF');
    setText('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSample} variant="outline" size="sm">
          Sample Data
        </Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bgColor">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-9 w-9 rounded border border-border cursor-pointer"
                    />
                    <Input
                      id="bgColor"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-9 w-9 rounded border border-border cursor-pointer"
                    />
                    <Input
                      id="textColor"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customText">Custom Text</Label>
                <Input
                  id="customText"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Leave empty for WxH"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Presets</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label} ({preset.width}&times;{preset.height})
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4">
              <label className="text-sm font-medium text-muted-foreground">Preview</label>
              {dataUri && (
                <div className="flex justify-center">
                  <img
                    src={dataUri}
                    alt={`Placeholder ${width}x${height}`}
                    className="max-w-full border border-border rounded"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDownload} variant="secondary" size="sm">
              Download PNG
            </Button>
            <CopyButton text={dataUri} label="Copy Data URI" size="sm" variant="outline" />
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
