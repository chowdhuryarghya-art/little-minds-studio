import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { FormEvent } from 'react'

const CONTACT_EMAIL = 'chowdhuryarghy@gmail.com'
const FEEDBACK_TYPES = ['General feedback', 'Report a problem', 'Suggestion', 'Other']

export default function About() {
  const [status, setStatus] = useState('')

  const sendFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const type = String(data.get('type'))
    const name = String(data.get('name') ?? '').trim()
    const replyEmail = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const subject = `[Little Minds Studio] ${type}`
    const body = [
      `Type: ${type}`,
      name ? `Name: ${name}` : '',
      replyEmail ? `Reply email: ${replyEmail}` : '',
      '',
      message,
    ].join('\n')

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('Your email app should open with the message ready. Please review it and press Send there.')
    form.reset()
  }

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
      <form className="feedback-form" onSubmit={sendFeedback}>
        <h2>Send feedback</h2>
        <p className="muted">
          This form opens your email app with a draft addressed to us. Your message is not sent
          until you review it and choose Send.
        </p>
        <label htmlFor="feedback-type">What is your message about?</label>
        <select id="feedback-type" name="type" defaultValue={FEEDBACK_TYPES[0]}>
          {FEEDBACK_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>

        <label htmlFor="feedback-name">Your name (optional)</label>
        <input id="feedback-name" name="name" type="text" autoComplete="name" maxLength={100} />

        <label htmlFor="feedback-email">Your email (optional, if you would like a reply)</label>
        <input
          id="feedback-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="you@example.com"
        />

        <label htmlFor="feedback-message">Feedback or problem description</label>
        <textarea
          id="feedback-message"
          name="message"
          rows={6}
          maxLength={2000}
          required
          placeholder="Tell us what happened or what you think could be improved."
        />
        <p className="feedback-safety">
          For adults only: please do not include a child&apos;s name, age, school, contact details,
          photos, or other personal information.
        </p>
        <button type="submit" className="btn">Open email app</button>
        <p className="feedback-status" role="status" aria-live="polite">{status}</p>
      </form>
      <p>
        <Link to="/privacy">Privacy policy</Link>
      </p>
    </section>
  )
}
