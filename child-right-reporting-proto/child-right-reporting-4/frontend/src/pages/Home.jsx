import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>If a child is not safe, tell someone.</h1>
        <p className="lead">
          Report abuse, neglect, child labour or any violation of a child's rights. You can stay
          anonymous, and you get a tracking ID to follow what happens next.
        </p>
        <div className="row">
          <Link to="/report" className="btn btn-primary btn-lg">Report a concern</Link>
          <Link to="/track" className="btn btn-outline btn-lg">Track a report</Link>
        </div>
        <div className="alert alert-urgent">
          A child in immediate danger? Call <strong>112</strong> (police) or <strong>1098</strong> (Childline) now.
        </div>
      </section>

      <section className="split">
        <div>
          <h2>How it works</h2>
          <ol className="steps">
            <li><strong>Tell us what you saw.</strong> Describe what happened, where, and how urgent it feels.</li>
            <li><strong>Save your tracking ID.</strong> It is the only way to check progress if you stay anonymous.</li>
            <li><strong>A reviewer takes it up.</strong> Reports go to trained reviewers who update the status as action is taken.</li>
          </ol>
        </div>
        <div>
          <h2>What you can report</h2>
          <ul className="plain">
            <li>Physical, emotional or sexual abuse</li>
            <li>Neglect or abandonment</li>
            <li>Child labour and trafficking</li>
            <li>Child marriage</li>
            <li>Denial of education</li>
            <li>Bullying and online harm</li>
          </ul>
          <p><Link to="/awareness">Learn the warning signs</Link></p>
        </div>
      </section>
    </div>
  );
}
