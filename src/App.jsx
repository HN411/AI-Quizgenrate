import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, CheckCircle2,
  ChevronDown, Clock3, FileText, FileUp, Flame, GraduationCap, History, Home,
  Info, LayoutDashboard, LockKeyhole, LogOut, Menu, MoreHorizontal, Play, Plus,
  Search, Settings2, ShieldCheck, Sparkles, Target, Trophy, Upload, UserRound,
  X, Zap, Mail, CircleUserRound, RotateCcw, Trash2, ChartNoAxesCombined
} from './components/Icons.jsx'
import { clearLocalData, readGeneratedQuestions, readHistory, readProfile, rememberGeneratedQuestions, saveHistory, saveProfile } from './lib/storage.js'
import { generateQuizWithAI } from './lib/ai.js'

const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'Q'
const dateLabel = (date) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date))
const percent = (score, total) => total ? Math.round(score / total * 100) : 0

function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}>
    <div className="brand-mark"><BrainCircuit size={22} strokeWidth={2.2}/></div>
    {!compact && <div className="brand-copy"><b>QuizCraft <span>AI</span></b><small>LEARN SMARTER</small></div>}
  </div>
}

function Avatar({ name, size = 'md' }) {
  return <div className={`avatar avatar-${size}`} aria-label={`${name} avatar`}>{initials(name)}</div>
}

function Welcome({ onContinue }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState('')
  const validName = name.trim().length >= 2
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!validName || !validEmail) {
      setError(!validName ? 'Enter your name (at least 2 characters).' : 'Enter a valid email address.')
      return
    }
    onContinue({ name: name.trim(), email: email.trim() })
  }
  return <main className="welcome-shell">
    <section className="welcome-left">
      <div className="welcome-top"><Brand/><span className="top-note"><span className="status-dot"/> YOUR PERSONAL LEARNING SPACE</span></div>
      <div className="welcome-content">
        <div className="eyebrow"><Sparkles size={15}/> THE SMARTER WAY TO STUDY</div>
        <h1>Make every<br/>study session <span>count.</span></h1>
        <p className="welcome-lead">Turn your notes into meaningful practice. Build confidence, track your progress, and learn a little better every day.</p>
        <div className="feature-list">
          <div className="feature-item"><div className="feature-icon mint"><BrainCircuit size={19}/></div><div><b>Quizzes made for you</b><p>Turn study notes into focused practice questions.</p></div></div>
          <div className="feature-item"><div className="feature-icon violet"><ChartNoAxesCombined size={19}/></div><div><b>Progress you can see</b><p>Review your scores and learn from every attempt.</p></div></div>
          <div className="feature-item"><div className="feature-icon blue"><ShieldCheck size={19}/></div><div><b>Your learning, your pace</b><p>A calm, personal space to keep improving.</p></div></div>
        </div>
        <div className="welcome-foot"><div className="mini-avatars"><span>Q</span><span>AI</span><span>✓</span></div><p><b>One small step at a time.</b><br/>Your next breakthrough starts here.</p></div>
      </div>
      <div className="left-footer"><span>© {new Date().getFullYear()} QuizCraft AI</span><span>Built for curious minds <Sparkles size={13}/></span></div>
    </section>
    <section className="welcome-right">
      <div className="decor decor-one"/><div className="decor decor-two"/>
      <div className="signup-card">
        <div className="signup-mobile-brand"><Brand/></div>
        <div className="signup-kicker">LET'S GET YOU STARTED</div>
        <h2>Your learning journey<br/>starts <span>right here.</span></h2>
        <p className="signup-description">Create your local learner profile to personalize your workspace.</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="learner-name">Your name</label>
          <div className={`input-wrap ${touched && !validName ? 'input-error' : ''}`}><UserRound size={18}/><input id="learner-name" autoComplete="name" placeholder="e.g. Alex Morgan" value={name} onChange={e => {setName(e.target.value); setError('')}} onBlur={() => setTouched(true)}/>{validName && <CheckCircle2 className="valid-icon" size={17}/>}</div>
          {touched && name && !validName && <small className="field-error">Please enter at least 2 characters.</small>}
          <label htmlFor="learner-email">Email address</label>
          <div className={`input-wrap ${touched && email && !validEmail ? 'input-error' : ''}`}><Mail size={18}/><input id="learner-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => {setEmail(e.target.value); setError('')}} onBlur={() => setTouched(true)}/>{validEmail && <CheckCircle2 className="valid-icon" size={17}/>}</div>
          {touched && email && !validEmail && <small className="field-error">Please enter a valid email address.</small>}
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="btn btn-primary btn-wide signup-submit" type="submit">Create my workspace <ArrowRight size={17}/></button>
        </form>
        <div className="privacy-note"><LockKeyhole size={16}/><span><b>Your details stay on this device.</b><br/>This demo saves your profile locally in your browser. No account is created on a server.</span></div>
        <div className="signup-bottom"><span>NO PASSWORD REQUIRED</span><span><span className="status-dot"/> READY WHEN YOU ARE</span></div>
      </div>
    </section>
  </main>
}

