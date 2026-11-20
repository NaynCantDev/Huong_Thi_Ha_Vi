import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Projects() {
  return (
    <>
      <Seo slug="du-an" />
      <h1>{getPage('du-an').title}</h1>
    </>
  )
}
