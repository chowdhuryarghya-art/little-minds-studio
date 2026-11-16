import { Link } from 'react-router-dom'

export default function ComingSoon({ title }: { title: string }) {
  return (
    <section className="page narrow center">
      <h1>{title}</h1>
      <p>We couldn&apos;t find that page. It may have moved or the address may be incorrect.</p>
      <Link className="btn" to="/">
        Back home
      </Link>
    </section>
  )
}
