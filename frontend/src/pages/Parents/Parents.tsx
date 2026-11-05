import { Link } from 'react-router-dom'

export default function Parents() {
  return (
    <section className="page narrow">
      <h1>For Parents &amp; Teachers</h1>
      <p>
        Everything children play on Little Minds Studio is free. There are no accounts, no
        purchases and no ads inside the games. Activities are designed for children ages 2–12;
        this page is for parents, guardians, and teachers.
      </p>

      <h2>What children can explore</h2>
      <ul>
        <li>
          <Link to="/coloring">Coloring and Drawing</Link>: color recognition, creative expression,
          focus, and fine motor practice.
        </li>
        <li>
          <Link to="/puzzles">Puzzles</Link>: memory, visual scanning, sequencing, and spatial
          problem-solving.
        </li>
        <li>
          <Link to="/learning/early-years">Early Learning</Link>: first-letter word matching across the
          alphabet, numbers 1–100, and no-repeat story, object-counting, and feelings activities for
          ages 2–5.
        </li>
        <li>
          <Link to="/learning">Learning Zone</Link>: math practice, English vocabulary, Hindi and
          Bengali word exploration, and Science Explorer quizzes about animals, plants, space, the
          human body, and Earth. Science Explorer includes short learning cards, three quiz levels,
          and explanations after answers.
        </li>
        <li>
          <Link to="/brain-games">Brain Games</Link>: chess, Sudoku, word building, codebreaking,
          patterns, riddles, logic puzzles, and deduction challenges.
        </li>
      </ul>

      <h2>Age guide</h2>
      <ul>
        <li>
          Little Explorers (2–5): short, simple activities, including Little Thinkers. An adult can
          help younger children navigate and enjoy the activities.
        </li>
        <li>Curious Minds (5–9): growing vocabulary, number skills, and puzzles.</li>
        <li>Creative Minds (10–12): more involved logic, strategy, and problem-solving challenges.</li>
      </ul>
      <p>Age ranges are general guides; children can choose activities that suit their interests and skills.</p>

      <h2>Privacy and safety</h2>
      <p>
        Children do not need an account. Drawings and coloring progress are stored in the browser
        on the device. English, Hindi, and Bengali word lookups and Bengali speech may use
        third-party services to provide definitions, translations, or audio. Please avoid entering
        personal information. Read the <Link to="/privacy">privacy policy</Link> for details.
      </p>

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
