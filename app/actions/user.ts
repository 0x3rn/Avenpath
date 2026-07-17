'use server'

import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { userProfiles, userProgress, userBadges, userCertificates, badges, certificates } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

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

export async function updateProfile(data: { name?: string, university?: string, major?: string, bio?: string }) {
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

export async function completeOnboarding(data: {
  name?: string;
  university?: string;
  major?: string;
  learningGoals?: string[];
  skipped?: boolean;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const updated = await db.update(userProfiles)
    .set({
      ...(data.skipped ? {} : {
        name: data.name,
        university: data.university,
        major: data.major,
        learningGoals: data.learningGoals,
      }),
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, user.id))
    .returning()

  return updated[0]
}

export async function getUserBadges() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const earned = await db.select({
    id: userBadges.id,
    earnedAt: userBadges.earnedAt,
    badge: badges
  })
  .from(userBadges)
  .innerJoin(badges, eq(userBadges.badgeId, badges.id))
  .where(eq(userBadges.userId, user.id))
  .orderBy(desc(userBadges.earnedAt))

  return earned
}

export async function getUserCertificates() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const earned = await db.select({
    id: userCertificates.id,
    earnedAt: userCertificates.earnedAt,
    certificate: certificates
  })
  .from(userCertificates)
  .innerJoin(certificates, eq(userCertificates.certificateId, certificates.id))
  .where(eq(userCertificates.userId, user.id))
  .orderBy(desc(userCertificates.earnedAt))

  return earned
}
