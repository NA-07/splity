'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import ProfileForm from '@/components/auth/ProfileForm'

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
        <ProfileForm />
      </div>
    </DashboardLayout>
  )
}
