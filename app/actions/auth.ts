'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // We are expecting standard FormData from the client form
  // Alternatively we can pass plain objects if called via custom submit
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  // Note: Since you require users to confirm their email, Supabase will
  // send a confirmation email. The user will be redirected to /verify-email.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      }
    }
    // Optional: add redirectTo so Supabase knows where to redirect after clicking the link in the email
    // options: {
    //   emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm`
    // }
  })

  if (error) {
    return { error: error.message }
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
