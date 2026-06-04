import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth'
import { roster, rosterDetail } from '@/lib/mock-data'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getServerUser()
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const detail = rosterDetail(params.id)
  if (!detail) {
    return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
  }
  return NextResponse.json(detail)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getServerUser()
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = (await request.json()) as { password?: string }
    const { password } = body

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    // Mock: nothing persisted, just confirm the student exists.
    if (!roster.some((s) => s.id === params.id)) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 })
  }
}
