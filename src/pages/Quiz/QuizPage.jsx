import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../../components/buttons/Button.jsx'
import BaseCard from '../../components/cards/BaseCard.jsx'
import EmptyState from '../../components/cards/EmptyState.jsx'
import ErrorState from '../../components/cards/ErrorState.jsx'
import PageLoader from '../../components/cards/PageLoader.jsx'
import { getApiErrorMessage, quizService } from '../../services/api.js'

export default function QuizPage() {
  const [quizSets, setQuizSets] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showScore, setShowScore] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadQuizzes = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await quizService.getAll()
      setQuizSets(response.data.data.quizzes)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadQuizzes()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const currentQuestion = selectedQuiz?.questions[currentIndex]
  const progress = selectedQuiz
    ? ((currentIndex + 1) / selectedQuiz.questions.length) * 100
    : 0
  const score = useMemo(() => {
    if (!selectedQuiz) return 0

    return selectedQuiz.questions.reduce((total, question) => {
      return total + (answers[question.id] === question.correctAnswer ? 1 : 0)
    }, 0)
  }, [answers, selectedQuiz])

  const startQuiz = (quizSet) => {
    setSelectedQuiz(quizSet)
    setCurrentIndex(0)
    setAnswers({})
    setShowScore(false)
    setIsReviewing(false)
  }

  const finishQuiz = async () => {
    setShowScore(true)

    try {
      await quizService.complete(selectedQuiz.noteId, {
        score,
        total: selectedQuiz.questions.length,
      })
    } catch (completeError) {
      toast.error(getApiErrorMessage(completeError))
    }
  }

  const retakeQuiz = () => {
    setAnswers({})
    setCurrentIndex(0)
    setShowScore(false)
    setIsReviewing(false)
  }

  if (isLoading) {
    return <PageLoader label="Loading quizzes" />
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load quizzes"
        description={error}
        action={<Button onClick={loadQuizzes}>Try Again</Button>}
      />
    )
  }

  if (!selectedQuiz) {
    return (
      <div className="surface-grid">
        <BaseCard>
          <p className="hud-label">Quiz mode</p>
          <h1 className="mt-3 text-3xl font-semibold text-app-text">Practice Quiz</h1>
          <p className="mt-2 text-sm text-app-text-muted">
            Select a generated quiz to attempt.
          </p>
        </BaseCard>

        {quizSets.length ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quizSets.map((quizSet) => (
              <BaseCard key={quizSet.id}>
                <p className="hud-label">{quizSet.subject}</p>
                <h2 className="mt-3 text-xl font-semibold text-app-text">
                  {quizSet.title}
                </h2>
                <p className="mt-2 text-sm text-app-text-muted">
                  {quizSet.questions.length} questions
                </p>
                <div className="mt-5">
                  <Button onClick={() => startQuiz(quizSet)}>Attempt Quiz</Button>
                </div>
              </BaseCard>
            ))}
          </section>
        ) : (
          <EmptyState
            title="No generated quizzes yet"
            description="Generate a quiz from a note to begin practice."
          />
        )}
      </div>
    )
  }

  if (showScore) {
    return (
      <div className="surface-grid">
        <BaseCard className="text-center">
          <p className="hud-label">Score page</p>
          <h1 className="mt-4 text-4xl font-semibold text-app-text">
            {score} / {selectedQuiz.questions.length}
          </h1>
          <p className="mt-3 text-sm text-app-text-muted">
            Review answers or retake the quiz.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="secondary" onClick={retakeQuiz}>
              Retake Quiz
            </Button>
            <Button onClick={() => setIsReviewing((previous) => !previous)}>
              {isReviewing ? 'Hide Review' : 'Review Answers'}
            </Button>
            <Button variant="ghost" onClick={() => setSelectedQuiz(null)}>
              Choose Another
            </Button>
          </div>
        </BaseCard>

        {isReviewing ? (
          <section className="space-y-4">
            {selectedQuiz.questions.map((question, index) => (
              <BaseCard key={question.id}>
                <p className="hud-label">Question {index + 1}</p>
                <h2 className="mt-3 text-xl font-semibold text-app-text">
                  {question.question}
                </h2>
                <div className="mt-4 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <p
                      key={option}
                      className={`rounded-md border px-4 py-3 text-sm ${
                        optionIndex === question.correctAnswer
                          ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
                          : answers[question.id] === optionIndex
                            ? 'border-rose-300/30 bg-rose-300/10 text-rose-100'
                            : 'border-app-border text-app-text-muted'
                      }`}
                    >
                      {option}
                    </p>
                  ))}
                </div>
                <p className="mt-4 text-sm text-app-text-muted">
                  {question.explanation}
                </p>
              </BaseCard>
            ))}
          </section>
        ) : null}
      </div>
    )
  }

  return (
    <div className="surface-grid">
      <BaseCard>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="hud-label">{selectedQuiz.subject}</p>
            <h1 className="mt-3 text-3xl font-semibold text-app-text">
              {selectedQuiz.title}
            </h1>
          </div>
          <Button variant="ghost" onClick={() => setSelectedQuiz(null)}>
            Choose Another
          </Button>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/8">
          <div className="h-full bg-cyan-300" style={{ width: `${progress}%` }} />
        </div>
      </BaseCard>

      <BaseCard>
        <p className="hud-label">
          Question {currentIndex + 1} of {selectedQuiz.questions.length}
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-app-text">
          {currentQuestion.question}
        </h2>

        <div className="mt-6 space-y-3">
          {currentQuestion.options.map((option, optionIndex) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                setAnswers((previous) => ({
                  ...previous,
                  [currentQuestion.id]: optionIndex,
                }))
              }
              className={`w-full rounded-[18px] border px-4 py-4 text-left text-sm transition ${
                answers[currentQuestion.id] === optionIndex
                  ? 'border-cyan-300/28 bg-cyan-300/10 text-app-text'
                  : 'border-app-border bg-white/4 text-app-text-muted hover:bg-white/6'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between gap-3">
          <Button
            variant="secondary"
            onClick={() => setCurrentIndex((previous) => Math.max(previous - 1, 0))}
          >
            Previous
          </Button>
          {currentIndex === selectedQuiz.questions.length - 1 ? (
            <Button onClick={finishQuiz}>Finish</Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentIndex((previous) =>
                  Math.min(previous + 1, selectedQuiz.questions.length - 1),
                )
              }
            >
              Next
            </Button>
          )}
        </div>
      </BaseCard>
    </div>
  )
}