function Sidebar({ page, setPage, profile, onLogout, mobileOpen, setMobileOpen }) {
  const nav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'create', label: 'Create a quiz', icon: Sparkles },
    { id: 'history', label: 'Quiz history', icon: History },
    { id: 'profile', label: 'My profile', icon: UserRound }
  ]
  return <>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)}/>}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Brand/><button className="sidebar-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {nav.map(item => <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => {setPage(item.id); setMobileOpen(false)}}><item.icon size={19}/><span>{item.label}</span>{item.id === 'create' && <span className="nav-new">NEW</span>}</button>)}
      </nav>
      <div className="sidebar-spacer"/>
      <div className="sidebar-tip"><div className="tip-spark"><Sparkles size={17}/></div><b>Small steps add up.</b><p>Every quiz is a chance to discover what you know.</p><button onClick={() => {setPage('create'); setMobileOpen(false)}}>Start practicing <ArrowRight size={14}/></button></div>
      <div className="sidebar-user">
        <Avatar name={profile.name}/>
        <div className="sidebar-user-copy"><b>{profile.name}</b><span>{profile.email}</span></div>
        <button className="icon-button logout-button" onClick={onLogout} title="Clear local profile" aria-label="Clear local profile"><LogOut size={17}/></button>
      </div>
    </aside>
  </>
}

function Topbar({ profile, title, subtitle, onMenu }) {
  return <header className="topbar">
    <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={21}/></button>
    <div className="topbar-heading"><div className="breadcrumb">WORKSPACE <span>/</span> {title.toUpperCase()}</div><div className="topbar-subtitle">{subtitle}</div></div>
    <div className="topbar-right"><div className="topbar-date"><span className="status-dot"/> Your learning space</div><div className="topbar-avatar"><Avatar name={profile.name}/><ChevronDown size={14}/></div></div>
  </header>
}

