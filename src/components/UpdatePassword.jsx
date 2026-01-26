import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'

export function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const {toast} = useToast()
  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 2. Update the user's password
    const { error } = await supabase.auth.updateUser({ password: password })

    if (error) {
    toast({
      variant:"destructive",
      title: "Error",
      description: error.message,
    })
    } else {
      
    toast({
      title: "Success",
      description: "Password updated successfully!",
    })
      // Clear the hash from the URL so they don't get stuck in "recovery" mode
      window.location.hash = ''
      window.location.reload() 
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set New Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}