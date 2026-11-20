import { Fragment, type ReactNode } from 'react'
import type { Block, Inline } from './types'
import { Figure } from '../components/Figure'
import styles from './Blocks.module.css'

export type ImageRenderer = (block: Extract<Block, { type: 'image' }>, index: number) => ReactNode

type Props = {
  blocks: Block[]
  /** Override how image blocks render (e.g. with a lightbox figure). */
  renderImage?: ImageRenderer
  className?: string
}

export function Blocks({ blocks, renderImage = defaultImage, className }: Props) {
  return (
    <div className={[styles.prose, className].filter(Boolean).join(' ')}>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} index={i} renderImage={renderImage} />
      ))}
    </div>
  )
}

export function BlockView({ block, index, renderImage }: { block: Block; index: number; renderImage: ImageRenderer }) {
  const align = 'align' in block && block.align === 'center' ? styles.center : undefined
  switch (block.type) {
    case 'heading': {
      const Tag = `h${Math.min(block.level + 1, 4)}` as 'h2' | 'h3' | 'h4'
      // Source h1 → h2: the page component owns the single <h1>.
      return (
        <Tag id={block.id} className={[styles[`h${block.level}`], align].filter(Boolean).join(' ')}>
          <Inlines nodes={block.c} />
        </Tag>
      )
    }
    case 'p':
      return (
        <p className={align}>
          <Inlines nodes={block.c} />
        </p>
      )
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag start={block.start} className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i}>
              {item.length === 1 && item[0].type === 'p' ? (
                <Inlines nodes={item[0].c} />
              ) : (
                item.map((b, j) => <BlockView key={j} block={b} index={j} renderImage={renderImage} />)
              )}
            </li>
          ))}
        </Tag>
      )
    }
    case 'table':
      return <Table head={block.head} rows={block.rows} />
    case 'image':
      return <>{renderImage(block, index)}</>
  }
}

export function Table({ head, rows }: { head: Inline[][]; rows: Inline[][][] }) {
  return (
    <div className={styles.tableWrap} data-scroll-x tabIndex={0} role="region" aria-label="Bảng, cuộn ngang để xem hết">
      <table className={styles.table} style={head.length > 4 ? { minWidth: `${head.length * 11}rem` } : undefined}>
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th key={i} scope="col">
                <Inlines nodes={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c}>
                  <Cell nodes={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const RATING_RE = /^(Cao|Khá|Trung bình|Thấp):?$/

/** Table cell; a leading bold reliability rating ("Cao:") gets a pill without changing its text. */
function Cell({ nodes }: { nodes: Inline[] }) {
  const [first, ...rest] = nodes
  if (first?.t === 'strong') {
    const label = first.c.map((x) => (x.t === 'text' ? x.v : '')).join('').trim()
    const m = RATING_RE.exec(label)
    if (m) {
      return (
        <>
          <span className={styles.rating} data-rating={m[1]}>
            <Inlines nodes={[first]} />
          </span>
          <Inlines nodes={rest} />
        </>
      )
    }
  }
  return <Inlines nodes={nodes} />
}

export function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => (
        <Fragment key={i}>{inline(n)}</Fragment>
      ))}
    </>
  )
}

function inline(n: Inline): ReactNode {
  switch (n.t) {
    case 'text':
      return n.v
    case 'br':
      return <br />
    case 'strong':
      return (
        <strong>
          <Inlines nodes={n.c} />
        </strong>
      )
    case 'em':
      return (
        <em>
          <Inlines nodes={n.c} />
        </em>
      )
    case 'link': {
      const external = /^https?:/.test(n.href)
      return (
        <a href={n.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          <Inlines nodes={n.c} />
        </a>
      )
    }
  }
}

const defaultImage: ImageRenderer = (block) => <Figure imageKey={block.key} alt={block.alt} />
