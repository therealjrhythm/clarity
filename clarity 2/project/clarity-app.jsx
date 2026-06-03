/* Clarity — app shell, state, layout variations, tweaks */
const { useState: useStateA, useEffect: useEffectA, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "centered",
  "accent": "#d9a15e",
  "showChips": true,
  "ambient": true
}/*EDITMODE-END*/;

const USER = { name: 'Jeremiah', initials: 'J', email: 'jrhythm.producer@gmail.com' };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [collapsed, setCollapsed] = useStateA(false);
  const [prompt, setPrompt] = useStateA('');
  const [model, setModel] = useStateA('Gemini 3.5 Flash');
  const [view, setView] = useStateA('home'); // home | thinking | next
  const [submitted, setSubmitted] = useStateA('');
  const greeting = useMemo(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)], []);

  // apply accent to CSS var
  useEffectA(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  function submit() {
    const text = prompt.trim();
    if (!text) return;
    setSubmitted(text);
    setView('thinking');
  }
  function reset() {
    setView('home'); setPrompt(''); setSubmitted('');
  }

  const layout = t.layout;

  return (
    <div className={'app layout-' + layout + (t.ambient ? ' has-ambient' : '')}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} onNew={reset} user={USER} />

      <main className="main">
        <header className="topbar">
          <div className="tb-left">
            {collapsed && <span className="tb-brand"><span className="brand-mark sm">C</span>Clarity</span>}
          </div>
          <button className="icon-btn ghost" onClick={reset} title="New project"><Icon name="pencil" size={18} /></button>
        </header>

        {t.ambient && layout !== 'editorial' && <div className="ambient-glow" aria-hidden="true" />}

        {view === 'home' && (
          <div className={'stage stage--' + layout}>
            <div className="stage-inner">
              <Greeting text={greeting} name={USER.name} layout={layout} />
              <PromptBox value={prompt} onChange={setPrompt} onSubmit={submit} model={model} setModel={setModel} />
              {t.showChips && <Chips onPick={(label) => setPrompt(label)} />}
            </div>
          </div>
        )}

        {view === 'thinking' && (
          <div className="stage stage--center">
            <div className="stage-inner">
              <Thinking prompt={submitted} onDone={() => setView('next')} />
            </div>
          </div>
        )}

        {view === 'next' && (
          <div className="stage stage--page">
            <div className="stage-inner">
              <NextPage prompt={submitted} model={model} onBack={reset} />
            </div>
          </div>
        )}
      </main>

      <TweaksPanel>
        <TweakSection label="Layout" />
        <TweakRadio label="Composition" value={t.layout}
          options={['centered', 'editorial', 'aura']}
          onChange={(v) => setTweak('layout', v)} />
        <TweakToggle label="Ambient glow" value={t.ambient} onChange={(v) => setTweak('ambient', v)} />
        <TweakToggle label="Quick-start chips" value={t.showChips} onChange={(v) => setTweak('showChips', v)} />
        <TweakSection label="Brand" />
        <TweakColor label="Accent" value={t.accent}
          options={['#d9a15e', '#c98a6a', '#8a9a6b', '#7d8fb3', '#b58fc9']}
          onChange={(v) => setTweak('accent', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
