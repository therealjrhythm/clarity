/* Clarity — prompt box, greeting, thinking + next-page views */
const { useState: useStateV, useEffect: useEffectV, useRef: useRefV } = React;

const GREETINGS = [
  'What are we designing today',
  'Where should we begin',
  "Let's find the direction",
  'What are we bringing to life',
  'What direction are we chasing',
  'Ready when you are',
];

const MODELS = ['Gemini 3.5 Flash', 'Gemini 3.5 Pro', 'Claude Opus', 'GPT-5'];

const CHIPS = [
  { icon: 'sparkle', label: 'Start a design system' },
  { icon: 'image', label: 'Import references' },
  { icon: 'palette', label: 'Build a color palette' },
  { icon: 'compass', label: 'Continue Teddy Wear' },
];

/* ---------- Model pill (dropdown) ---------- */
function ModelPill({ model, setModel }) {
  const [open, setOpen] = useStateV(false);
  const ref = useRefV(null);
  useEffectV(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div className="model-pill-wrap" ref={ref}>
      <button className="model-pill" onClick={() => setOpen((o) => !o)}>
        <span className="model-glyph"><Icon name="sparkle" size={13} /></span>
        <span>{model}</span>
        <Icon name="chevronUpDown" size={13} />
      </button>
      {open && (
        <div className="model-menu">
          <div className="model-menu-label">Preferred model</div>
          {MODELS.map((m) => (
            <button key={m} className={'model-opt' + (m === model ? ' is-active' : '')}
              onClick={() => { setModel(m); setOpen(false); }}>
              <span>{m}</span>
              {m === model && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Prompt box ---------- */
function PromptBox({ value, onChange, onSubmit, model, setModel, compact }) {
  const taRef = useRefV(null);
  useEffectV(() => {
    const el = taRef.current; if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 220) + 'px';
  }, [value]);
  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); }
  }
  return (
    <div className={'prompt-box' + (compact ? ' is-compact' : '')}>
      <textarea
        ref={taRef}
        className="prompt-input"
        value={value}
        placeholder="Describe what you want to design…"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        rows={1}
      />
      <div className="prompt-actions">
        <div className="pa-left">
          <button className="icon-btn ghost" title="Attach references"><Icon name="plus" size={19} /></button>
          <ModelPill model={model} setModel={setModel} />
        </div>
        <div className="pa-right">
          <button className="icon-btn ghost" title="Voice"><Icon name="mic" size={18} /></button>
          <button
            className={'send-btn' + (value.trim() ? ' is-ready' : '')}
            onClick={onSubmit}
            disabled={!value.trim()}
            title="Send">
            <Icon name="arrowUp" size={18} stroke={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Greeting ---------- */
function Greeting({ text, name, layout }) {
  return (
    <div className={'greeting greeting--' + layout}>
      {layout === 'editorial' && <div className="eyebrow">Clarity workspace</div>}
      <h1>
        {text}<span className="g-name">, {name}</span>
        <span className="g-punc">{text.startsWith("Let") || text.startsWith("Ready") ? '.' : '?'}</span>
      </h1>
      {layout === 'editorial' && (
        <p className="greeting-sub">Turn intent, references, palettes, and typography into a design system.</p>
      )}
    </div>
  );
}

/* ---------- Chips ---------- */
function Chips({ onPick }) {
  return (
    <div className="chips">
      {CHIPS.map((c) => (
        <button key={c.label} className="chip" onClick={() => onPick(c.label)}>
          <Icon name={c.icon} size={15} />
          <span>{c.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Thinking state ---------- */
const PIPELINE = [
  'Reading your intent',
  'Mapping the brand archetype',
  'Composing color stories',
  'Setting the typography system',
  'Preparing your workspace',
];

function Thinking({ prompt, onDone }) {
  const [step, setStep] = useStateV(0);
  useEffectV(() => {
    const stepMs = 620;
    const id = setInterval(() => setStep((s) => s + 1), stepMs);
    const done = setTimeout(onDone, stepMs * (PIPELINE.length + 0.4));
    return () => { clearInterval(id); clearTimeout(done); };
  }, []);
  return (
    <div className="thinking">
      <div className="user-echo">{prompt}</div>
      <div className="pipeline">
        <span className="pulse-dot" />
        <div className="pipe-lines">
          {PIPELINE.map((p, i) => (
            <div key={i} className={'pipe-line' + (i < step ? ' done' : '') + (i === step ? ' active' : '')}>
              {i < step ? <Icon name="check" size={14} /> : <span className="pipe-bullet" />}
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Next page placeholder ---------- */
function NextPage({ prompt, model, onBack }) {
  const steps = [
    { n: '01', t: 'Brief', d: 'Audience, mood, constraints, and the memorable moment.' },
    { n: '02', t: 'Archetype', d: 'Primary and secondary brand archetype direction.' },
    { n: '03', t: 'Color story', d: 'Three palettes scored against your intent.' },
    { n: '04', t: 'Typography', d: 'Heading, body, and mono pairings.' },
  ];
  const words = prompt.trim().split(/\s+/);
  // Highlight the most evocative design keyword; fall back to the last word.
  const KEYWORD_PRIORITY = ['design', 'palette', 'brand', 'typography', 'system', 'references', 'moodboard', 'color', 'identity', 'logo'];
  const clean = (w) => w.toLowerCase().replace(/[^a-z]/g, '');
  let accentIdx = words.length - 1;
  let bestRank = Infinity;
  words.forEach((w, i) => {
    const rank = KEYWORD_PRIORITY.indexOf(clean(w));
    if (rank !== -1 && rank < bestRank) { bestRank = rank; accentIdx = i; }
  });
  return (
    <div className="nextpage">
      <button className="back-link" onClick={onBack}><Icon name="arrowRight" size={15} /><span>Back to start</span></button>
      <div className="np-eyebrow">New project · {model}</div>
      <h2 className="np-title">{words.map((w, i) => (
        <span key={i} className={i === accentIdx ? 'accent-word' : undefined}>{w}{i < words.length - 1 ? ' ' : ''}</span>
      ))}</h2>
      <p className="np-sub">Clarity is preparing your workspace. Your design direction will build out across these steps.</p>
      <div className="np-grid">
        {steps.map((s, i) => (
          <div key={s.n} className={'np-card' + (i === 0 ? ' is-active' : '')}>
            <span className="np-num">{s.n}</span>
            <div>
              <div className="np-step-t">{s.t}</div>
              <div className="np-step-d">{s.d}</div>
            </div>
            {i === 0 && <span className="np-badge">In progress</span>}
          </div>
        ))}
      </div>
      <div className="np-preview">
        <span className="np-preview-label">DESIGN.md preview</span>
      </div>
    </div>
  );
}

Object.assign(window, { PromptBox, Greeting, Chips, Thinking, NextPage, GREETINGS });
