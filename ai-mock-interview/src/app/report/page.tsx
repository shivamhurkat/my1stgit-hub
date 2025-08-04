import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import InterviewReport from '@/components/interview/InterviewReport';

export default async function ReportPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/');
  }

  return <InterviewReport />;
}