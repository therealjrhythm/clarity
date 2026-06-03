"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Layers3, LogOut, PanelLeft, Plus, Search } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { NewProjectEntry } from "@/components/layout/new-project-entry";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function projectMeta(project: Project) {
  const type = project.type || "Design system";
  const date = new Date(project.updated_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return `${type} · ${date}`;
}

function ProjectRow({
  collapsed,
  isActive,
  project,
}: {
  collapsed: boolean;
  isActive?: boolean;
  project: Project;
}) {
  return (
    <Link
      className={cn(
        "flex w-full items-center gap-[11px] rounded-[10px] px-3 py-2 text-left transition-colors duration-[140ms] hover:bg-surface",
        collapsed && "justify-center px-0",
        isActive && "bg-surface",
      )}
      href={`/projects/${project.id}`}
      title={project.name}
    >
      <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[7px] bg-accent-soft text-accent">
        <Layers3 size={15} aria-hidden />
      </span>
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium text-foreground">
              {project.name}
            </span>
            <span className="block truncate text-[11.5px] text-ink-subtle">
              {projectMeta(project)}
            </span>
          </span>
          {isActive ? (
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(217,161,94,0.6)]" />
          ) : null}
        </>
      ) : null}
    </Link>
  );
}

function ProjectGroup({
  collapsed,
  isContinue,
  projects,
  title,
}: {
  collapsed: boolean;
  isContinue?: boolean;
  projects: Project[];
  title: string;
}) {
  if (!projects.length) {
    return null;
  }

  return (
    <section className="mb-4">
      {!collapsed ? (
        <h2 className="px-3 pb-[7px] font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle">
          {title}
        </h2>
      ) : null}
      <div className="grid gap-1">
        {projects.map((project, index) => (
          <ProjectRow
            collapsed={collapsed}
            isActive={isContinue && index === 0}
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}

export function AppSidebar({
  email,
  name,
  projects,
}: {
  email?: string | null;
  name: string;
  projects: Project[];
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const latestProject = projects[0];

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return projects;
    }

    return projects.filter((project) =>
      [project.name, project.type, project.description]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [projects, query]);

  const sidebarProjects = query
    ? filteredProjects
    : filteredProjects.filter((project) => project.id !== latestProject?.id);

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-line-soft bg-[var(--bg-2)] px-3 py-[14px] transition-[width] duration-[260ms] ease-[cubic-bezier(.4,0,.2,1)]",
        collapsed ? "w-[72px]" : "w-[276px]",
      )}
    >
      <div className="mb-[14px] flex h-10 items-center justify-between gap-3 px-1">
        {!collapsed ? (
          <Link className="flex min-w-0 items-center gap-2.5" href="/dashboard">
            <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] bg-[linear-gradient(150deg,var(--accent),#b9824a)] text-base font-bold text-accent-foreground shadow-[0_0_0_1px_rgba(217,161,94,0.25)]">
              C
            </span>
            <span className="truncate text-[17px] font-semibold tracking-[-0.01em]">Clarity</span>
          </Link>
        ) : null}
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "grid h-[34px] w-[34px] place-items-center rounded-[9px] text-ink-muted transition-colors duration-150 hover:bg-white/[0.05] hover:text-foreground",
            collapsed && "mx-auto",
          )}
          onClick={() => setCollapsed((value) => !value)}
          type="button"
        >
          <PanelLeft size={18} aria-hidden />
        </button>
      </div>

      <NewProjectEntry
        className={cn(
          "flex h-[42px] w-full items-center gap-2.5 rounded-[11px] border border-line bg-surface px-[13px] text-sm font-medium text-foreground transition-colors duration-150 hover:border-[#2e3140] hover:bg-surface-muted",
          collapsed && "justify-center px-0",
        )}
      >
        <Plus size={17} aria-hidden />
        {!collapsed ? <span>New project</span> : null}
      </NewProjectEntry>

      <div
        className={cn(
          "mt-2 flex h-[38px] items-center gap-[9px] rounded-[10px] px-3 text-ink-subtle",
          !collapsed && "focus-within:bg-surface",
          collapsed && "justify-center px-0",
        )}
      >
        <Search size={15} aria-hidden />
        {!collapsed ? (
          <input
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-ink-subtle"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            value={query}
          />
        ) : null}
      </div>

      <nav className="mt-[14px] min-h-0 flex-1 overflow-y-auto pr-0.5">
        {latestProject && !query ? (
          <ProjectGroup
            collapsed={collapsed}
            isContinue
            projects={[latestProject]}
            title="Continue working"
          />
        ) : null}
        <ProjectGroup
          collapsed={collapsed}
          projects={sidebarProjects}
          title={query ? "Projects" : "Recent"}
        />
        {!projects.length && !collapsed ? (
          <div className="rounded-[10px] border border-dashed border-line bg-surface p-4">
            <p className="text-[13.5px] font-medium">No projects yet</p>
            <p className="mt-2 text-[12px] leading-5 text-ink-muted">
              Start a design system to create your first workspace record.
            </p>
          </div>
        ) : null}
      </nav>

      <div className="mt-2 flex items-center gap-2.5 border-t border-line-soft px-2 py-[9px]">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-surface-muted text-[13px] font-semibold">
          {initialsFor(name)}
        </span>
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{name}</span>
              <span className="block truncate text-[11px] text-ink-subtle">
                {email}
              </span>
            </span>
            <form action={signOut}>
              <button
                aria-label="Sign out"
                className="grid h-[34px] w-[34px] place-items-center rounded-[9px] text-ink-muted transition-colors duration-150 hover:bg-white/[0.05] hover:text-foreground"
                type="submit"
              >
                <LogOut size={16} aria-hidden />
              </button>
            </form>
          </>
        ) : null}
      </div>
    </aside>
  );
}
