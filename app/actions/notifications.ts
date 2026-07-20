'use server'

import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { notifications } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function getUserNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const notifs = await db.select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))

  return notifs
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return 0

  const notifs = await db.select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))

  return notifs.filter(n => !n.isRead).length
}

export async function markNotificationRead(id: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, id))
}
