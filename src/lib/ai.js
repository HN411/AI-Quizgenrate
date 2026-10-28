export async function generateQuizWithAI(settings) {
  let response;
  try {
    response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: settings.topic,
        text: settings.text,
        count: settings.count,
        difficulty: settings.difficulty || 'intermediate',
        previousQuestions: settings.previousQuestions || [],
        generationId: settings.generationId || `${Date.now()}-${Math.random().toString(36).slice(2)}`
      })
    });
  } catch {
    throw new Error('QuizCraft could not reach its API. Make sure both servers are running with npm run dev:full.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Quiz generation failed (${response.status}).`);
  if (!Array.isArray(data.questions) || !data.questions.length) throw new Error('The AI returned an empty quiz. Please try again.');
  return data;
}
