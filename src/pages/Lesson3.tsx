import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Lesson3() {
  return (
    <>
      <Seo slug="bai-3" />
      <h1>{getPage('bai-3').title}</h1>
    </>
  )
}
