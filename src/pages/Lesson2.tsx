import { LessonLayout } from '../components/LessonLayout'
import { Blocks } from '../content/Blocks'
import { lessonBody } from '../data/lessons'

export default function Lesson2() {
  return (
    <LessonLayout slug="bai-2" wide>
      <Blocks blocks={lessonBody('bai-2')} />
    </LessonLayout>
  )
}
