import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function Dashboard() {
  const [tab, setTab] = useState('pending');
  const [items, setItems] = useState([]);
  const [loadState, setLoadState] = useState('loading'); 
  const [actioningId, setActioningId] = useState(null);

  const load = useCallback(async () => {
    setLoadState('loading');
    try {
      const data = await api.listModeration(tab);
      setItems(data);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDecision(id, decision) {
    setActioningId(id);
    try {
      if (decision === 'approve') await api.approve(id);
      else await api.reject(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(`Failed to ${decision}: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="page">
      <h1>Moderation dashboard</h1>
      <p className="subtitle">Review testimonials before they go live on your wall.</p>

      <div className="tabs">
        {TABS.map((t) => (
          <div
            key={t.key}
            className={`tab ${tab === t.key ? 'active' : ''}`}
            data-status={t.key}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {loadState === 'loading' && <div className="loading-state">Loading…</div>}
      {loadState === 'error' && (
        <div className="error-state">
          Couldn't load testimonials. <button className="btn secondary" onClick={load}>Retry</button>
        </div>
      )}
      {loadState === 'ready' && items.length === 0 && (
        <div className="empty-state">Nothing here yet.</div>
      )}

      {loadState === 'ready' &&
        items.map((t) => (
          <div className="card" data-status={tab} key={t.id}>
            <div className="card-row">
              <div>
                <div className="stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p>{t.testimonial_text}</p>
                <div className="card-meta">
                  <strong>{t.name}</strong>
                  {t.company ? ` · ${t.company}` : ''} · {t.email}
                </div>
              </div>
              {tab === 'pending' && (
                <div className="card-actions">
                  <button
                    className="btn approve"
                    disabled={actioningId === t.id}
                    onClick={() => handleDecision(t.id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn danger"
                    disabled={actioningId === t.id}
                    onClick={() => handleDecision(t.id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
