import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Lesson4() {
  return (
    <>
      <Seo slug="bai-4" />
      <h1>{getPage('bai-4').title}</h1>
    </>
  )
}
