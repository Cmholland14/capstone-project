"use client"

import Collections from "@/components/collections/ProductCollections"
import { useSession, signOut } from "next-auth/react"
import styles from './page.module.css'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <Collections></Collections>
  )
}