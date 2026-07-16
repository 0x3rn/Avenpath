'use server'

import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { userProfiles, userProgress } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Ensure the user exists in our local userProfiles table
  const existingProfiles = await db.select().from(userProfiles).where(eq(userProfiles.id, user.id))
  
  if (existingProfiles.length > 0) {
    return existingProfiles[0]
  }

  // Create a profile automatically if it doesn't exist
  // Using the name from metadata, or extracting from email
  const metadataName = user.user_metadata?.name || user.email?.split('@')[0] || "Student"
  
  const newProfile = await db.insert(userProfiles).values({
    id: user.id,
    email: user.email!,
    name: metadataName,
  }).returning()

  return newProfile[0]
}

export async function updateProfile(data: { name?: string, university?: string, major?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const updated = await db.update(userProfiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, user.id))
    .returning()

  return updated[0]
}
