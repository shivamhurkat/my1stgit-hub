import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import InterviewInterface from '@/components/interview/InterviewInterface';

export default async function InterviewPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/');
  }

  return <InterviewInterface />;
}