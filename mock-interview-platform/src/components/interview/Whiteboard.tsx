'use client';

import { useState, useRef, useEffect } from 'react';
import { PenTool, RotateCcw, Download, Upload, Save } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface DrawingStroke {
  points: Point[];
  color: string;
  width: number;
}

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedWidth, setSelectedWidth] = useState(2);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'
  ];

  const widths = [1, 2, 4, 8];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all strokes
    strokes.forEach(stroke => {
      drawStroke(ctx, stroke);
    });
  }, [strokes]);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: DrawingStroke) => {
    if (stroke.points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    const newStroke: DrawingStroke = {
      points: [pos],
      color: tool === 'eraser' ? '#ffffff' : selectedColor,
      width: tool === 'eraser' ? 20 : selectedWidth
    };
    setCurrentStroke(newStroke);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;

    const pos = getMousePos(e);
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, pos]
    };
    setCurrentStroke(updatedStroke);

    // Draw the line segment
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && currentStroke.points.length > 0) {
      const lastPoint = currentStroke.points[currentStroke.points.length - 1];
      ctx.beginPath();
      ctx.strokeStyle = updatedStroke.color;
      ctx.lineWidth = updatedStroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (currentStroke) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke(null);
    }
  };

  const handleClear = () => {
    setStrokes([]);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    localStorage.setItem('whiteboard-data', dataURL);
    alert('Whiteboard saved!');
  };

  const handleLoad = () => {
    const savedData = localStorage.getItem('whiteboard-data');
    if (savedData) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = savedData;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Tool Selection */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTool('pen')}
                className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}
              >
                <PenTool className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}
              >
                Eraser
              </button>
            </div>

            {/* Color Palette */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Color:</span>
              <div className="flex space-x-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded border-2 ${
                      selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Line Width */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Width:</span>
              <div className="flex space-x-1">
                {widths.map((width) => (
                  <button
                    key={width}
                    onClick={() => setSelectedWidth(width)}
                    className={`px-2 py-1 rounded text-xs ${
                      selectedWidth === width ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {width}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="p-2 text-gray-600 hover:text-gray-800"
              title="Save whiteboard"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleLoad}
              className="p-2 text-gray-600 hover:text-gray-800"
              title="Load whiteboard"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800"
              title="Download whiteboard"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-gray-600 hover:text-gray-800"
              title="Clear whiteboard"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Quick Shapes */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Quick Shapes:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Add a rectangle to the canvas
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (ctx) {
                  ctx.strokeStyle = selectedColor;
                  ctx.lineWidth = selectedWidth;
                  ctx.strokeRect(50, 50, 100, 60);
                }
              }}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Rectangle
            </button>
            <button
              onClick={() => {
                // Add a circle to the canvas
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (ctx) {
                  ctx.strokeStyle = selectedColor;
                  ctx.lineWidth = selectedWidth;
                  ctx.beginPath();
                  ctx.arc(100, 100, 30, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              }}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Circle
            </button>
            <button
              onClick={() => {
                // Add text to the canvas
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = selectedColor;
                  ctx.font = '16px Arial';
                  ctx.fillText('Text Label', 50, 50);
                }
              }}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}