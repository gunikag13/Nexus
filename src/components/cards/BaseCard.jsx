import { cn } from '../../utils/helpers.js'

export default function BaseCard({ children, className }) {
  return (
    <div className={cn('glass-panel tech-frame rounded-[22px] p-5 md:p-6', className)}>
      {children}
    </div>
  )
}
