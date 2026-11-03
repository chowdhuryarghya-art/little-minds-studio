import { Link } from 'react-router-dom'

export default function LearningList() {
  return (
    <section className="page">
      <h1 className="hero-title">Learning Zone</h1>
      <div className="tile-grid three">
        <Link to="/learning/math" className="tile" style={{ background: '#52b788' }}>
          <strong>Math Fun</strong>
          <span>Add, subtract, and multiply</span>
        </Link>
        <Link to="/learning/english" className="tile" style={{ background: '#ffb703' }}>
          <strong>English Fun</strong>
          <span>Dictionary, phonetics, audio, and words</span>
        </Link>
        <Link to="/learning/hindi" className="tile" style={{ background: '#fb8500' }}>
          <strong>हिन्दी सीखें · Hindi Fun</strong>
          <span>शब्द, उच्चारण, अर्थ और वाक्य रचना</span>
        </Link>
        <Link to="/learning/bengali" className="tile" style={{ background: '#06d6a0' }}>
          <strong>বাংলা শিখুন · Bengali Fun</strong>
          <span>শব্দার্থ, উচ্চারণ, সমার্থক ও বাক্য গঠন</span>
        </Link>
      </div>
    </section>
  )
}
