import type { FC } from 'react'
import Link from 'next/link'

export const Logo: FC = () => {
  return (
    <Link href="/" className="font-bold text-xl tracking-tight">
      MediTrack
    </Link>
  )
}