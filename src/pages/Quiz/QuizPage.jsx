import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/buttons/Button.jsx'
import BaseCard from '../../components/cards/BaseCard.jsx'
import { quizQuestions } from '../../utils/mockData.js'

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(60)
  const [showScore, setShowScore] = useState(false)

  useEffect(() => {
    if (showScore) return
    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer)
          setShowScore(true)
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showScore])

  const currentQuestion = quizQuestions[currentIndex]
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100
  const score = useMemo(() => {
    return quizQuestions.reduce((total, question) => {
      return total + (answers[question.id] === question.answer ? 1 : 0)
    }, 0)
  }, [answers])

  if (showScore) {
    return (
      <div className="surface-grid">
        <BaseCard className="text-center">
          <p className="hud-label">Score page</p>
          <h1 className="mt-4 text-4xl font-semibold text-app-text">
            {score} / {quizQuestions.length}
          </h1>
          <p className="mt-3 text-sm text-app-text-muted">
            Nice run. Review the incorrect questions and try again.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setAnswers({})
                setCurrentIndex(0)
                setTimeLeft(60)
                setShowScore(false)
              }}
            >
              Retry
            </Button>
          </div>
        </BaseCard>
      </div>
    )
  }

  return (
    <div className="surface-grid">
      <BaseCard>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="hud-label">Quiz mode</p>
            <h1 className="mt-3 text-3xl font-semibold text-app-text">Practice Quiz</h1>
          </div>
          <div className="rounded-md border border-app-border px-4 py-2 text-sm text-app-text">
            Timer: {timeLeft}s
          </div>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/8">
          <div className="h-full bg-cyan-300" style={{ width: `${progress}%` }} />
        </div>
      </BaseCard>

      <BaseCard>
        <p className="hud-label">
          Question {currentIndex + 1} of {quizQuestions.length}
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
          {currentIndex === quizQuestions.length - 1 ? (
            <Button onClick={() => setShowScore(true)}>Finish</Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentIndex((previous) =>
                  Math.min(previous + 1, quizQuestions.length - 1),
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
