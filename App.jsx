import { useEffect, useMemo, useState } from 'react'
import {
  Activity, AlertCircle, ArrowDown, ArrowUp, CheckCircle2, ChevronDown,
  CircleHelp, Clock3, Filter, Inbox, LayoutDashboard, LifeBuoy, Plus,
  Search, Send, SlidersHorizontal, Ticket, X
} from 'lucide-react'

const starterTickets = [
  {
    id: 'TKT-1048',
    title: 'Unable to reset my password',
    description: 'I tried using the password reset link, but it expires before I can finish the process. Could someone help me regain access?',
    category: 'Account & Login',
    priority: 'High',
    status: 'Open',
    requester: 'Ananya R.',
    email: 'ananya@example.com',
    createdAt: '2026-10-18T09:20:00',
    updatedAt: '2026-10-18T09:20:00',
  },
  {
    id: 'TKT-1047',
    title: 'Payment was charged twice',
    description: 'My recent order appears to have two charges on my card. Please check the transaction and advise on the duplicate.',
    category: 'Billing',
    priority: 'Urgent',
    status: 'In Progress',
    requester: 'Karthik S.',
    email: 'karthik@example.com',
    createdAt: '2026-10-17T14:15:00',
    updatedAt: '2026-10-18T08:40:00',
  },
  {
    id: 'TKT-1046',
    title: 'Dashboard is loading slowly',
    description: 'The dashboard takes a long time to load when I open the reports page. This started happening today.',
    category: 'Technical Issue',
    priority: 'Medium',
    status: 'In Progress',
    requester: 'Meera P.',
    email: 'meera@example.com',
    createdAt: '2026-10-17T11:05:00',
    updatedAt: '2026-10-17T12:30:00',
  },
  {
    id: 'TKT-1045',
    title: 'How can I update my profile?',
    description: 'I want to change the display name and contact details associated with my account.',
    category: 'General Question',
    priority: 'Low',
    status: 'Resolved',
    requester: 'Rahul V.',
    email: 'rahul@example.com',
    createdAt: '2026-10-16T10:00:00',
    updatedAt: '2026-10-16T15:10:00',
  },
]

const statuses = ['Open', 'In Progress', 'Resolved']
const priorities = ['Low', 'Medium', 'High', 'Urgent']
const categories = ['Account & Login', 'Billing', 'Technical Issue', 'General Question', 'Other']

