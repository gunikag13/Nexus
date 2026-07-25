import OpenAI from 'openai'

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const REQUEST_TIMEOUT_MS = 30000

const prompts = {
  summarize: 'Return concise study notes under 200 words.',
  explain: 'Explain this note in extremely simple language, like teaching a young child.',
  keyConcepts: 'Extract the important concepts as clear bullet points.',
  studyTips: 'Suggest effective ways to revise this topic.',
  mnemonics: 'Create memorable mnemonics where appropriate.',
  revisionSheet: 'Return a compact one-page revision guide.',
  flashcards:
    'Generate exactly 10 flashcards. Return only valid JSON in this shape: {"items":[{"question":"","answer":""}]}',
  quiz: 'Generate exactly 10 MCQs. Return only valid JSON in this shape: {"items":[{"question":"","options":["","","",""],"correctAnswer":0,"explanation":""}]}',
}

const createHttpError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw createHttpError(500, 'OPENAI_API_KEY is not configured.')
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

const buildMessages = ({ instruction, note }) => [
  {
    role: 'system',
    content:
      'You are NEXUS, a precise AI study assistant. Generate helpful study material only from the supplied note.',
  },
  {
    role: 'user',
    content: [
      instruction,
      '',
      `Title: ${note.title}`,
      `Subject: ${note.subject}`,
      `Tags: ${note.tags?.join(', ') || 'None'}`,
      '',
      'Note content:',
      note.content,
    ].join('\n'),
  },
]

const normalizeOpenAIError = (error) => {
  if (error.status === 401) {
    throw createHttpError(500, 'Invalid OpenAI API key.')
  }

  if (error.status === 429) {
    throw createHttpError(429, 'OpenAI rate limit reached. Please try again shortly.')
  }

  if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
    throw createHttpError(504, 'OpenAI request timed out.')
  }

  throw createHttpError(500, 'AI generation failed. Please try again.')
}

export const generateText = async ({ type, note }) => {
  try {
    const client = getClient()
    const response = await client.chat.completions.create(
      {
        model: MODEL,
        messages: buildMessages({ instruction: prompts[type], note }),
        temperature: 0.4,
      },
      { timeout: REQUEST_TIMEOUT_MS },
    )

    return response.choices[0]?.message?.content?.trim() || ''
  } catch (error) {
	console.error("========== OPENAI ERROR ==========");
  console.error(error);
  console.error("Status:", error.status);
  console.error("Code:", error.code);
  console.error("Message:", error.message);
  console.error("==================================");
    normalizeOpenAIError(error)
  }
}

export const generateJson = async ({ type, note }) => {
  try {
    const client = getClient()
    const response = await client.chat.completions.create(
      {
        model: MODEL,
        messages: buildMessages({ instruction: prompts[type], note }),
        temperature: 0.35,
        response_format: { type: 'json_object' },
      },
      { timeout: REQUEST_TIMEOUT_MS },
    )

    const content = response.choices[0]?.message?.content?.trim() || '{}'
    const parsed = JSON.parse(content)

    return Array.isArray(parsed) ? parsed : parsed.items || parsed.flashcards || parsed.quiz || []
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw createHttpError(500, 'AI returned invalid JSON.')
    }

    normalizeOpenAIError(error)
  }
}
