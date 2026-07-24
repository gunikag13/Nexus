import { Link } from 'react-router-dom'
import { FiArrowRight, FiLayers, FiZap } from 'react-icons/fi'
import Button from '../../components/buttons/Button.jsx'
import BaseCard from '../../components/cards/BaseCard.jsx'
import { landingFeatures } from '../../utils/mockData.js'

export default function LandingPage() {
  return (
    <div className="auth-backdrop flex items-center justify-center">
      <div className="w-full max-w-6xl space-y-6">
        <section className="glass-panel-strong tech-frame rounded-[24px] p-6 md:p-10">
          <p className="hud-label text-cyan-200">NEXUS / LANDING</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-app-text md:text-6xl">
                The AI-powered student second brain built like a real product.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-app-text-muted">
                Save notes, generate AI study outputs, build flashcards, manage tasks, and practice quizzes from one sharp technical workspace.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/signup">
                  <Button size="lg" icon={FiArrowRight}>
                    Start Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary">
                    Login
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <BaseCard>
                <p className="hud-label">Modules online</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-app-border bg-white/4 p-4">
                    <p className="text-3xl font-semibold text-app-text">05</p>
                    <p className="mt-2 text-sm text-app-text-muted">Core modules</p>
                  </div>
                  <div className="rounded-[18px] border border-app-border bg-white/4 p-4">
                    <p className="text-3xl font-semibold text-app-text">AI</p>
                    <p className="mt-2 text-sm text-app-text-muted">Study actions built in</p>
                  </div>
                </div>
              </BaseCard>
              <BaseCard>
                <p className="hud-label">Use cases</p>
                <div className="mt-4 space-y-3 text-sm text-app-text-muted">
                  <p className="flex items-center gap-3"><FiZap className="text-cyan-200" /> Summaries, ELI5, quiz generation, flashcards</p>
                  <p className="flex items-center gap-3"><FiLayers className="text-cyan-200" /> Structured dashboards instead of generic chat interfaces</p>
                </div>
              </BaseCard>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {landingFeatures.map((feature) => (
            <BaseCard key={feature.title}>
              <p className="hud-label">{feature.title}</p>
              <h2 className="mt-4 text-2xl font-semibold text-app-text">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-app-text-muted">{feature.detail}</p>
            </BaseCard>
          ))}
        </section>
      </div>
    </div>
  )
}
