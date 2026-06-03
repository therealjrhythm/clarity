/* Clarity — shared UI components (sidebar, prompt box, states) */
const { useState, useEffect, useRef } = React;

/* ---------- Icons (simple stroke set) ---------- */
function Icon({ name, size = 18, stroke = 2 }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const paths = {
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    pencil: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /></>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    chevron: <polyline points="6 9 12 15 18 9" />,
    chevronUpDown: <><polyline points="8 9 12 5 16 9" /><polyline points="16 15 12 19 8 15" /></>,
    sparkle: <><path d="M12 3l1.6 4.8L18.4 9.4 13.6 11 12 15.8 10.4 11 5.6 9.4 10.4 7.8 12 3Z" /><path d="M19 14l.7 2.1L21.8 17l-2.1.7L19 20l-.7-2.3L16.2 17l2.1-.9L19 14Z" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    palette: <><circle cx="12" cy="12" r="9" /><circle cx="8" cy="9.5" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="9.5" r="1" fill="currentColor" stroke="none" /><path d="M12 21a3 3 0 0 1 0-6 2 2 0 0 0 0-4" /></>,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.6-1.3-1.5-2.6-2 .6a7.6 7.6 0 0 0-2.6-1.5l-.3-2.1H11.4l-.3 2.1a7.6 7.6 0 0 0-2.6 1.5l-2-.6L5 9.2l1.6 1.3a7.6 7.6 0 0 0 0 3L5 14.8l1.5 2.6 2-.6a7.6 7.6 0 0 0 2.6 1.5l.3 2.1h2.7l.3-2.1a7.6 7.6 0 0 0 2.6-1.5l2 .6 1.5-2.6Z" /></>,
    panelLeft: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><polygon points="16 8 14 14 8 16 10 10 16 8" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
  };
  return <svg {...common} aria-hidden="true">{paths[name]}</svg>;
}

/* ---------- Sidebar ---------- */
const PROJECTS = {
  continue: [
    { name: 'Teddy Wear', meta: 'Website · Updated today', status: 'ready' },
  ],
  recent: [
    { name: 'Halcyon Wellness', meta: 'Palette · 2d ago', status: 'draft' },
    { name: 'Nocturne Records', meta: 'Brand · 4d ago', status: 'draft' },
  ],
  drafts: [
    { name: 'Atlas Fintech', meta: 'Brief', status: 'draft' },
    { name: 'Untitled system', meta: 'New', status: 'draft' },
  ],
};

function ProjectRow({ p, collapsed }) {
  return (
    <button className="proj-row" title={p.name}>
      <span className="proj-ic"><Icon name="layers" size={15} /></span>
      {!collapsed && (
        <span className="proj-text">
          <span className="proj-name">{p.name}</span>
          <span className="proj-meta">{p.meta}</span>
        </span>
      )}
      {!collapsed && p.status === 'ready' && <span className="proj-dot" />}
    </button>
  );
}

function Sidebar({ collapsed, onToggle, onNew, user }) {
  const [q, setQ] = useState('');
  return (
    <aside className={'sidebar' + (collapsed ? ' is-collapsed' : '')}>
      <div className="sb-top">
        <div className="brand">
          <span className="brand-mark">C</span>
          {!collapsed && <span className="brand-name">Clarity</span>}
        </div>
        <button className="icon-btn sb-collapse" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          <Icon name="panelLeft" size={18} />
        </button>
      </div>

      <button className="new-project" onClick={onNew} title="New project">
        <Icon name="plus" size={17} />
        {!collapsed && <span>New project</span>}
      </button>

      {collapsed ? (
        <button className="icon-btn sb-rail-btn" title="Search projects"><Icon name="search" size={17} /></button>
      ) : (
        <div className="sb-search">
          <Icon name="search" size={15} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" />
        </div>
      )}

      <nav className="sb-scroll">
        {!collapsed && (
          <>
            <Group title="Continue working" items={PROJECTS.continue} q={q} />
            <Group title="Recent" items={PROJECTS.recent} q={q} />
            <Group title="Drafts" items={PROJECTS.drafts} q={q} />
          </>
        )}
        {collapsed && [...PROJECTS.continue, ...PROJECTS.recent, ...PROJECTS.drafts]
          .slice(0, 6).map((p, i) => <ProjectRow key={i} p={p} collapsed />)}
      </nav>

      <div className="sb-user">
        <div className="avatar">{user.initials}</div>
        {!collapsed && (
          <div className="user-text">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        )}
        {!collapsed && <button className="icon-btn" title="Settings"><Icon name="gear" size={16} /></button>}
      </div>
    </aside>
  );
}

function Group({ title, items, q }) {
  const filtered = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  if (!filtered.length) return null;
  return (
    <div className="sb-group">
      <div className="sb-group-label">{title}</div>
      {filtered.map((p, i) => <ProjectRow key={i} p={p} />)}
    </div>
  );
}

Object.assign(window, { Icon, Sidebar });
