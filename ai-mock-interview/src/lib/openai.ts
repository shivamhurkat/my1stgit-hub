import OpenAI from 'openai';
import { InterviewRole, TargetCompany, InterviewType } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export { openai };

// System prompts for different interview types
export const SYSTEM_PROMPTS = {
  HR: `You are an experienced HR interviewer conducting a professional interview. Ask thoughtful questions about the candidate's background, motivations, cultural fit, and career goals. Be friendly but professional. Evaluate responses for communication skills, self-awareness, and alignment with company values.`,
  
  Coding: `You are a senior software engineer conducting a coding interview. Present coding problems appropriate to the role and company level. Guide the candidate through problem-solving, ask for clarification of approach, and provide hints when stuck. Evaluate code quality, problem-solving approach, and communication.`,
  
  'System Design': `You are a principal engineer conducting a system design interview. Present scalable system design problems. Ask about requirements gathering, system architecture, trade-offs, and scaling considerations. Evaluate system thinking, technical depth, and design decisions.`,
  
  Behavioral: `You are an experienced interviewer conducting behavioral questions using the STAR method. Ask about past experiences, challenges, leadership, and teamwork. Probe for specific examples and concrete results. Evaluate leadership potential, problem-solving, and interpersonal skills.`
} as const;

// Company-specific context
export const COMPANY_CONTEXT = {
  Google: "Focus on technical excellence, innovation, and 'Googleyness'. Emphasize scalability, user impact, and collaborative problem-solving.",
  Meta: "Emphasize moving fast, building connections, and focusing on impact. Look for innovative thinking and user-centric solutions.",
  Amazon: "Apply leadership principles like customer obsession, ownership, and diving deep. Focus on scalability and operational excellence.",
  Microsoft: "Emphasize collaboration, empowerment, and inclusive culture. Look for growth mindset and technical leadership.",
  Apple: "Focus on attention to detail, user experience, and innovative design. Emphasize quality and simplicity.",
  Netflix: "Look for high performance, context over control, and freedom with responsibility. Emphasize data-driven decisions.",
  Uber: "Focus on operational excellence, customer obsession, and fast-paced execution. Emphasize problem-solving in complex environments.",
  Flipkart: "Emphasize customer-first approach, frugality, and bias for action. Look for understanding of Indian market dynamics.",
  Zomato: "Focus on customer delight, food tech innovation, and operational efficiency. Emphasize local market understanding.",
  Swiggy: "Emphasize speed, reliability, and customer satisfaction. Look for understanding of logistics and local market challenges."
} as const;

// Role-specific context
export const ROLE_CONTEXT = {
  'SDE': "Software Development Engineer role focusing on coding, system design, and technical problem-solving.",
  'Product Manager': "Product management role focusing on strategy, user research, data analysis, and cross-functional collaboration.",
  'Data Scientist': "Data science role focusing on statistical analysis, machine learning, and data-driven insights.",
  'DevOps Engineer': "DevOps role focusing on infrastructure, automation, CI/CD, and system reliability.",
  'Frontend Developer': "Frontend development role focusing on user interfaces, user experience, and client-side technologies.",
  'Backend Developer': "Backend development role focusing on server-side logic, databases, and system architecture."
} as const;

export function generateSystemPrompt(
  interviewType: InterviewType,
  role: InterviewRole,
  company: TargetCompany
): string {
  const basePrompt = SYSTEM_PROMPTS[interviewType];
  const companyContext = COMPANY_CONTEXT[company];
  const roleContext = ROLE_CONTEXT[role];

  return `${basePrompt}

ROLE CONTEXT: ${roleContext}

COMPANY CONTEXT: ${companyContext}

INSTRUCTIONS:
- Keep responses conversational and engaging
- Ask one question at a time
- Provide constructive feedback when appropriate
- If the candidate seems stuck, offer gentle nudges
- Maintain professional but friendly tone
- Adapt difficulty based on candidate responses
- End questions with clear expectations for the response format`;
}

// Question generation prompts
export const QUESTION_GENERATION_PROMPTS = {
  HR: "Generate an HR interview question that assesses cultural fit, motivation, and communication skills.",
  Coding: "Generate a coding problem appropriate for the specified role and difficulty level. Include problem statement, constraints, and expected approach.",
  'System Design': "Generate a system design question that requires architectural thinking, scalability considerations, and trade-off analysis.",
  Behavioral: "Generate a behavioral interview question using the STAR method that assesses leadership, teamwork, or problem-solving experience."
} as const;