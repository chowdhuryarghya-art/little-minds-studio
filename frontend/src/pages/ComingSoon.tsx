import { Link } from 'react-router-dom'

export default function ComingSoon({ title }: { title: string }) {
  return (
    <section className="page narrow center">
      <h1>{title}</h1>
      <p>This area is coming soon.</p>
      <Link className="btn" to="/">
        Back home
      </Link>
    </section>
  )
}
