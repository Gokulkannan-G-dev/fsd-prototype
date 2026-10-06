import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

const GROUPS = [
  { type: 'helpline', title: 'Helplines' },
  { type: 'legal', title: 'Laws and rights' },
  { type: 'guide', title: 'Guides' },
];

export default function Resources() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.resources().then(setItems).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="page">
      <h1>Resources</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {GROUPS.map((g) => {
        const list = items.filter((i) => i.type === g.type);
        if (!list.length) return null;
        return (
          <section key={g.type}>
            <h2>{g.title}</h2>
            <div className="list">
              {list.map((r) => (
                <article key={r.id} className="list-item">
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.description}</p>
                    {r.link && <a href={r.link} target="_blank" rel="noreferrer">Visit website</a>}
                  </div>
                  {r.contact && <a className="phone" href={`tel:${r.contact}`}>{r.contact}</a>}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
