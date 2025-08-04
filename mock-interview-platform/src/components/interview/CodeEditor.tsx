'use client';

import { useState, useRef } from 'react';
import { InterviewQuestion } from '@/types';
import { Play, Download, Upload, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  question: InterviewQuestion | null;
  onSubmit: (response: string, code: string) => void;
  loading: boolean;
}

export default function CodeEditor({ question, onSubmit, loading }: CodeEditorProps) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Set initial code if template is provided
    if (question?.codeTemplate) {
      setCode(question.codeTemplate);
    } else {
      // Default template based on language
      const defaultTemplate = getDefaultTemplate(language);
      setCode(defaultTemplate);
    }
  };

  const getDefaultTemplate = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return `// Write your solution here
function solution(input) {
    // Your code here
    return input;
}

// Test cases
console.log(solution("test"));`;
      case 'python':
        return `# Write your solution here
def solution(input):
    # Your code here
    return input

# Test cases
print(solution("test"))`;
      case 'java':
        return `public class Solution {
    public static String solution(String input) {
        // Your code here
        return input;
    }
    
    public static void main(String[] args) {
        // Test cases
        System.out.println(solution("test"));
    }
}`;
      default:
        return `// Write your solution here`;
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(getDefaultTemplate(newLanguage));
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      // Simple code execution (for demo purposes)
      // In production, this would be done on the server for security
      if (language === 'javascript') {
        // Create a safe execution environment
        const safeEval = new Function('console', code + '\nreturn console.output;');
        const mockConsole = {
          output: '',
          log: (...args: any[]) => {
            mockConsole.output += args.join(' ') + '\n';
          }
        };
        
        const result = safeEval(mockConsole);
        setOutput(mockConsole.output || 'Code executed successfully');
      } else {
        setOutput('Code execution is currently only supported for JavaScript in the demo.');
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (!code.trim()) return;
    
    const response = `I solved this coding problem using ${language}. Here's my solution:\n\n${code}`;
    onSubmit(response, code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (lang: string) => {
    switch (lang) {
      case 'javascript': return 'js';
      case 'python': return 'py';
      case 'java': return 'java';
      default: return 'txt';
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-2xl">💻</span>
          </div>
          <p className="text-lg font-medium">No coding question</p>
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
          Coding Question
        </h3>
        <p className="text-gray-700 mb-4">{question.question}</p>
        {question.context && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-blue-900 mb-1">Context:</h4>
            <p className="text-blue-800 text-sm">{question.context}</p>
          </div>
        )}
        
        {/* Language Selector */}
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-gray-700">Language:</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Code Editor</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning || !code.trim()}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
              theme="vs-dark"
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-1/3 border-l border-gray-200 flex flex-col">
          <div className="p-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Output</span>
          </div>
          <div className="flex-1 p-4">
            <pre className="text-sm text-gray-800 bg-gray-100 p-3 rounded h-full overflow-auto">
              {output || 'Run your code to see the output here...'}
            </pre>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !code.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </div>
          ) : (
            'Submit Solution'
          )}
        </button>
      </div>
    </div>
  );
}