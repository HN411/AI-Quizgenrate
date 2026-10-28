const PROFILE_KEY = 'quizcraft.profile.v1'
const HISTORY_KEY = 'quizcraft.history.v1'
const GENERATED_KEY = 'quizcraft.generated-questions.v1'

export function readProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') } catch { return null }
}
export function saveProfile(profile) { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)) }
export function readHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch { return [] }
}
export function saveHistory(history) { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)) }

function normalizeTopic(topic = '') {
  return topic.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}
export function readGeneratedQuestions(topic) {
  try {
    const records = JSON.parse(localStorage.getItem(GENERATED_KEY) || '[]')
    const key = normalizeTopic(topic)
    return Array.isArray(records)
      ? records.filter(record => normalizeTopic(record.topic) === key).flatMap(record => record.questions || []).slice(-60)
      : []
  } catch { return [] }
}
export function rememberGeneratedQuestions(topic, questions) {
  try {
    const records = JSON.parse(localStorage.getItem(GENERATED_KEY) || '[]')
    const safeRecords = Array.isArray(records) ? records : []
    const key = normalizeTopic(topic)
    const existing = safeRecords.filter(record => normalizeTopic(record.topic) !== key)
    const previous = safeRecords.filter(record => normalizeTopic(record.topic) === key).flatMap(record => record.questions || [])
    const nextQuestions = [...previous, ...questions.map(question => String(question).slice(0, 500))].slice(-100)
    localStorage.setItem(GENERATED_KEY, JSON.stringify([...existing, { topic: String(topic || '').slice(0, 180), questions: nextQuestions }].slice(-30)))
  } catch { /* Local history is a convenience, not a blocker for quiz generation. */ }
}
export function clearLocalData() {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(HISTORY_KEY)
  localStorage.removeItem(GENERATED_KEY)
}
