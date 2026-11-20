import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Lesson5() {
  return (
    <>
      <Seo slug="bai-5" />
      <h1>{getPage('bai-5').title}</h1>
    </>
  )
}
