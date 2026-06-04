import { redirect } from 'next/navigation'

// Private tuition tool — no public landing page. Always go to login.
export default function RootPage() {
  redirect('/login')
}
