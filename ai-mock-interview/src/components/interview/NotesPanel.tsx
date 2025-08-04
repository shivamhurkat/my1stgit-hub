'use client';

import { useState } from 'react';
import { Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotesPanel() {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      // TODO: Save notes to database
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Notes</h3>
          </div>
          
          <button
            onClick={handleSaveNotes}
            disabled={isSaving}
            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Notes Content */}
      <div className="flex-1 p-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Take notes during your interview here...

Some suggestions:
• Key points from the conversation
• Ideas for your answers
• Questions to ask the interviewer
• Areas to improve on"
          className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>

      {/* Tips */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-2">💡 Tips for effective note-taking:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Write down key requirements for coding problems</li>
            <li>Note any clarifying questions you want to ask</li>
            <li>Track your thought process and approach</li>
            <li>Record feedback from the AI interviewer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}