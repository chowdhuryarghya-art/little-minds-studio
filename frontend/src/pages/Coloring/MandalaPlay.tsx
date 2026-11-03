import GeneratedColoringPage from '../../components/GeneratedColoringPage.tsx'
import { generateMandala } from '../../games/mandala/mandala.ts'

export default function MandalaPlay() {
  return <GeneratedColoringPage title="Mandala Maker" noun="Picture" generate={generateMandala} />
}
