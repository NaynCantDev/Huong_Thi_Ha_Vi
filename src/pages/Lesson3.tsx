import { DynamicsSwitch, PROMPT_LEVELS } from '../components/DynamicsSwitch'
import { Figure } from '../components/Figure'
import { LessonLayout } from '../components/LessonLayout'
import { BlockView, Blocks } from '../content/Blocks'
import { blockPlain, findBlock } from '../content/group'
import type { Block } from '../content/types'
import { lessonBody } from '../data/lessons'
import styles from './Lesson3.module.css'

const noImage = () => null

function render(blocks: Block[]) {
  return blocks.map((b, i) => <BlockView key={i} block={b} index={i} renderImage={noImage} />)
}

/** Split a run of blocks into tasks, each starting at a block whose text starts with `marker`. */
function splitTasks(blocks: Block[], marker: RegExp): { title: Block; rest: Block[] }[] {
  const tasks: { title: Block; rest: Block[] }[] = []
  for (const b of blocks) {
    if (marker.test(blockPlain(b).trim())) tasks.push({ title: b, rest: [] })
    else tasks[tasks.length - 1]?.rest.push(b)
  }
  return tasks
}

/** Three [label, prompt list, (image)] groups from a task's blocks. */
function splitLevels(blocks: Block[]): Block[][] {
  const levels: Block[][] = []
  for (const b of blocks) {
    if (/^[abc][.)]\s*Prompt/.test(blockPlain(b).trim())) levels.push([b])
    else levels[levels.length - 1]?.push(b)
  }
  return levels
}

export default function Lesson3() {
  const body = lessonBody('bai-3')
  const s2 = findBlock(body, '2. Cho mỗi tác vụ')
  const s3 = findBlock(body, '3. Thử nghiệm')
  const s4 = findBlock(body, '4. Phân tích')

  const intro = body.slice(0, s2)
  const promptTasks = splitTasks(body.slice(s2 + 1, s3), /^-\s*Tác vụ/)
  const trialTasks = splitTasks(body.slice(s3 + 1, s4), /^-\s*Tác vụ/)
  const outro = body.slice(s4)

  return (
    <LessonLayout slug="bai-3" wide>
      <div className={styles.prose}>
        <Blocks blocks={intro} />
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>{render([body[s2]])}</div>
        <div className={styles.taskGrid}>
          {promptTasks.map((t, i) => (
            <div key={i} className={styles.task}>
              <div className={styles.taskTitle}>{render([t.title])}</div>
              <ol className={styles.levels}>
                {splitLevels(t.rest).map((lv, j) => (
                  <li key={j} className={styles.level} data-mark={PROMPT_LEVELS[j]?.mark}>
                    <span className={styles.mark} aria-hidden="true">
                      {PROMPT_LEVELS[j]?.mark}
                    </span>
                    <div>{render(lv)}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>{render([body[s3]])}</div>
        {trialTasks.map((t, i) => {
          const levels = splitLevels(t.rest)
          return (
            <DynamicsSwitch
              key={i}
              name={blockPlain(t.title).replace(/^-\s*/, '')}
              title={render([t.title])}
              note={['E4', 'G4', 'C5'][i]}
              panels={levels.map((lv, j) => {
                const text = lv.filter((b) => b.type !== 'image')
                const images = lv.filter((b) => b.type === 'image')
                return (
                  <div key={j} className={styles.trial}>
                    <div className={styles.trialText}>{render(text)}</div>
                    <div>
                      {images.map((img) =>
                        img.type === 'image' ? (
                          <Figure key={img.key} imageKey={img.key} alt={`Kết quả prompt ${PROMPT_LEVELS[j].label.toLowerCase()}`} />
                        ) : null,
                      )}
                    </div>
                  </div>
                )
              })}
            />
          )
        })}
      </section>

      <div className={styles.prose}>
        <Blocks blocks={outro} />
      </div>
    </LessonLayout>
  )
}
