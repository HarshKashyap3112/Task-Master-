import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {toast} = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
     toast({
      variant: "destructive", // Red color
      title: "Error",
      description: error.message,
    })}
    else{
      toast({
      title: "Success.",
      description: "Successfully logged in ",
    })
    }
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error){
      toast({
      variant: "destructive", // Red color
      title: "Uh oh! Something went wrong.",
      description: "There was a problem deleting your task.",
    })
    }
   
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-end max-h-full bg-[url(day.jpg)] bg-cover bg-center bg-no-repeat p-4  dark:bg-[url(night.jpg)] h-lvh">
      <Card className="w-full max-w-md  ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Task Master</CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={loading} variant="secondary">
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleSignUp} disabled={loading}>
            Create an account
          </Button>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-center text-gray-500 w-full">
                By clicking continue, you agree to our Terms of Service.
            </p>
        </CardFooter>
      </Card>
    </div>
  )
}