function Dashboard({ profile, history, setPage, startQuiz }) {
  const completed = history.length
  const avg = completed ? Math.round(history.reduce((sum, h) => sum + (h.score || 0), 0) / completed) : 0
  const best = completed ? Math.max(...history.map(h => h.score || 0)) : 0
  const latest = history.slice(0, 3)
  return <div className="page-content dashboard-page">
    <section className="hero-banner">
      <div className="hero-copy"><div className="hero-pill"><Sparkles size={14}/> YOUR PERSONAL AI STUDY PARTNER</div><h1>Hey, {profile.name.split(' ')[0]} <span className="wave">✦</span><br/>ready to learn something?</h1><p>Pick up where you left off or turn your notes into your next great quiz.</p><button className="btn btn-mint" onClick={() => setPage('create')}>Create a new quiz <ArrowRight size={17}/></button></div>
      <div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="art-card art-card-back"><div className="art-lines"><i/><i/><i/></div></div><div className="art-card art-card-front"><div className="art-brain"><BrainCircuit size={48}/></div><span className="art-tag">SMART PRACTICE</span><div className="art-progress"><i/></div></div><div className="art-spark spark-a"><Sparkles size={19}/></div><div className="art-spark spark-b"><Check size={18}/></div></div>
    </section>
    <div className="section-heading"><div><h2>Your learning at a glance</h2><p>A little progress is still progress.</p></div><button className="text-button" onClick={() => setPage('history')}>View history <ArrowRight size={15}/></button></div>
    <div className="stats-grid">
      <StatCard icon={BookOpen} color="mint" label="Quizzes completed" value={completed} note={completed ? 'Keep the momentum going' : 'Your first quiz awaits'}/>
      <StatCard icon={Target} color="violet" label="Average score" value={`${avg}%`} note={completed ? 'Across completed quizzes' : 'Scores appear after a quiz'}/>
      <StatCard icon={Trophy} color="gold" label="Personal best" value={`${best}%`} note={completed ? 'Your highest quiz score' : 'Your next goal starts here'}/>
      <StatCard icon={Flame} color="blue" label="Learning streak" value={completed ? 'Active' : 'Start today'} note="Build a habit, one quiz at a time"/>
    </div>
    <div className="dashboard-columns">
      <section className="panel quick-panel"><div className="panel-heading"><div><h3>Make your next move</h3><p>Choose how you want to study.</p></div><div className="panel-heading-icon"><Zap size={18}/></div></div>
        <button className="action-card" onClick={() => setPage('create')}><div className="action-icon action-mint"><Sparkles size={21}/></div><div className="action-copy"><b>Create a quiz</b><span>Choose a topic or use your notes</span></div><ArrowRight size={18} className="action-arrow"/></button>
        <button className="action-card" onClick={() => setPage('create', 'upload')}><div className="action-icon action-violet"><FileUp size={21}/></div><div className="action-copy"><b>Upload study material</b><span>Use a PDF, DOCX, TXT, or Markdown file</span></div><ArrowRight size={18} className="action-arrow"/></button>
        <button className="action-card" onClick={() => latest.length ? startQuiz(latest[0].quiz, true) : setPage('create')}><div className="action-icon action-blue"><RotateCcw size={21}/></div><div className="action-copy"><b>{latest.length ? 'Practice again' : 'Try a quick practice'}</b><span>{latest.length ? `Revisit ${latest[0].title}` : 'Get started with a topic you choose'}</span></div><ArrowRight size={18} className="action-arrow"/></button>
      </section>
      <section className="panel recent-panel"><div className="panel-heading"><div><h3>Recent activity</h3><p>Your latest quiz attempts.</p></div><button className="icon-button" aria-label="Open quiz history" onClick={() => setPage('history')}><MoreHorizontal size={20}/></button></div>
        {latest.length ? <div className="recent-list">{latest.map(item => <div className="recent-item" key={item.id}><div className="recent-icon"><FileText size={18}/></div><div className="recent-copy"><b>{item.title}</b><span>{dateLabel(item.completedAt)} · {item.total} questions</span></div><div className={`score-chip ${item.score >= 70 ? 'score-good' : 'score-low'}`}>{item.score}%</div><button className="icon-button recent-retry" onClick={() => startQuiz(item.quiz, true)} title="Try again" aria-label={`Try ${item.title} again`}><RotateCcw size={15}/></button></div>)}</div> : <EmptyState icon={History} title="Your story starts here" text="Complete your first quiz and your recent activity will show up here." action="Create your first quiz" onClick={() => setPage('create')}/>}
        {latest.length > 0 && <button className="panel-footer-link" onClick={() => setPage('history')}>See all activity <ArrowRight size={15}/></button>}
      </section>
    </div>
    <div className="dashboard-note"><Info size={16}/><span>This demo stores your profile and quiz history in your browser. It doesn't create a server account or send your notes anywhere.</span></div>
  </div>
}

function StatCard({ icon: Icon, color, label, value, note }) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>
}

function EmptyState({ icon: Icon, title, text, action, onClick }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={23}/></div><b>{title}</b><p>{text}</p>{action && <button className="text-button" onClick={onClick}>{action} <ArrowRight size={15}/></button>}</div>
}

