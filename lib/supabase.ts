// Mock Supabase client — no real backend. Mimics the subset of the Supabase
// query-builder API the app actually uses, backed by in-memory arrays in
// ./mock-data. Every page/route keeps its existing db.from(...) calls unchanged.

import {
  progressTable,
  quizTable,
  examTable,
  moduleProgressTable,
} from './mock-data'

type Row = Record<string, any>

// Table-name aliases collapse the original schema's split names onto one store,
// which also fixes a latent bug: writes went to quiz_results/exam_results but
// reads came from quiz_history/exam_history (different tables → nothing showed).
function storeFor(table: string): Row[] {
  switch (table) {
    case 'progress':
      return progressTable
    case 'quiz_history':
    case 'quiz_results':
      return quizTable
    case 'exam_history':
    case 'exam_results':
      return examTable
    case 'module_progress':
      return moduleProgressTable
    default:
      return []
  }
}

interface Result {
  data: any
  error: null
}

class MockQueryBuilder implements PromiseLike<Result> {
  private filters: [string, any][] = []
  private orderCol: string | null = null
  private orderAsc = true
  private limitN: number | null = null
  private singleFlag = false
  private op: 'select' | 'insert' | 'upsert' | 'update' = 'select'
  private payload: Row | Row[] | null = null
  private conflictKeys: string[] = []

  constructor(private table: string) {}

  select(_cols?: string) {
    if (this.op === 'insert' || this.op === 'upsert') {
      // insert().select() — keep op, just allow chaining to single()
      return this
    }
    this.op = 'select'
    return this
  }
  eq(col: string, val: any) {
    this.filters.push([col, val])
    return this
  }
  order(col: string, opts?: { ascending?: boolean }) {
    this.orderCol = col
    this.orderAsc = opts?.ascending ?? true
    return this
  }
  limit(n: number) {
    this.limitN = n
    return this
  }
  single() {
    this.singleFlag = true
    return this
  }
  maybeSingle() {
    this.singleFlag = true
    return this
  }
  insert(payload: Row | Row[]) {
    this.op = 'insert'
    this.payload = payload
    return this
  }
  upsert(payload: Row, opts?: { onConflict?: string }) {
    this.op = 'upsert'
    this.payload = payload
    this.conflictKeys = opts?.onConflict ? opts.onConflict.split(',').map((k) => k.trim()) : []
    return this
  }
  update(payload: Row) {
    this.op = 'update'
    this.payload = payload
    return this
  }

  private matches(row: Row): boolean {
    return this.filters.every(([col, val]) => row[col] === val)
  }

  private execute(): Result {
    const store = storeFor(this.table)

    if (this.op === 'insert') {
      const rows = Array.isArray(this.payload) ? this.payload : [this.payload!]
      const stamped = rows.map((r) => ({ created_at: new Date().toISOString(), ...r }))
      store.push(...stamped)
      const data = Array.isArray(this.payload) ? stamped : stamped[0]
      return { data, error: null }
    }

    if (this.op === 'upsert') {
      const incoming = this.payload as Row
      const existing = this.conflictKeys.length
        ? store.find((row) => this.conflictKeys.every((k) => row[k] === incoming[k]))
        : undefined
      if (existing) Object.assign(existing, incoming)
      else store.push({ created_at: new Date().toISOString(), ...incoming })
      return { data: existing ?? incoming, error: null }
    }

    if (this.op === 'update') {
      const target = store.filter((row) => this.matches(row))
      target.forEach((row) => Object.assign(row, this.payload))
      return { data: target, error: null }
    }

    // select
    let rows = store.filter((row) => this.matches(row))
    if (this.orderCol) {
      const col = this.orderCol
      rows = [...rows].sort((a, b) => {
        const av = a[col] ?? ''
        const bv = b[col] ?? ''
        if (av === bv) return 0
        const cmp = av < bv ? -1 : 1
        return this.orderAsc ? cmp : -cmp
      })
    }
    if (this.limitN != null) rows = rows.slice(0, this.limitN)
    if (this.singleFlag) return { data: rows[0] ?? null, error: null }
    return { data: rows, error: null }
  }

  then<TResult1 = Result, TResult2 = never>(
    onfulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected)
  }
}

class MockClient {
  from(table: string) {
    return new MockQueryBuilder(table)
  }
  // RPCs used by the app (e.g. increment_papers_completed).
  async rpc(fn: string, args?: Row): Promise<Result> {
    if (fn === 'increment_papers_completed' && args?.p_user_id) {
      const row = progressTable.find((p) => p.user_id === args.p_user_id)
      if (row) row.papers_completed += 1
    }
    return { data: null, error: null }
  }
}

// Browser stub — unused server-side, kept so existing imports don't break.
export const supabase = new MockClient()

export function createServiceClient() {
  return new MockClient()
}
