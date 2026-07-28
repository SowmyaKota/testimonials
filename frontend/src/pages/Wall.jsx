import { useEffect, useState } from 'react';
import { api } from '../api';

function noteStyle(id) {
  const noteClass = `note-${(id % 5) + 1}`;
  const tilt = ((id % 7) - 3) * 1.1; 
  return { noteClass, style: { transform: `rotate(${tilt}deg)` } };
}

export default function Wall() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadState, setLoadState] = useState('loading'); 
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadFirstPage() {
    setLoadState('loading');
    try {
      const data = await api.getWall(1, 6);
      setItems(data.testimonials);
      setHasMore(data.hasMore);
      setPage(1);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }

  useEffect(() => {
    loadFirstPage();
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await api.getWall(nextPage, 6);
      setItems((prev) => [...prev, ...data.testimonials]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="page">
      <h1>What our customers say</h1>
      <p className="subtitle">Real feedback from real customers.</p>

      {loadState === 'loading' && <div className="loading-state">Loading testimonials…</div>}
      {loadState === 'error' && <div className="error-state">Couldn't load testimonials.</div>}
      {loadState === 'ready' && items.length === 0 && (
        <div className="empty-state">No testimonials yet - check back soon.</div>
      )}

      {loadState === 'ready' && items.length > 0 && (
        <>
          <div className="wall-grid">
            {items.map((t) => {
              const { noteClass, style } = noteStyle(t.id);
              return (
                <div className={`note-card ${noteClass}`} key={t.id} style={style}>
                  <div className="stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                  <p>"{t.testimonial_text}"</p>
                  <div className="card-meta">
                    <strong>{t.name}</strong>
                    {t.company ? ` · ${t.company}` : ''}
                  </div>
                </div>
              );
            })}
          </div>
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button className="btn secondary" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading…' : 'Show more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