function CreateQuiz({ onGenerate, initialMode }) {
  const [mode, setMode] = useState(initialMode === 'upload' ? 'upload' : 'notes')
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [count, setCount] = useState('10')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [fileName, setFileName] = useState('')
  const [fileBusy, setFileBusy] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)
  useEffect(() => { if (initialMode === 'upload') setMode('upload') }, [initialMode])
  const readFile = async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['txt', 'md', 'pdf', 'docx'].includes(ext)) { setError('Supported formats are TXT, Markdown, PDF, and DOCX.'); return }
    if (file.size > 15 * 1024 * 1024) { setError('Please choose a file smaller than 15 MB.'); return }
    setFileBusy(true); setError('')
    try {
      let text = ''
      if (ext === 'txt' || ext === 'md') text = await file.text()
      if (ext === 'pdf') {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
        const pages = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          pages.push(content.items.map(item => item.str).join(' '))
        }
        text = pages.join('\n')
      }
      if (ext === 'docx') {
        const mammoth = await import('mammoth/mammoth.browser')
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
        text = result.value
      }
      if (!text.trim()) throw new Error('No readable text was found in that file.')
      setNotes(text.slice(0, 90000)); setTopic(topic || file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')); setFileName(file.name); setMode('notes')
    } catch (e) { setError(e.message || 'We could not read that file. Try another document.') }
    finally { setFileBusy(false) }
  }
  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (!topic.trim() && !notes.trim()) { setError('Enter a topic or add study notes to get started.'); return }
    if (notes.trim() && notes.trim().length < 20) { setError('Add a little more detail (at least 20 characters) so your quiz has useful context.'); return }
    if (notes.trim().length > 90000) { setError('Your notes are too long. Keep them under 90,000 characters.'); return }
    setGenerating(true)
    try { await onGenerate({ topic: topic.trim(), text: notes, count: Number(count), difficulty }) }
    catch (err) { setError(err.message || 'Gemini could not generate your quiz. Please try again.') }
    finally { setGenerating(false) }
  }
  return <div className="page-content create-page">
    <div className="page-intro"><div className="page-eyebrow"><Sparkles size={14}/> QUIZ STUDIO</div><h1>Build a quiz that <span>sticks.</span></h1><p>Start with your notes or a topic. We'll turn your material into a practice session.</p></div>
    <form className="create-layout" onSubmit={submit}>
      <div className="create-main">
        <section className="panel source-panel">
          <div className="step-heading"><span className="step-number">01</span><div><h3>Choose your topic</h3><p>Search the web automatically, or add your own notes.</p></div></div>
          <div className="mode-tabs"><button type="button" className={mode === 'notes' ? 'selected' : ''} onClick={() => setMode('notes')}><FileText size={16}/> Paste notes</button><button type="button" className={mode === 'upload' ? 'selected' : ''} onClick={() => setMode('upload')}><Upload size={16}/> Upload a file</button></div>
          {mode === 'upload' ? <div className={`dropzone ${dragging ? 'dragging' : ''}`} onDragOver={e => {e.preventDefault(); setDragging(true)}} onDragLeave={() => setDragging(false)} onDrop={e => {e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files[0])}}><div className="dropzone-icon"><FileUp size={25}/></div><b>{fileBusy ? 'Reading your document…' : 'Drop your file here'}</b><p>or choose a file from your device</p><button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()} disabled={fileBusy}>{fileBusy ? 'Processing…' : 'Choose file'} <ArrowRight size={15}/></button><span className="file-types">PDF, DOCX, TXT, MD · Up to 15 MB</span><input ref={fileRef} className="sr-only" type="file" accept=".pdf,.docx,.txt,.md,text/plain,text/markdown,application/pdf" onChange={e => readFile(e.target.files?.[0])}/></div> : <><label htmlFor="topic">Quiz topic <span className="optional-label">OPTIONAL WITH NOTES</span></label><input id="topic" className="text-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Cell biology, World War II, JavaScript basics"/><div className="topic-suggestions" aria-label="Popular topics">{['Biology', 'Computer Science', 'World History', 'Mathematics', 'English Grammar', 'Geography', 'Current Affairs'].map(suggestion => <button key={suggestion} type="button" className={topic.toLowerCase() === suggestion.toLowerCase() ? 'topic-chip selected' : 'topic-chip'} onClick={() => setTopic(suggestion)}>{suggestion}</button>)}</div><label htmlFor="notes">Study notes <span className="optional-label">OPTIONAL — LEAVE BLANK TO SEARCH THE WEB</span></label><textarea id="notes" className="notes-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Paste class notes or key concepts here…&#10;&#10;Leave this blank to research your topic online and generate a fresh quiz." rows={8}/><div className="textarea-footer"><span>{notes.length.toLocaleString()} characters</span><button type="button" className="subtle-button" onClick={() => {setNotes(''); setFileName('')}} disabled={!notes}>Clear notes</button></div></>}
          {fileName && <div className="file-attached"><FileText size={17}/><span><b>{fileName}</b><small>Text extracted and ready to use</small></span><button type="button" className="icon-button" onClick={() => {setFileName(''); setNotes('')}} aria-label="Remove file"><X size={16}/></button></div>}
          {mode === 'upload' && <><label htmlFor="upload-topic">Quiz topic <span className="optional-label">OPTIONAL</span></label><input id="upload-topic" className="text-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Name this quiz"/></>}
        </section>
        <section className="panel settings-panel"><div className="step-heading"><span className="step-number">02</span><div><h3>Set up your practice</h3><p>Choose a comfortable quiz length.</p></div></div><label htmlFor="question-count">Number of questions</label><div className="count-options">{[['5','Quick'],['10','Standard'],['15','Focused'],['20','Deep dive']].map(([n, label]) => <button type="button" key={n} className={`count-option ${count === n ? 'chosen' : ''}`} onClick={() => setCount(n)}><b>{n}</b><span>{label}</span>{count === n && <CheckCircle2 size={15}/>}</button>)}</div><label htmlFor="quiz-difficulty">Difficulty level</label><select id="quiz-difficulty" className="text-input difficulty-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}><option value="beginner">Beginner — build foundations</option><option value="intermediate">Intermediate — balanced practice</option><option value="advanced">Advanced — deeper reasoning</option></select><div className="settings-info"><Info size={15}/><span>Topic-only quizzes use Google Search grounding when available. Questions are checked against your recent quizzes to reduce repeats.</span></div></section>
        {error && <div className="form-error" role="alert">{error}</div>}
        <button className="btn btn-primary btn-wide generate-button" type="submit" disabled={generating || fileBusy}>{generating ? <><span className="ai-loading-dot"/> Researching & generating…</> : <><Sparkles size={18}/> Generate Quiz <ArrowRight size={17}/></>}</button>
      </div>
      <aside className="create-aside"><div className="aside-illustration"><div className="aside-glow"/><div className="aside-paper"><div className="paper-heading"><span/><span/></div><div className="paper-line"/><div className="paper-line short"/><div className="paper-choice"><i/><span/></div><div className="paper-choice"><i/><span/></div><div className="paper-choice active"><i/><span/></div></div><div className="aside-bubble bubble-check"><Check size={17}/></div><div className="aside-bubble bubble-spark"><Sparkles size={18}/></div></div><div className="aside-copy"><div className="aside-label"><Zap size={14}/> HOW IT WORKS</div><h3>From notes to<br/>know-how.</h3><div className="how-step"><span>1</span><div><b>Add your material</b><p>Paste notes or upload a document.</p></div></div><div className="how-step"><span>2</span><div><b>Practice with purpose</b><p>Answer questions at your own pace.</p></div></div><div className="how-step"><span>3</span><div><b>Learn from results</b><p>Review your score and explanations.</p></div></div><div className="privacy-mini"><ShieldCheck size={17}/><span>Your Gemini API key stays server-side. Study material is sent to Gemini when you generate a quiz.</span></div></div></aside>
    </form>
  </div>
}

