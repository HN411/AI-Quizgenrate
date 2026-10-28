const clean = (s) => s.replace(/\s+/g, ' ').trim()
const STOP = new Set(('the and for are but not you all any can had her was one our out day get has him his how its may new now old see way who did this that with from they have were been more when your what into than them then there about which their also some such only very each other most').split(' '))

function tokenize(sentence) {
  return (sentence.match(/[A-Za-z][A-Za-z'-]{2,}/g) || [])
    .map(w => w.toLowerCase().replace(/['-]/g, ''))
    .filter(w => !STOP.has(w))
}
function makeOptions(answer, candidates) {
  const distractors = [...new Set(candidates.filter(x => x && x.toLowerCase() !== answer.toLowerCase()))]
  const options = [answer]
  for (const item of distractors) {
    if (options.length === 4) break
    options.push(item)
  }
  const generic = ['the main idea', 'an unrelated example', 'a supporting detail', 'the opposite result', 'a different process']
  for (const item of generic) {
    if (options.length === 4) break
    if (!options.some(x => x.toLowerCase() === item.toLowerCase())) options.push(item)
  }
  return options.sort(() => Math.random() - 0.5)
}
function sentenceToQuestion(sentence, index, sentences) {
  const words = sentence.match(/\b[A-Za-z][A-Za-z'-]{3,}\b/g) || []
  if (words.length < 5) return null
  const counts = new Map()
  for (const word of words) {
    const key = word.toLowerCase()
    if (!STOP.has(key)) counts.set(key, (counts.get(key) || 0) + 1)
  }
  const answer = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  if (!answer || answer.length < 4) return null
  const pretty = words.find(w => w.toLowerCase() === answer) || answer
  const candidates = sentences.flatMap(s => s.match(/\b[A-Za-z][A-Za-z'-]{3,}\b/g) || [])
    .filter(w => !STOP.has(w.toLowerCase()))
  const options = makeOptions(pretty, candidates)
  const blanked = sentence.replace(new RegExp(`\\b${answer}\\b`, 'i'), '_____')
  return {
    id: `q-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    question: `Complete the statement based on your material: “${blanked}”`,
    options,
    answer: options.findIndex(o => o.toLowerCase() === pretty.toLowerCase()),
    explanation: `Your source states: “${sentence}”`,
    source: sentence
  }
}
function fallbackQuestions(topic) {
  const safeTopic = clean(topic).slice(0, 80) || 'your study topic'
  return [
    { question: `What is the best first step when studying ${safeTopic}?`, options: ['Identify the key concepts', 'Skip the material', 'Memorize random details only', 'Avoid checking understanding'], answer: 0, explanation: 'Start by identifying the main concepts and how they relate.' },
    { question: `Which approach best checks your understanding of ${safeTopic}?`, options: ['Explain it in your own words', 'Only reread the title', 'Ignore difficult parts', 'Guess without reviewing'], answer: 0, explanation: 'Retrieval practice and explaining ideas help reveal what you know.' },
    { question: `What should you do after answering practice questions about ${safeTopic}?`, options: ['Review mistakes and explanations', 'Delete all feedback', 'Never revisit the topic', 'Change answers randomly'], answer: 0, explanation: 'Reviewing mistakes helps you identify gaps and improve.' },
    { question: `Which notes are most useful for a quiz on ${safeTopic}?`, options: ['Clear facts and key ideas', 'Unrelated text', 'Only page numbers', 'Repeated filler words'], answer: 0, explanation: 'Focused notes make it easier to check specific learning objectives.' },
    { question: `How can you improve long-term recall of ${safeTopic}?`, options: ['Practice over multiple sessions', 'Study only once for a few seconds', 'Avoid self-testing', 'Never review'], answer: 0, explanation: 'Spaced practice and self-testing support longer-term retention.' }
  ].map((q, i) => {
    const correctText = q.options[q.answer]
    const options = [...q.options].sort(() => Math.random() - 0.5)
    return { ...q, id: `fallback-${Date.now()}-${i}`, options, answer: options.indexOf(correctText) }
  })
}
export function generateQuiz({ text, topic, count = 10 }) {
  const source = clean(text || '')
  const sentences = source.split(/(?<=[.!?])\s+|\n+/).map(clean).filter(s => s.length > 35)
  const candidates = sentences.map((s, i) => sentenceToQuestion(s, i, sentences)).filter(Boolean)
  const questions = []
  const seen = new Set()
  for (const q of candidates) {
    if (!q || seen.has(q.question)) continue
    seen.add(q.question)
    questions.push(q)
    if (questions.length >= Math.max(1, Math.min(20, count))) break
  }
  if (questions.length < Math.min(3, count)) {
    const fallbacks = fallbackQuestions(topic || source.slice(0, 50))
    for (const q of fallbacks) {
      if (questions.length >= Math.max(5, Math.min(20, count))) break
      questions.push(q)
    }
  }
  return {
    id: `quiz-${Date.now()}`,
    title: clean(topic || '') || (source ? 'My study notes quiz' : 'Quick practice quiz'),
    createdAt: new Date().toISOString(),
    questions: questions.slice(0, Math.max(1, Math.min(20, count)))
  }
}
