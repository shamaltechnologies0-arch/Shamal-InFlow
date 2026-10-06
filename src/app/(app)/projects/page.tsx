import { listProjects } from "@/lib/data";
import { ProjectsClient } from "@/components/projects/projects-client";

export default async function ProjectsPage() {
  const projects = await listProjects();
  return <ProjectsClient projects={projects} />;
}
