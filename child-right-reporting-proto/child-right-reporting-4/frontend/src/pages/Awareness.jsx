const SECTIONS = [
  {
    title: 'Signs of physical abuse',
    items: ['Frequent injuries with unclear explanations', 'Flinching when touched or approached', 'Wearing long sleeves in hot weather', 'Fear of going home'],
  },
  {
    title: 'Signs of neglect',
    items: ['Always hungry, tired or poorly dressed', 'Untreated illness or injury', 'Often alone or unsupervised', 'Missing school without reason'],
  },
  {
    title: 'Signs of emotional harm',
    items: ['Sudden changes in mood or behaviour', 'Withdrawal from friends and activities', 'Very low confidence', 'Regression, such as bed-wetting in older children'],
  },
  {
    title: 'Signs of child labour',
    items: ['Working during school hours', 'Doing heavy or hazardous tasks', 'Visible exhaustion', 'Not enrolled in school'],
  },
];

export default function Awareness() {
  return (
    <div className="page">
      <h1>Know the signs</h1>
      <p className="lead">
        One sign alone does not prove harm. A pattern, or a child who tells you something, is
        reason enough to act.
      </p>

      <div className="grid-2">
        {SECTIONS.map((s) => (
          <section key={s.title} className="panel">
            <h2>{s.title}</h2>
            <ul className="plain">{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </section>
        ))}
      </div>

      <section className="split">
        <div>
          <h2>If a child tells you something</h2>
          <ol className="steps">
            <li>Stay calm and listen without interrupting.</li>
            <li>Tell them it is not their fault and that you believe them.</li>
            <li>Do not promise to keep it secret. Explain you will get help.</li>
            <li>Do not question them in detail. Report what they said in their words.</li>
          </ol>
        </div>
        <div>
          <h2>Every child has the right to</h2>
          <ul className="plain">
            <li>Life, survival and healthy development</li>
            <li>Protection from abuse, exploitation and neglect</li>
            <li>Education</li>
            <li>Be heard in matters that affect them</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
