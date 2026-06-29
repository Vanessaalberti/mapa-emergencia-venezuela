import { useState } from 'react'
import { Modal } from '../Modal'
import { AdminDashboard } from './AdminDashboard'
import { AdminUsers } from './AdminUsers'
import { AdminReports } from './AdminReports'
import type { Report } from '../../types/database'

interface AdminPanelProps {
  reports: Report[]
  onClose: () => void
}

type Tab = 'dashboard' | 'users' | 'reports'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'users', label: 'Usuarios', emoji: '👥' },
  { id: 'reports', label: 'Reportes', emoji: '📋' },
]

export function AdminPanel({ reports, onClose }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>('dashboard')

  return (
    <Modal title="Panel de administración" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-1 p-1 rounded-xl bg-bg-secondary dark:bg-neutral-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === t.id
                  ? 'bg-bg-primary dark:bg-neutral-900 text-ink-primary dark:text-neutral-100 shadow-sm'
                  : 'text-ink-secondary'
              }`}
            >
              <span>{t.emoji}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <AdminDashboard reports={reports} />}
        {tab === 'users' && <AdminUsers />}
        {tab === 'reports' && <AdminReports reports={reports} />}
      </div>
    </Modal>
  )
}
