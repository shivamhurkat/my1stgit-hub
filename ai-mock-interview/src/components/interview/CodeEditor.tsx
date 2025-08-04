'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { useInterviewStore } from '@/stores/interview-store';
import { Play, Settings, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'typescript', label: 'TypeScript' },
];

const DEFAULT_CODE_TEMPLATES = {
  javascript: `// Write your solution here
function solution() {
    // TODO: Implement your solution
    return null;
}

// Test your solution
console.log(solution());`,
  python: `# Write your solution here
def solution():
    # TODO: Implement your solution
    pass

# Test your solution
print(solution())`,
  java: `public class Solution {
    // Write your solution here
    public static void main(String[] args) {
        // TODO: Implement your solution
        System.out.println("Hello World");
    }
}`,
  cpp: `#include <iostream>
using namespace std;

// Write your solution here
int main() {
    // TODO: Implement your solution
    cout << "Hello World" << endl;
    return 0;
}`,
  csharp: `using System;

public class Solution {
    // Write your solution here
    public static void Main(string[] args) {
        // TODO: Implement your solution
        Console.WriteLine("Hello World");
    }
}`,
  go: `package main

import "fmt"

// Write your solution here
func main() {
    // TODO: Implement your solution
    fmt.Println("Hello World")
}`,
  rust: `// Write your solution here
fn main() {
    // TODO: Implement your solution
    println!("Hello World");
}`,
  typescript: `// Write your solution here
function solution(): any {
    // TODO: Implement your solution
    return null;
}

// Test your solution
console.log(solution());`,
};

export default function CodeEditor() {
  const { uiState, setCodeLanguage } = useInterviewStore();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Set initial code template
    setCode(DEFAULT_CODE_TEMPLATES[uiState.codeLanguage as keyof typeof DEFAULT_CODE_TEMPLATES] || DEFAULT_CODE_TEMPLATES.javascript);
  }, [uiState.codeLanguage]);

  const handleLanguageChange = (language: string) => {
    setCodeLanguage(language);
    setCode(DEFAULT_CODE_TEMPLATES[language as keyof typeof DEFAULT_CODE_TEMPLATES] || DEFAULT_CODE_TEMPLATES.javascript);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // TODO: Implement code execution API
      // For now, simulate code execution
      setOutput('Code execution simulated. Output would appear here.');
      toast.success('Code executed successfully');
    } catch (error) {
      setOutput('Error: Code execution failed');
      toast.error('Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE_TEMPLATES[uiState.codeLanguage as keyof typeof DEFAULT_CODE_TEMPLATES] || DEFAULT_CODE_TEMPLATES.javascript);
    setOutput('');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <select
                value={uiState.codeLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {LANGUAGE_OPTIONS.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <Play className="h-4 w-4" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Editor
            height="100%"
            language={uiState.codeLanguage}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="h-32 border-t border-gray-200 bg-gray-50">
          <div className="p-2 border-b border-gray-200 bg-gray-100">
            <span className="text-sm font-medium text-gray-700">Output</span>
          </div>
          <div className="p-3 h-24 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {output || 'Run your code to see output here...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}