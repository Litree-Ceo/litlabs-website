export interface Agent {
  id: string;
  name: string;
  description: string;
  personality: string;
  skills: string[];
  createdAt: number;
}

// In-memory storage for now. In a real app, this would be a database.
let agents: Agent[] = [
  {
    id: "champion",
    name: "LitLabs Agent",
    description: "The primary LitLabs assistant.",
    personality: "professional",
    skills: ["chat", "help"],
    createdAt: Date.now(),
  },
];

export async function getAgents(): Promise<Agent[]> {
  return agents;
}

export async function createAgent(data: Omit<Agent, "id" | "createdAt">): Promise<Agent> {
  const newAgent: Agent = {
    ...data,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: Date.now(),
  };
  agents.push(newAgent);
  return newAgent;
}

export async function deleteAgent(id: string): Promise<boolean> {
  const initialLength = agents.length;
  agents = agents.filter((a) => a.id !== id);
  return agents.length < initialLength;
}
