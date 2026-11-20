import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Home() {
  return (
    <>
      <Seo slug="gioi-thieu" />
      <h1>{getPage('gioi-thieu').title}</h1>
    </>
  )
}
