import { Link } from 'react-router-dom'

export default function Parents() {
  return (
    <section className="page narrow">
      <h1>For Parents &amp; Teachers</h1>
      <p>
        Everything children play on Little Minds Studio is free. There are no accounts, no
        purchases and no ads inside the games. This area is for adults.
      </p>

      <h2>Learning goals</h2>
      <ul>
        <li>
          <Link to="/coloring">Coloring</Link>: color recognition, fine motor control, focus.
        </li>
        <li>
          <Link to="/puzzles/memory">Memory Match</Link>: concentration and visual memory.
        </li>
        <li>
          <Link to="/learning/math">Math Fun</Link>: number facts, from adding to times tables.
        </li>
      </ul>

      <h2>Age guide</h2>
      <ul>
        <li>Little Explorers (2–5): short, simple activities. Sit with your child if you can.</li>
        <li>Curious Minds (5–9): more pieces and number practice.</li>
        <li>Creative Minds (10–12): bigger challenges.</li>
      </ul>

      <h2>Printable worksheets and resources</h2>
      <p>Printable packs and teacher resources are coming soon.</p>

      <h2>More</h2>
      <ul>
        <li>
          <Link to="/privacy">Privacy policy</Link>
        </li>
        <li>
          <Link to="/about">About and contact</Link>
        </li>
      </ul>
    </section>
  )
}
