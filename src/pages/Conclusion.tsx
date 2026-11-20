import { Seo } from '../components/Seo'
import { getPage } from '../data/pages'

export default function Conclusion() {
  return (
    <>
      <Seo slug="tong-ket" />
      <h1>{getPage('tong-ket').title}</h1>
    </>
  )
}
