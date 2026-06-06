import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Model configurations
export const GEMINI_MODELS = {
  flash: "gemini-2.0-flash",
  flashLite: "gemini-2.0-flash-lite",
  pro: "gemini-2.5-pro",
} as const;

// Generation configs for different use cases
const CONFIGS: Record<string, GenerationConfig> = {
  creative: { temperature: 0.9, maxOutputTokens: 8192 },
  precise: { temperature: 0.2, maxOutputTokens: 4096 },
  code: { temperature: 0.1, maxOutputTokens: 8192 },
  chat: { temperature: 0.7, maxOutputTokens: 2048 },
};

// Get model instance
export function getModel(modelName: keyof typeof GEMINI_MODELS = "flash", configName: keyof typeof CONFIGS = "creative") {
  return genAI.getGenerativeModel({
    model: GEMINI_MODELS[modelName],
    generationConfig: CONFIGS[configName],
  });
}

// Streaming chat for real-time responses
export async function streamChat(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  onChunk: (text: string) => void
) {
  const model = getModel("flash", "chat");
  const chat = model.startChat({
    history: messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: CONFIGS.chat,
  });

  const result = await chat.sendMessageStream(systemPrompt + "\n\n" + messages[messages.length - 1].content);
  for await (const chunk of result.stream) {
    onChunk(chunk.text());
  }
}

// Generate page/component code from description
export async function generateComponent(description: string, existingCode?: string): Promise<string> {
  const model = getModel("flash", "code");
  
  const prompt = existingCode
    ? `You are an expert Next.js/TypeScript developer. Modify the following component according to these instructions: "${description}"

Current code:
\`\`\`tsx
${existingCode}
\`\`\`

Return ONLY the updated TypeScript/TSX code. No markdown. No explanations.

Rules:
- Use Tailwind CSS for styling
- Follow "Volcanic Cyber" theme: dark bg (#0a0a0f), orange-500 accents, neon effects
- Use "use client" directive for interactive components
- Define proper TypeScript interfaces for all props
- Use @/ alias for imports
- Ensure responsive design (mobile-first)
- Add smooth animations with Tailwind classes`
    : `You are an expert Next.js/TypeScript developer. Create a new component based on this description: "${description}"

Return ONLY the TypeScript/TSX code. No markdown. No explanations.

Rules:
- Next.js 16 App Router compatible
- Use Tailwind CSS for styling
- Follow "Volcanic Cyber" theme: dark bg (#0a0a0f), orange-500 accents, neon effects
- Use "use client" directive for interactive components
- Define proper TypeScript interfaces for all props
- Use @/ alias for imports
- Ensure responsive design (mobile-first)
- Add smooth animations with Tailwind classes`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Director AI -- plans tasks from backlog
export async function directorPlan(backlog: string, completed: string, projectContext: string): Promise<string> {
  const model = getModel("flash", "precise");
  
  const prompt = `You are the LiTreeLabStudios Hive Mind Director. Analyze the project state and plan the next task.

PROJECT CONTEXT:
${projectContext}

COMPLETED WORK:
${completed}

BACKLOG:
${backlog}

Output ONLY a JSON object (no markdown, no explanations) with this exact structure:
{
  "milestone": "Short task name",
  "status": "pending",
  "director_instructions": "Detailed, step-by-step technical instructions for the Executor. Be specific about which files to create/modify, what components to use, styling details, and functionality requirements.",
  "target_files": ["path/to/file.tsx"],
  "estimated_complexity": "low|medium|high",
  "dependencies": []
}

Rules:
- Pick the highest priority item from the backlog
- If backlog is empty, suggest a NEW improvement to the existing codebase
- Keep tasks atomic (1-2 files max)
- Focus on visual quality and user experience
- Follow the Volcanic Cyber aesthetic`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Executor AI -- writes code from Director instructions
export async function executorCode(
  instructions: string,
  targetFile: string,
  existingCode?: string,
  errorLogs?: string
): Promise<string> {
  const model = getModel("flash", "code");
  
  let prompt = `You are the LiTreeLabStudios Hive Mind Executor. Implement the code for: ${targetFile}

DIRECTOR INSTRUCTIONS:
${instructions}
`;

  if (existingCode) {
    prompt += `
CURRENT CODE:
\`\`\`tsx
${existingCode}
\`\`\`
`;
  }

  if (errorLogs) {
    prompt += `
ERRORS TO FIX:
${errorLogs}
`;
  }

  prompt += `
Return ONLY the complete file code. No markdown. No explanations.

STRICT RULES:
- Complete, working TypeScript/TSX code
- Volcanic Cyber theme (dark bg, orange accents, neon glow)
- Tailwind CSS for all styling
- Proper TypeScript interfaces, NO "any" types
- "use client" only when hooks/interactivity needed
- Mobile-first responsive design
- Smooth Tailwind animations
- @/ alias for all imports`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export { genAI };
