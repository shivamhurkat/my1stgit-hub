'use client';

import { useState, useEffect } from 'react';
import { Play, Download, Copy, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (code: string) => void;
  onRun: (code: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ 
  language, 
  code, 
  onChange, 
  onRun, 
  readOnly = false 
}: CodeEditorProps) {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  // Mock code execution - in real app, this would use a proper code execution service
  const executeCode = async (codeToRun: string) => {
    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      // Simulate code execution delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock execution results based on language
      let result = '';
      if (language === 'javascript') {
        try {
          // Basic JavaScript evaluation (for demo purposes only)
          if (codeToRun.includes('console.log')) {
            result = 'Code executed successfully!\nOutput: Hello World\n';
          } else if (codeToRun.includes('function')) {
            result = 'Function defined successfully!\n';
          } else {
            result = 'Code executed successfully!\n';
          }
        } catch (error) {
          result = `Error: ${error}\n`;
        }
      } else if (language === 'python') {
        result = 'Python code executed successfully!\nOutput: Hello from Python\n';
      } else {
        result = `${language} code executed successfully!\n`;
      }

      setOutput(result);
    } catch (error) {
      setOutput(`Execution error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRun = () => {
    executeCode(code);
    onRun(code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    onChange('');
    setOutput('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {language.toUpperCase()} Editor
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRun}
                disabled={isRunning || !code.trim()}
                className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                  isRunning || !code.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Copy code"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Download code"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Reset editor"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="w-1/2 border-r border-gray-200">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter your ${language} code here...`}
            className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none"
            readOnly={readOnly}
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              lineHeight: '1.5',
              tabSize: 2,
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="w-1/2 bg-gray-900 text-green-400">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-medium">Output</h3>
          </div>
          <div className="p-4 h-full overflow-y-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {output || 'No output yet. Run your code to see results.'}
            </pre>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Quick Templates:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => onChange('console.log("Hello, World!");')}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Hello World
            </button>
            <button
              onClick={() => onChange(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Fibonacci
            </button>
            <button
              onClick={() => onChange(`function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));`)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Bubble Sort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}