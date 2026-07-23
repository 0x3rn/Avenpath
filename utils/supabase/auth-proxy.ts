import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Protect private routes
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/settings',
    '/achievements',
    '/paths',
    '/planner',
    '/quizzes',
    '/practice',
    '/recommendations',
    '/notes',
    '/flashcards',
    '/community',
    '/notifications',
    '/admin',
    '/onboarding'
  ]
  
  const isProtected = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Admin Route Protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        
      if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  // Handle Auth routes (redirect to dashboard if already logged in)
  if (['/login', '/sign-up'].includes(request.nextUrl.pathname) || request.nextUrl.pathname === '/') {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }


  return supabaseResponse
}
