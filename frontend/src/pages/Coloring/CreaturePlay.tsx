import GeneratedColoringPage from '../../components/GeneratedColoringPage.tsx'
import { generateCreature } from '../../games/creature/creature.ts'

export default function CreaturePlay() {
  return (
    <GeneratedColoringPage
      title="Creature Maker"
      noun="Creature"
      generate={generateCreature}
      defaultAge="explorers"
    />
  )
}