function dateLabel(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
function timeLabel(value) {
  return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
function statusClass(value) {
  return value.toLowerCase().replace(' ', '-')
}
function priorityIcon(value) {
  if (value === 'Urgent' || value === 'High') return <ArrowUp size={14} />
  if (value === 'Low') return <ArrowDown size={14} />
  return <Activity size={14} />
}

export default function App() {
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('support-desk-tickets')
      return saved ? JSON.parse(saved) : starterTickets
    } catch {
      return starterTickets
    }
  })
  const [selectedId, setSelectedId] = useState('TKT-1048')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All tickets')
  const [priorityFilter, setPriorityFilter] = useState('All priorities')
  const [showCreate, setShowCreate] = useState(false)
  const [mobileDetail, setMobileDetail] = useState(false)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', category: 'Technical Issue',
    priority: 'Medium', requester: '', email: ''
  })

  useEffect(() => {
    localStorage.setItem('support-desk-tickets', JSON.stringify(tickets))
  }, [tickets])

  const selected = tickets.find(ticket => ticket.id === selectedId) || tickets[0]
  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase()
    return [...tickets]
      .filter(ticket => statusFilter === 'All tickets' || ticket.status === statusFilter)
      .filter(ticket => priorityFilter === 'All priorities' || ticket.priority === priorityFilter)
      .filter(ticket => !query || [ticket.id, ticket.title, ticket.requester, ticket.category].some(value => value.toLowerCase().includes(query)))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [tickets, search, statusFilter, priorityFilter])

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    progress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  }

  function updateTicket(id, changes) {
    const now = new Date().toISOString()
    setTickets(current => current.map(ticket => ticket.id === id ? { ...ticket, ...changes, updatedAt: now } : ticket))
  }

  function createTicket(event) {
    event.preventDefault()
    const nextNumber = Math.max(1048, ...tickets.map(t => Number(t.id.split('-')[1]) || 0)) + 1
    const now = new Date().toISOString()
    const ticket = {
      ...form,
      id: `TKT-${nextNumber}`,
      status: 'Open',
      createdAt: now,
      updatedAt: now,
    }
    setTickets(current => [ticket, ...current])
    setSelectedId(ticket.id)
    setShowCreate(false)
    setMobileDetail(true)
    setForm({ title: '', description: '', category: 'Technical Issue', priority: 'Medium', requester: '', email: '' })
    setNotice(`Ticket ${ticket.id} created successfully`)
    window.setTimeout(() => setNotice(''), 3200)
  }

  function chooseTicket(id) {
    setSelectedId(id)
    setMobileDetail(true)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><LifeBuoy size={22} strokeWidth={2.4} /></div>
          <div><strong>Support<span>Desk</span></strong><small>HELP CENTER</small></div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <button className="nav-item active"><LayoutDashboard size={18} /> Overview</button>
          <button className="nav-item" onClick={() => { setStatusFilter('All tickets'); setMobileDetail(false) }}><Ticket size={18} /> All tickets <span className="nav-count">{counts.all}</span></button>
          <button className="nav-item" onClick={() => setStatusFilter('Open')}><Inbox size={18} /> Open <span className="nav-count">{counts.open}</span></button>
          <button className="nav-item" onClick={() => setStatusFilter('In Progress')}><Clock3 size={18} /> In progress <span className="nav-count">{counts.progress}</span></button>
          <button className="nav-item" onClick={() => setStatusFilter('Resolved')}><CheckCircle2 size={18} /> Resolved <span className="nav-count">{counts.resolved}</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={18} /></div>
            <strong>Need a hand?</strong>
            <p>Keep track of requests and get things sorted.</p>
            <button onClick={() => setShowCreate(true)}>Create a ticket <span>↗</span></button>
          </div>
          <div className="profile">
            <div className="avatar avatar-purple">SM</div>
            <div className="profile-info"><strong>Support Manager</strong><small>Administrator</small></div>
            <ChevronDown size={16} className="profile-chevron" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
          <div className="topbar-right">
            <span className="system-status"><span className="status-dot"></span> All systems operational</span>
            <div className="avatar avatar-purple">SM</div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow">MONDAY, OCTOBER 19, 2026</div>
              <h1>Good evening <span className="wave">✦</span></h1>
              <p>Here’s what’s happening with your support tickets today.</p>
            </div>
            <button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={18} /> Create ticket</button>
          </section>

          <section className="stats-grid" aria-label="Ticket summary">
            <StatCard label="Total tickets" value={counts.all} note="Across all requests" icon={<Ticket size={19} />} tone="blue" />
            <StatCard label="Open tickets" value={counts.open} note="Waiting for a response" icon={<Inbox size={19} />} tone="orange" />
            <StatCard label="In progress" value={counts.progress} note="Currently being handled" icon={<Clock3 size={19} />} tone="purple" />
            <StatCard label="Resolved" value={counts.resolved} note="Successfully completed" icon={<CheckCircle2 size={19} />} tone="green" />
          </section>

          <section className="tickets-panel">
            <div className="panel-heading">
              <div><h2>Support tickets</h2><p>Manage and follow up on incoming requests.</p></div>
              <button className="secondary-button filter-toggle" onClick={() => { setStatusFilter('All tickets'); setPriorityFilter('All priorities'); setSearch('') }}><SlidersHorizontal size={16} /> Reset filters</button>
            </div>
            <div className="toolbar">
              <label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." aria-label="Search tickets" /><kbd>⌘ K</kbd></label>
              <div className="filter-wrap"><Filter size={15} /><select aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All tickets</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="filter-wrap"><select aria-label="Filter by priority" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}><option>All priorities</option>{priorities.map(p => <option key={p}>{p}</option>)}</select><ChevronDown size={14} /></div>
            </div>

            <div className="ticket-layout">
              <div className={`ticket-list ${mobileDetail ? 'hide-mobile' : ''}`}>
                <div className="list-summary"><span>{filteredTickets.length} tickets</span><span>Recently updated <ChevronDown size={13} /></span></div>
                {filteredTickets.length ? filteredTickets.map(ticket => (
                  <button key={ticket.id} className={`ticket-row ${selectedId === ticket.id ? 'selected' : ''}`} onClick={() => chooseTicket(ticket.id)}>
                    <div className="ticket-row-top"><span className="ticket-id">{ticket.id}</span><span className={`priority-tag ${statusClass(ticket.priority)}`}>{priorityIcon(ticket.priority)} {ticket.priority}</span></div>
                    <strong className="ticket-title">{ticket.title}</strong>
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="ticket-row-bottom"><span className={`status-pill ${statusClass(ticket.status)}`}><span></span>{ticket.status}</span><span className="ticket-date">{dateLabel(ticket.updatedAt)}</span></div>
                  </button>
                )) : <div className="empty-state"><Search size={24} /><strong>No tickets found</strong><p>Try a different search or reset your filters.</p></div>}
              </div>

              {selected ? <section className={`detail-panel ${mobileDetail ? 'show-mobile' : ''}`}>
                <div className="detail-mobile-back"><button onClick={() => setMobileDetail(false)}>← Back to tickets</button></div>
                <div className="detail-topline"><span className="ticket-id">{selected.id}</span><span className="created-label">Created {dateLabel(selected.createdAt)}</span><button className="icon-button" aria-label="More options" onClick={() => setNotice('Use the controls below to update this ticket.')}><span>•••</span></button></div>
                <h2 className="detail-title">{selected.title}</h2>
                <div className="detail-tags"><span className={`status-pill ${statusClass(selected.status)}`}><span></span>{selected.status}</span><span className={`priority-tag ${statusClass(selected.priority)}`}>{priorityIcon(selected.priority)} {selected.priority} priority</span><span className="category-tag">{selected.category}</span></div>
                <div className="detail-divider"></div>
                <h3 className="section-label">DESCRIPTION</h3>
                <p className="detail-description">{selected.description}</p>
                <div className="requester-card">
                  <div className="avatar avatar-peach">{selected.requester.split(' ').map(part => part[0]).join('').replace('.', '').slice(0, 2).toUpperCase()}</div>
                  <div className="requester-info"><strong>{selected.requester}</strong><span>{selected.email}</span><small>Ticket requester</small></div>
                  <button className="icon-button" title="Requester details" onClick={() => setNotice(`Requester: ${selected.requester} · ${selected.email}`)}>↗</button>
                </div>
                <div className="detail-divider"></div>
                <h3 className="section-label">TICKET PROPERTIES</h3>
                <div className="property-row"><label htmlFor="status-select">Status</label><select id="status-select" className={`property-select ${statusClass(selected.status)}`} value={selected.status} onChange={e => updateTicket(selected.id, { status: e.target.value })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="property-row"><label htmlFor="priority-select">Priority</label><select id="priority-select" className="property-select" value={selected.priority} onChange={e => updateTicket(selected.id, { priority: e.target.value })}>{priorities.map(p => <option key={p}>{p}</option>)}</select></div>
                <div className="property-row"><label htmlFor="category-select">Category</label><select id="category-select" className="property-select" value={selected.category} onChange={e => updateTicket(selected.id, { category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="activity-box"><div className="activity-heading"><span><Activity size={16} /> Activity</span><span className="activity-count">Latest update</span></div><div className="activity-event"><div className="activity-marker"><CheckCircle2 size={15} /></div><div><p><strong>Ticket updated</strong> by Support Manager</p><span>{timeLabel(selected.updatedAt)}</span></div></div><div className="activity-event"><div className="activity-marker muted"><Plus size={15} /></div><div><p>Ticket was created</p><span>{timeLabel(selected.createdAt)}</span></div></div></div>
                <div className="detail-footer"><span><span className="status-dot"></span> Changes save automatically</span><button className="primary-button small" onClick={() => { updateTicket(selected.id, { status: 'Resolved' }); setNotice('Ticket marked as resolved') }}><CheckCircle2 size={16} /> Mark resolved</button></div>
              </section> : <div className="detail-panel no-selection"><Ticket size={28} /><strong>Select a ticket</strong><p>Choose a ticket from the list to see its details.</p></div>}
            </div>
          </section>
          <footer className="footer"><span>© 2026 SupportDesk</span><span>Made for better support <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>

      {notice && <div className="toast" role="status"><CheckCircle2 size={17} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}

      {showCreate && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowCreate(false) }}>
        <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
          <div className="modal-heading"><div><span className="modal-icon"><Plus size={19} /></span><div><h2 id="create-title">Create a ticket</h2><p>Tell us what you need help with.</p></div></div><button className="icon-button" onClick={() => setShowCreate(false)} aria-label="Close"><X size={19} /></button></div>
          <form onSubmit={createTicket}>
            <label className="form-field">Ticket title <span>*</span><input required maxLength="100" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Unable to access my account" /></label>
            <label className="form-field">Description <span>*</span><textarea required rows="4" maxLength="1000" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue and what you've tried..." /></label>
            <div className="form-two-col"><label className="form-field">Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label className="form-field">Priority<select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>{priorities.map(p => <option key={p}>{p}</option>)}</select></label></div>
            <div className="form-two-col"><label className="form-field">Your name <span>*</span><input required value={form.requester} onChange={e => setForm({ ...form, requester: e.target.value })} placeholder="Full name" /></label><label className="form-field">Email address <span>*</span><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label></div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowCreate(false)}>Cancel</button><button type="submit" className="primary-button"><Send size={16} /> Submit ticket</button></div>
          </form>
        </section>
      </div>}
    </div>
  )
}

function StatCard({ label, value, note, icon, tone }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></article>
}