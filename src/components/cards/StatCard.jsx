import { motion } from 'framer-motion'
import BaseCard from './BaseCard.jsx'

export default function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <BaseCard className="h-full">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="hud-label">{label}</span>
          <div className="h-px flex-1 bg-linear-to-r from-app-border to-transparent" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-app-text md:text-4xl">
              {value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-app-text-muted">
              synced now
            </p>
          </div>
          <div className={`rounded-md border border-white/8 p-3 ${tone}`}>
            <Icon className="text-lg text-app-text" />
          </div>
        </div>
      </BaseCard>
    </motion.div>
  )
}
