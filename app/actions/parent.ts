'use server'

import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { userProfiles, parentChildLinks, notifications, assignments, userSubjects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { sendEmail } from '@/utils/email'
import crypto from 'crypto'

export async function requestChildManagement(email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")
  
  if (user.email === email) {
    throw new Error("You cannot manage your own account.")
  }

  // Find child
  const childProfiles = await db.select().from(userProfiles).where(eq(userProfiles.email, email))
  if (childProfiles.length === 0) {
    throw new Error("No user found with this email.")
  }
  
  const child = childProfiles[0]

  // Check if already linked or pending
  const existingLinks = await db.select().from(parentChildLinks)
    .where(and(eq(parentChildLinks.parentId, user.id), eq(parentChildLinks.childId, child.id)))
    
  if (existingLinks.length > 0) {
    throw new Error("A request or link already exists for this child.")
  }

  // Get parent profile for names
  const parentProfiles = await db.select().from(userProfiles).where(eq(userProfiles.id, user.id))
  const parent = parentProfiles[0]

  const token = crypto.randomUUID()

  // Insert Link
  await db.insert(parentChildLinks).values({
    parentId: user.id,
    childId: child.id,
    token,
    status: 'pending'
  })
  
  const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/confirm-management?token=${token}`

  // Insert Notification
  await db.insert(notifications).values({
    userId: child.id,
    type: 'management_request',
    title: 'Management Request',
    message: `${parent.name} has requested to manage your account.`,
    actionUrl: `/dashboard/confirm-management?token=${token}`,
  })

  // Try send email
  await sendEmail({
    to: email,
    subject: 'Action Required: Parent Management Request',
    html: `
      <h2>Account Management Request</h2>
      <p><strong>${parent.name}</strong> has requested to manage your Avenpath account.</p>
      <p>To confirm this request, please click the link below:</p>
      <a href="${confirmUrl}">Confirm Management Request</a>
      <p>If you do not recognize this person, you can ignore this email or reject the request in your dashboard.</p>
    `
  })
  
  return { success: true }
}

export async function answerManagementRequest(token: string, accept: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")
  
  const links = await db.select().from(parentChildLinks).where(eq(parentChildLinks.token, token))
  if (links.length === 0) throw new Error("Invalid token")
  
  const link = links[0]
  if (link.childId !== user.id) {
    throw new Error("You are not authorized to respond to this request.")
  }
  
  if (link.status !== 'pending') {
    throw new Error("This request has already been answered.")
  }

  await db.update(parentChildLinks)
    .set({ status: accept ? 'approved' : 'rejected' })
    .where(eq(parentChildLinks.id, link.id))
    
  return { success: true }
}

export async function getManagedChildren() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const links = await db.select({
    link: parentChildLinks,
    child: userProfiles
  })
  .from(parentChildLinks)
  .innerJoin(userProfiles, eq(parentChildLinks.childId, userProfiles.id))
  .where(eq(parentChildLinks.parentId, user.id))
  
  return links
}

export async function getChildDetails(childId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Verify parent link
  const links = await db.select().from(parentChildLinks)
    .where(and(
      eq(parentChildLinks.parentId, user.id), 
      eq(parentChildLinks.childId, childId),
      eq(parentChildLinks.status, 'approved')
    ))
    
  if (links.length === 0) throw new Error("Unauthorized to view this child")

  const profiles = await db.select().from(userProfiles).where(eq(userProfiles.id, childId))
  const child = profiles[0]

  const childAssignments = await db.select().from(assignments).where(eq(assignments.childId, childId))

  return { child, assignments: childAssignments }
}

export async function createAssignment(childId: string, entityType: string, entityId: string, title: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Verify parent link
  const links = await db.select().from(parentChildLinks)
    .where(and(
      eq(parentChildLinks.parentId, user.id), 
      eq(parentChildLinks.childId, childId),
      eq(parentChildLinks.status, 'approved')
    ))
    
  if (links.length === 0) throw new Error("Unauthorized")
  
  const parentProfiles = await db.select().from(userProfiles).where(eq(userProfiles.id, user.id))
  const parent = parentProfiles[0]
  const childProfiles = await db.select().from(userProfiles).where(eq(userProfiles.id, childId))
  const child = childProfiles[0]

  await db.insert(assignments).values({
    parentId: user.id,
    childId: childId,
    entityType,
    entityId,
  })

  if (entityType === "subject") {
    // Check if the subject is already enrolled
    const existing = await db.select().from(userSubjects).where(and(eq(userSubjects.userId, childId), eq(userSubjects.subjectId, entityId)))
    if (existing.length === 0) {
      await db.insert(userSubjects).values({
        userId: childId,
        subjectId: entityId
      })
    }
  }

  // Send notification
  await db.insert(notifications).values({
    userId: childId,
    type: 'system',
    title: 'New Assignment',
    message: entityType === "subject" 
      ? `${parent.name} assigned the subject "${title}" to you.`
      : `${parent.name} assigned a new task to you: ${title}`,
    actionUrl: entityType === "subject" ? null : `/dashboard`,
  })

  // Send Email
  if (child.email) {
    await sendEmail({
      to: child.email,
      subject: 'New Assignment from your Parent',
      html: `
        <h2>New Assignment</h2>
        <p><strong>${parent.name}</strong> has assigned you a new ${entityType}: <strong>${title}</strong>.</p>
        <p>Log in to your dashboard to view it.</p>
      `
    })
  }

  return { success: true }
}
