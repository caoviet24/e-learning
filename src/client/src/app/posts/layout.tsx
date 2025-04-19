'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Get user role from the user object
    const role = user?.account?.role;

    // If user is logged in but not a student or lecturer, redirect to their appropriate dashboard
    if (role !== 'STUDENT' && role !== 'LECTURER' && role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, router]);

  // Render the child components (posts page)
  return <>{children}</>;
}