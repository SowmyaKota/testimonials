import { useState } from 'react';
import { api } from '../api';

const initialForm = {
  name: '',
  email: '',
  company: '',
  testimonial_text: '',
  rating: 5,
  photo_url: '',
};

export default function SubmissionForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); 
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.testimonial_text.trim()) errs.testimonial_text = 'Please share a few words.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    try {
      await api.submitTestimonial(form);
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  if (status === 'success') {
    return (
      <div className="page">
        <div className="banner success">
          Thank you! Your testimonial has been submitted and is awaiting review.
        </div>
        <button className="btn secondary" onClick={() => setStatus('idle')}>
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Share your experience</h1>
      <p className="subtitle">We'd love to hear what you think.</p>

      {status === 'error' && <div className="banner error">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Name *</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} />
          {fieldErrors.name && <div className="error-text">{fieldErrors.name}</div>}
        </div>

        <div className="field">
          <label>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
          {fieldErrors.email && <div className="error-text">{fieldErrors.email}</div>}
        </div>

        <div className="field">
          <label>Company (optional)</label>
          <input value={form.company} onChange={(e) => update('company', e.target.value)} />
        </div>

        <div className="field">
          <label>Your testimonial *</label>
          <textarea
            value={form.testimonial_text}
            onChange={(e) => update('testimonial_text', e.target.value)}
          />
          {fieldErrors.testimonial_text && (
            <div className="error-text">{fieldErrors.testimonial_text}</div>
          )}
        </div>

        <div className="field">
          <label>Rating *</label>
          <div className="star-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`star-btn ${n <= form.rating ? 'filled' : ''}`}
                onClick={() => update('rating', n)}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            <span className="star-picker-label">{form.rating} / 5</span>
          </div>
        </div>

        <div className="field">
          <label>Photo URL (optional)</label>
          <input
            value={form.photo_url}
            onChange={(e) => update('photo_url', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <button className="btn" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit testimonial'}
        </button>
      </form>
    </div>
  );
}
