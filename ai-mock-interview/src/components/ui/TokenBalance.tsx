'use client';

import { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function TokenBalance() {
  const { user } = useUser();
  const [tokens, setTokens] = useState(10); // Default tokens, will be fetched from database
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual token balance from database
    // For now, using default value
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
        <Coins className="h-4 w-4 text-yellow-500 animate-pulse" />
        <span className="text-sm font-medium text-yellow-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
      <Coins className="h-4 w-4 text-yellow-500" />
      <span className="text-sm font-medium text-yellow-700">
        {tokens} tokens
      </span>
    </div>
  );
}