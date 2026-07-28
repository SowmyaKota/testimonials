(function () {
  const container = document.getElementById('testimonial-widget');
  if (!container) {
    console.error('[testimonial-widget] No element with id="testimonial-widget" found.');
    return;
  }

  const apiBase = container.dataset.api || '';
  const accent = container.dataset.accent || '#4f46e5';

  if (!apiBase) {
    container.innerHTML =
      '<p style="color:#b91c1c;font-family:sans-serif;">testimonial-widget: missing data-api attribute.</p>';
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    .tw-root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 760px; margin: 0 auto; }
    .tw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .tw-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #fff; }
    .tw-stars { color: ${accent}; font-size: 15px; margin-bottom: 8px; }
    .tw-text { color: #374151; font-size: 14px; line-height: 1.5; margin: 0 0 12px; }
    .tw-name { font-weight: 600; font-size: 14px; color: #111827; }
    .tw-company { font-size: 13px; color: #6b7280; }
    .tw-loading, .tw-empty, .tw-error { text-align: center; color: #6b7280; padding: 24px; font-size: 14px; }
    .tw-more-btn { display: block; margin: 16px auto 0; padding: 8px 16px; border: 1px solid ${accent}; color: ${accent}; background: transparent; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .tw-more-btn:hover { background: ${accent}; color: #fff; }
  `;
  document.head.appendChild(style);

  container.classList.add('tw-root');
  container.innerHTML = '<div class="tw-loading">Loading testimonials…</div>';

  let page = 1;
  const limit = 6;

  function starString(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  function renderCard(t) {
    const card = document.createElement('div');
    card.className = 'tw-card';
    card.innerHTML = `
      <div class="tw-stars">${starString(t.rating)}</div>
      <p class="tw-text">"${escapeHtml(t.testimonial_text)}"</p>
      <div class="tw-name">${escapeHtml(t.name)}</div>
      ${t.company ? `<div class="tw-company">${escapeHtml(t.company)}</div>` : ''}
    `;
    return card;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadPage(pageNum) {
    try {
      const res = await fetch(`${apiBase}/api/wall?page=${pageNum}&limit=${limit}`);
      if (!res.ok) throw new Error('Request failed');
      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  let grid;

  async function init() {
    try {
      const data = await loadPage(page);

      if (data.testimonials.length === 0) {
        container.innerHTML = '<div class="tw-empty">No testimonials yet.</div>';
        return;
      }

      container.innerHTML = '';
      grid = document.createElement('div');
      grid.className = 'tw-grid';
      container.appendChild(grid);

      data.testimonials.forEach((t) => grid.appendChild(renderCard(t)));

      if (data.hasMore) {
        appendMoreButton();
      }
    } catch (err) {
      container.innerHTML =
        '<div class="tw-error">Couldn\'t load testimonials right now.</div>';
    }
  }

  function appendMoreButton() {
    const existing = container.querySelector('.tw-more-btn');
    if (existing) existing.remove();

    const btn = document.createElement('button');
    btn.className = 'tw-more-btn';
    btn.textContent = 'Show more';
    btn.onclick = async () => {
      btn.textContent = 'Loading…';
      btn.disabled = true;
      page += 1;
      try {
        const data = await loadPage(page);
        data.testimonials.forEach((t) => grid.appendChild(renderCard(t)));
        if (data.hasMore) {
          btn.textContent = 'Show more';
          btn.disabled = false;
        } else {
          btn.remove();
        }
      } catch {
        btn.textContent = 'Failed - try again';
        btn.disabled = false;
      }
    };
    container.appendChild(btn);
  }

  init();
})();
