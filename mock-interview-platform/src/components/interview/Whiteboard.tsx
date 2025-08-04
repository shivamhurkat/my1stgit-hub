'use client';

import { useState, useRef, useEffect } from 'react';
import { InterviewQuestion } from '@/types';
import { Save, Download, Upload, Loader2, PenTool, Eraser, Undo, Redo } from 'lucide-react';

interface WhiteboardProps {
  question: InterviewQuestion | null;
  onSubmit: (response: string) => void;
  loading: boolean;
  enabled: boolean;
}

interface DrawingPoint {
  x: number;
  y: number;
  pressure?: number;
}

interface DrawingStroke {
  points: DrawingPoint[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

export default function Whiteboard({ question, onSubmit, loading, enabled }: WhiteboardProps) {
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [notes, setNotes] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        contextRef.current = context;
      }
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current && contextRef.current) {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw all strokes
      strokes.forEach(stroke => {
        if (stroke.points.length > 0) {
          context.strokeStyle = stroke.color;
          context.lineWidth = stroke.width;
          context.beginPath();
          context.moveTo(stroke.points[0].x, stroke.points[0].y);
          
          for (let i = 1; i < stroke.points.length; i++) {
            context.lineTo(stroke.points[i].x, stroke.points[i].y);
          }
          
          context.stroke();
        }
      });
    }
  }, [strokes]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!enabled) return;
    
    const pos = getMousePos(e);
    const newStroke: DrawingStroke = {
      points: [pos],
      color: tool === 'pen' ? color : '#ffffff',
      width: tool === 'pen' ? brushSize : brushSize * 2,
      tool,
    };
    
    setCurrentStroke(newStroke);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke || !enabled) return;
    
    const pos = getMousePos(e);
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, pos],
    };
    
    setCurrentStroke(updatedStroke);
    
    // Draw the line segment
    if (contextRef.current && canvasRef.current) {
      const context = contextRef.current;
      context.strokeStyle = updatedStroke.color;
      context.lineWidth = updatedStroke.width;
      context.beginPath();
      context.moveTo(currentStroke.points[currentStroke.points.length - 1].x, currentStroke.points[currentStroke.points.length - 1].y);
      context.lineTo(pos.x, pos.y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (currentStroke) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke(null);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setStrokes([]);
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const undo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const redo = () => {
    // TODO: Implement redo functionality
  };

  const handleSubmit = () => {
    if (!notes.trim()) {
      alert('Please add some notes about your system design.');
      return;
    }
    
    const response = `I designed this system using a whiteboard. Here are my notes:\n\n${notes}`;
    onSubmit(response);
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'whiteboard-design.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  if (!enabled) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-2xl">🎨</span>
          </div>
          <p className="text-lg font-medium">Whiteboard Not Enabled</p>
          <p className="text-sm">Enable whiteboard in the sidebar to use this feature</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-2xl">📋</span>
          </div>
          <p className="text-lg font-medium">No system design question</p>
          <p className="text-sm">Waiting for the next question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Question Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          System Design Question
        </h3>
        <p className="text-gray-700 mb-4">{question.question}</p>
        {question.context && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-1">Context:</h4>
            <p className="text-blue-800 text-sm">{question.context}</p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <PenTool className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {tool === 'pen' && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
              <input
                type="range"
                min="1"
                max="10"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">{brushSize}px</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={strokes.length === 0}
              className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={true}
              className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            >
              <Redo className="w-4 h-4" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
            >
              Clear
            </button>
            <button
              onClick={downloadCanvas}
              className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas and Notes */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 border-r border-gray-200">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* Notes Panel */}
        <div className="w-1/3 flex flex-col">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <h4 className="font-medium text-gray-700">Design Notes</h4>
          </div>
          <div className="flex-1 p-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your system design notes here..."
              className="w-full h-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !notes.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </div>
          ) : (
            'Submit Design'
          )}
        </button>
      </div>
    </div>
  );
}