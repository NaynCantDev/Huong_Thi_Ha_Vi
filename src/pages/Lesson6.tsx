import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Lesson6() {
  return (
    <>
      <Seo slug="bai-6" />
      <h1>{getPage('bai-6').title}</h1>
    </>
  )
}
