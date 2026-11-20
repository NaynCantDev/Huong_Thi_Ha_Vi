export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong' | 'em'; c: Inline[] }
  | { t: 'link'; href: string; c: Inline[] }
  | { t: 'br' }

export type Align = 'center'

export type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; id: string; c: Inline[]; align?: Align }
  | { type: 'p'; c: Inline[]; align?: Align }
  | { type: 'list'; ordered: boolean; start?: number; items: Block[][] }
  | { type: 'image'; key: string; alt: string; align?: Align }
  | { type: 'table'; head: Inline[][]; rows: Inline[][][] }

export type PageSlug =
  | 'gioi-thieu'
  | 'du-an'
  | 'bai-1'
  | 'bai-2'
  | 'bai-3'
  | 'bai-4'
  | 'bai-5'
  | 'bai-6'
  | 'tong-ket'