function QuizRunner({ quiz, onFinish, onExit }) {
  const [answers, setAnswers] = useState({})
  const [index, setIndex] = useState(0)
  const [confirmExit, setConfirmExit] = useState(false)
  const q = quiz.questions[index]
  const selected = answers[q.id]
  const done = index === quiz.questions.length - 1
  const finish = () => {
    const correct = quiz.questions.reduce((sum, question) => sum + (answers[question.id] === question.answer ? 1 : 0), 0)
    onFinish({ correct, total: quiz.questions.length, answers })
  }
  return <div className="quiz-shell">
    <header className="quiz-topbar"><Brand/><div className="quiz-top-meta"><span><Clock3 size={15}/> Take your time</span><button className="btn btn-quiet" onClick={() => setConfirmExit(true)}>Exit quiz <X size={15}/></button></div></header>
    <div className="quiz-progress"><div style={{width: `${(index + 1) / quiz.questions.length * 100}%`}}/></div>
    <main className="quiz-main"><div className="quiz-context"><span className="quiz-tag"><Sparkles size={13}/> PRACTICE SESSION</span><span className="question-counter">QUESTION {String(index + 1).padStart(2, '0')} <span>/ {String(quiz.questions.length).padStart(2, '0')}</span></span></div><h1 className="quiz-title">{quiz.title}</h1>{quiz.research && <div className={`research-note ${quiz.research.status === 'fallback' ? 'research-fallback' : ''}`}><span>{quiz.research.status === 'grounded' ? 'Web-researched quiz' : quiz.research.status === 'fallback' ? 'Web search unavailable' : 'Based on your study material'}</span>{quiz.research.sources?.length > 0 && <div className="quiz-sources">Sources: {quiz.research.sources.slice(0, 3).map((source, sourceIndex) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title || `Source ${sourceIndex + 1}`}</a>)}</div>}{quiz.research.status === 'fallback' && <small>Search could not be reached this time, so verify current facts.</small>}</div>}<div className="quiz-question-card"><div className="question-number">QUESTION {index + 1}</div><h2>{q.question}</h2><p className="select-hint">Choose the best answer.</p><div className="answer-list">{q.options.map((option, i) => <button key={`${q.id}-${i}`} className={`answer-option ${selected === i ? 'answer-selected' : ''}`} onClick={() => setAnswers(old => ({...old, [q.id]: i}))}><span className="answer-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{selected === i && <CheckCircle2 size={19} className="answer-check"/>}</button>)}</div></div><div className="quiz-bottom"><button className="btn btn-secondary" onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}><ArrowLeft size={16}/> Previous</button><span className="answered-count">{Object.keys(answers).length} of {quiz.questions.length} answered</span>{done ? <button className="btn btn-primary" disabled={selected === undefined} onClick={finish}>Finish quiz <Check size={17}/></button> : <button className="btn btn-primary" disabled={selected === undefined} onClick={() => setIndex(i => i + 1)}>Next question <ArrowRight size={17}/></button>}</div><div className="quiz-footnote"><ShieldCheck size={15}/> Your answers are saved when you finish this session.</div></main>
    {confirmExit && <Modal title="Leave this quiz?" text="Your current answers won't be added to history unless you finish the quiz." onClose={() => setConfirmExit(false)}><div className="modal-actions"><button className="btn btn-secondary" onClick={() => setConfirmExit(false)}>Keep going</button><button className="btn btn-primary" onClick={onExit}>Exit quiz</button></div></Modal>}
  </div>
}

function Results({ quiz, result, onBack, onRetry }) {
  const score = percent(result.correct, result.total)
  const [showReview, setShowReview] = useState(true)
  return <div className="page-content results-page"><div className="results-header"><div className="result-badge"><Trophy size={19}/></div><div><div className="page-eyebrow">SESSION COMPLETE</div><h1>You showed up. <span>That counts.</span></h1><p>Take a look at what you've learned and what to revisit next.</p></div></div><section className="result-summary panel"><div className="score-ring" style={{'--score': `${score}%`}}><div><b>{score}%</b><span>YOUR SCORE</span></div></div><div className="result-stats"><div><span>Correct answers</span><b>{result.correct} <small>/ {result.total}</small></b></div><div><span>Questions to review</span><b>{result.total - result.correct}</b></div><div><span>Quiz</span><b className="result-quiz-name">{quiz.title}</b></div><p className="result-encouragement">{score >= 80 ? 'Fantastic work — your practice is paying off.' : score >= 50 ? 'Good effort. Review the explanations and give it another go.' : 'Every attempt teaches you something. Review, refresh, and try again.'}</p></div></section><div className="review-heading"><div><h2>Answer review</h2><p>Use the explanations to reinforce the key ideas.</p></div><button className="text-button" onClick={() => setShowReview(v => !v)}>{showReview ? 'Hide review' : 'Show review'} <ChevronDown size={15}/></button></div>{showReview && <div className="review-list">{quiz.questions.map((q, i) => {const chosen = result.answers[q.id]; const correct = chosen === q.answer; return <article className="review-card" key={q.id}><div className={`review-status ${correct ? 'review-correct' : 'review-incorrect'}`}>{correct ? <Check size={16}/> : <X size={16}/>}</div><div className="review-body"><div className="review-q-label">QUESTION {i + 1} · {correct ? 'CORRECT' : 'REVISIT'}</div><h3>{q.question}</h3><p className="review-your-answer">Your answer: <b>{chosen === undefined ? 'Not answered' : q.options[chosen]}</b></p>{!correct && <p className="review-correct-answer">Correct answer: <b>{q.options[q.answer]}</b></p>}<div className="explanation"><Info size={15}/><span>{q.explanation || 'Review this concept in your study notes.'}</span></div></div></article>})}</div>}<div className="result-actions"><button className="btn btn-secondary" onClick={onBack}><ArrowLeft size={16}/> Back to dashboard</button><button className="btn btn-primary" onClick={onRetry}><RotateCcw size={16}/> Try again</button></div></div>
}

function HistoryPage({ history, setPage, startQuiz, onDelete }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const filtered = history.filter(h => h.title.toLowerCase().includes(search.toLowerCase()) && (filter === 'all' || (filter === 'high' ? h.score >= 80 : h.score < 80)))
  return <div className="page-content history-page"><div className="page-intro"><div className="page-eyebrow"><History size={14}/> YOUR PROGRESS</div><h1>Every attempt <span>adds up.</span></h1><p>Revisit a quiz, celebrate a win, or spot the topics worth another look.</p></div><section className="panel history-panel"><div className="history-toolbar"><div className="history-search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your quizzes…" aria-label="Search quizzes"/></div><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter quiz scores"><option value="all">All scores</option><option value="high">80% and above</option><option value="low">Below 80%</option></select></div>{filtered.length ? <div className="history-table-wrap"><table className="history-table"><thead><tr><th>QUIZ</th><th>DATE</th><th>QUESTIONS</th><th>SCORE</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map(h => <tr key={h.id}><td><div className="table-quiz"><div className="table-quiz-icon"><FileText size={17}/></div><div><b>{h.title}</b><span>Practice session</span></div></div></td><td>{dateLabel(h.completedAt)}</td><td>{h.total}</td><td><span className={`score-chip ${h.score >= 70 ? 'score-good' : 'score-low'}`}>{h.score}%</span></td><td><div className="table-actions"><button className="icon-button" title="Try again" aria-label={`Try ${h.title} again`} onClick={() => startQuiz(h.quiz, true)}><RotateCcw size={16}/></button><button className="icon-button danger-hover" title="Delete history item" aria-label={`Delete ${h.title}`} onClick={() => onDelete(h.id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div> : <EmptyState icon={History} title={history.length ? 'No quizzes match that search' : 'No quizzes here yet'} text={history.length ? 'Try a different search or filter.' : 'Your completed quiz sessions will appear here.'} action="Create a quiz" onClick={() => setPage('create')}/>}</section><div className="history-privacy"><ShieldCheck size={17}/><span>History is stored locally in this browser. Clearing browser data may remove it.</span></div></div>
}

function ProfilePage({ profile, onSave, history, onClear }) {
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [message, setMessage] = useState('')
  const [showClear, setShowClear] = useState(false)
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const submit = e => { e.preventDefault(); if (name.trim().length < 2) {setMessage('Please enter a name with at least 2 characters.'); return} if (!validEmail) {setMessage('Please enter a valid email address.'); return} onSave({name: name.trim(), email: email.trim()}); setMessage('Your profile has been updated.') }
  return <div className="page-content profile-page"><div className="page-intro"><div className="page-eyebrow"><UserRound size={14}/> YOUR SPACE</div><h1>A little more <span>about you.</span></h1><p>Keep your learner profile up to date and make this workspace feel like yours.</p></div><div className="profile-layout"><section className="panel profile-card"><div className="profile-cover"><div className="cover-orb cover-orb-one"/><div className="cover-orb cover-orb-two"/></div><div className="profile-identity"><Avatar name={name || profile.name} size="xl"/><div><h2>{profile.name}</h2><p>{profile.email}</p></div><span className="local-badge"><ShieldCheck size={13}/> LOCAL PROFILE</span></div><form className="profile-form" onSubmit={submit}><div className="profile-form-heading"><h3>Profile details</h3><p>These details personalize your workspace on this device.</p></div><label htmlFor="profile-name">Full name</label><div className="input-wrap profile-input"><UserRound size={17}/><input id="profile-name" value={name} onChange={e => {setName(e.target.value); setMessage('')}}/></div><label htmlFor="profile-email">Email address</label><div className="input-wrap profile-input"><Mail size={17}/><input id="profile-email" type="email" value={email} onChange={e => {setEmail(e.target.value); setMessage('')}}/></div>{message && <div className={message.startsWith('Your') ? 'success-message' : 'form-error'}>{message}</div>}<button className="btn btn-primary" type="submit">Save changes <Check size={16}/></button></form></section><aside className="profile-side"><div className="panel profile-stats"><div className="panel-heading"><div><h3>Your learning snapshot</h3><p>A look at your progress so far.</p></div><Activity size={19}/></div><div className="profile-stat-row"><span>Quizzes completed</span><b>{history.length}</b></div><div className="profile-stat-row"><span>Average score</span><b>{history.length ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0}%</b></div><div className="profile-stat-row"><span>Best score</span><b>{history.length ? Math.max(...history.map(h => h.score)) : 0}%</b></div></div><div className="panel privacy-card"><div className="privacy-card-icon"><LockKeyhole size={20}/></div><h3>Your privacy matters.</h3><p>This demo keeps your profile and quiz history in your browser's local storage. It does not provide secure sign-in or sync across devices.</p><button className="text-button" onClick={() => setShowClear(true)}>Clear local app data <ArrowRight size={15}/></button></div></aside></div>{showClear && <Modal title="Clear all local data?" text="This removes your profile and quiz history from this browser. This action cannot be undone." onClose={() => setShowClear(false)}><div className="modal-actions"><button className="btn btn-secondary" onClick={() => setShowClear(false)}>Cancel</button><button className="btn btn-danger" onClick={onClear}>Clear data</button></div></Modal>}</div>
}

function Modal({ title, text, children, onClose }) {
  useEffect(() => { const key = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }, [onClose])
  return <div className="modal-overlay" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={18}/></button><div className="modal-icon"><Info size={21}/></div><h2 id="modal-title">{title}</h2><p>{text}</p>{children}</div></div>
}

export default function App() {
  const [profile, setProfile] = useState(() => readProfile())
  const [history, setHistory] = useState(() => readHistory())
  const [page, setPage] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [initialMode, setInitialMode] = useState('notes')
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [result, setResult] = useState(null)
  const [historyDelete, setHistoryDelete] = useState(null)

  useEffect(() => { saveHistory(history) }, [history])
  const navigate = (nextPage, mode) => { if (mode) setInitialMode(mode); else setInitialMode('notes'); setPage(nextPage); setResult(null) }
  const finishWelcome = (value) => { saveProfile(value); setProfile(value); setPage('dashboard') }
  const generate = async (settings) => {
    const historyKey = settings.topic?.trim() || `notes:${String(settings.text || '').slice(0, 120)}`
    const previousQuestions = readGeneratedQuestions(historyKey)
    const quiz = await generateQuizWithAI({ ...settings, previousQuestions, generationId: `${Date.now()}-${Math.random().toString(36).slice(2)}` })
    rememberGeneratedQuestions(historyKey, quiz.questions.map(question => question.question))
    setActiveQuiz(quiz); setResult(null); setPage('runner')
  }
  const startQuiz = (quiz, retry = false) => { if (!quiz?.questions?.length) return; setActiveQuiz(quiz); setResult(null); setPage('runner') }
  const finishQuiz = (outcome) => {
    const score = percent(outcome.correct, outcome.total)
    const entry = { id: `attempt-${Date.now()}`, title: activeQuiz.title, completedAt: new Date().toISOString(), total: outcome.total, correct: outcome.correct, score, answers: outcome.answers, quiz: activeQuiz }
    setHistory(old => [entry, ...old])
    setResult({ ...outcome, score, entryId: entry.id })
    setPage('results')
  }
  const deleteHistory = (id) => { setHistory(old => old.filter(h => h.id !== id)); setHistoryDelete(null) }
  const logout = () => { if (window.confirm('Clear your local profile and quiz history from this browser?')) { clearLocalData(); setProfile(null); setHistory([]); setPage('dashboard') } }
  const clearAll = () => { clearLocalData(); setProfile(null); setHistory([]); setPage('dashboard') }
  const saveProfileUpdate = (value) => { saveProfile(value); setProfile(value) }

  if (!profile) return <Welcome onContinue={finishWelcome}/>
  if (page === 'runner' && activeQuiz) return <QuizRunner key={activeQuiz.id} quiz={activeQuiz} onFinish={finishQuiz} onExit={() => {setPage('dashboard'); setResult(null)}}/>
  if (page === 'results' && activeQuiz && result) return <AppFrame profile={profile} page="dashboard" setPage={navigate} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}><Results quiz={activeQuiz} result={result} onBack={() => navigate('dashboard')} onRetry={() => startQuiz(activeQuiz, true)}/></AppFrame>

  const pageMeta = {
    dashboard: ['Overview', 'A calm space to keep your learning moving.'],
    create: ['Quiz studio', 'Make practice work for you.'],
    history: ['Quiz history', 'Your effort, progress, and practice sessions.'],
    profile: ['My profile', 'Your personal learning space.']
  }
  return <AppFrame profile={profile} page={page} setPage={navigate} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={logout}>
    {page === 'dashboard' && <Dashboard profile={profile} history={history} setPage={navigate} startQuiz={startQuiz}/>}
    {page === 'create' && <CreateQuiz key={initialMode} initialMode={initialMode} onGenerate={generate}/>}
    {page === 'history' && <HistoryPage history={history} setPage={navigate} startQuiz={startQuiz} onDelete={id => setHistoryDelete(id)}/>}
    {page === 'profile' && <ProfilePage profile={profile} onSave={saveProfileUpdate} history={history} onClear={clearAll}/>}
    {historyDelete && <Modal title="Delete this attempt?" text="This quiz attempt will be removed from your local history. The original quiz can no longer be retried from this entry." onClose={() => setHistoryDelete(null)}><div className="modal-actions"><button className="btn btn-secondary" onClick={() => setHistoryDelete(null)}>Cancel</button><button className="btn btn-danger" onClick={() => deleteHistory(historyDelete)}>Delete attempt</button></div></Modal>}
  </AppFrame>
}

function AppFrame({ profile, page, setPage, mobileOpen, setMobileOpen, onLogout, children }) {
  const titles = { dashboard: ['Overview', 'A calm space to keep your learning moving.'], create: ['Quiz studio', 'Make practice work for you.'], history: ['Quiz history', 'Your effort, progress, and practice sessions.'], profile: ['My profile', 'Your personal learning space.'] }
  const [title, subtitle] = titles[page] || ['Your results', 'Every attempt is progress.']
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} profile={profile} onLogout={onLogout || (() => {})} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/><main className="main-area"><Topbar profile={profile} title={title} subtitle={subtitle} onMenu={() => setMobileOpen(true)}/>{children}<footer className="app-footer"><span>© {new Date().getFullYear()} QuizCraft AI</span><span><ShieldCheck size={14}/> Your learning space, made for you.</span></footer></main></div>
}
