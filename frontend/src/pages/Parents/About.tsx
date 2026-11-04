import { Link } from 'react-router-dom'

const CONTACT_EMAIL = 'chowdhuryarghy@gmail.com'

export default function About() {
  return (
    <section className="page narrow">
      <h1>About and contact</h1>
      <p>
        Little Minds Studio is a free learning and creativity site for children aged 2–12:
        Play · Learn · Create.
      </p>
      <h2>Contact</h2>
      <p>
        Parents, guardians, and teachers can send feedback or report a problem. We usually reply
        within a few working days.
      </p>
      <p>
        Email us directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
      <p>
        <Link to="/privacy">Privacy policy</Link>
      </p>
    </section>
  )
}
