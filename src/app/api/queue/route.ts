import { NextResponse } from "next/server";

const DEMO_JOBS = [
  { id: "1", theme: "Neon Genesis", director_prompt: "Create a cyberpunk cityscape with noir elements", status: "COMPLETED" },
  { id: "2", theme: "Volcanic Cyber", director_prompt: "Lava-infused tech architecture with dark atmosphere", status: "RUNNING" },
  { id: "3", theme: "Trap Symphony", director_prompt: "Music visualization with trap beat energy", status: "PENDING" },
  { id: "4", theme: "AI Overlord", director_prompt: "Sentient AI emergence in digital space", status: "COMPLETED" },
  { id: "5", theme: "Neural Waves", director_prompt: "Brain-computer interface visualization", status: "PENDING" },
];

let jobs = [...DEMO_JOBS];

export async function GET() {
  const runningJobs = jobs.filter(j => j.status === "RUNNING");
  if (runningJobs.length === 0 && jobs.some(j => j.status === "PENDING")) {
    const nextPending = jobs.find(j => j.status === "PENDING");
    if (nextPending) {
      nextPending.status = "RUNNING";
      setTimeout(() => {
        const idx = jobs.findIndex(j => j.id === nextPending.id);
        if (idx !== -1) jobs[idx].status = "COMPLETED";
      }, 15000);
    }
  }
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newJob = {
      id: (jobs.length + 1).toString(),
      theme: body.theme || "Untitled Pipeline",
      director_prompt: body.director_prompt || "",
      status: "PENDING",
    };
    jobs.push(newJob);
    return NextResponse.json(newJob, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
