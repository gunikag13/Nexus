import { Link } from 'react-router-dom'
import Button from '../../components/buttons/Button.jsx'
import BaseCard from '../../components/cards/BaseCard.jsx'

export default function NotFoundPage() {
  return (
    <div className="auth-backdrop flex items-center justify-center">
      <BaseCard className="w-full max-w-xl text-center">
        <p className="hud-label">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-app-text">Route not found</h1>
        <p className="mt-3 text-sm leading-7 text-app-text-muted">
          The page you tried to open does not exist in the current NEXUS workspace.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </BaseCard>
    </div>
  )
}
