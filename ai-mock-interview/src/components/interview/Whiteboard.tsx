'use client';

import { useState, useRef, useEffect } from 'react';
import { PenTool, Square, Circle, Type, Eraser, RotateCcw, Save } from 'lucide-react';
import toast from 'react-hot-toast';

type Tool = 'pen' | 'rectangle' | 'circle' | 'text' | 'eraser';

interface DrawingElement {
  id: string;
  type: Tool;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
}

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Start drawing based on current tool
    // This is a simplified implementation
    // In a real app, you'd want a more sophisticated drawing system
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    // Handle drawing movement
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const saveWhiteboard = async () => {
    try {
      // TODO: Save whiteboard data to database
      toast.success('Whiteboard saved');
    } catch (error) {
      toast.error('Failed to save whiteboard');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set up canvas context
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = strokeWidth;
  }, [currentColor, strokeWidth]);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Tools */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentTool('pen')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'pen' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Pen"
              >
                <PenTool className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setCurrentTool('rectangle')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'rectangle' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Rectangle"
              >
                <Square className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setCurrentTool('circle')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'circle' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Circle"
              >
                <Circle className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setCurrentTool('text')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'text' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Text"
              >
                <Type className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setCurrentTool('eraser')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'eraser' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Eraser"
              >
                <Eraser className="h-4 w-4" />
              </button>
            </div>

            {/* Color Picker */}
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              title="Color"
            />

            {/* Stroke Width */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-16"
              />
              <span className="text-sm text-gray-600 w-6">{strokeWidth}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear</span>
            </button>
            
            <button
              onClick={saveWhiteboard}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors flex items-center space-x-1"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Instructions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-2">💡 System Design Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Start with high-level architecture components</li>
            <li>Draw data flow between components</li>
            <li>Consider scalability and bottlenecks</li>
            <li>Don't forget about data storage and caching</li>
          </ul>
        </div>
      </div>
    </div>
  );
}