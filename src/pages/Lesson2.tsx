import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Lesson2() {
  return (
    <>
      <Seo slug="bai-2" />
      <h1>{getPage('bai-2').title}</h1>
    </>
  )
}
