import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Lesson1() {
  return (
    <>
      <Seo slug="bai-1" />
      <h1>{getPage('bai-1').title}</h1>
    </>
  )
}
