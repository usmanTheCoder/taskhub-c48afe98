'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { setCredentials, clearCredentials } from '@/store/slices/authSlice'
import { loginWithEmail } from '@/server/routers/auth'
import { trpc } from '@/lib/trpc'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import ErrorAlert from '@/components/UI/ErrorAlert'
import Spinner from '@/components/UI/Spinner'
import { validateEmail, validatePassword } from '@/utils/validation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const dispatch = useDispatch()
  const router = useRouter()
  const { mutate, isLoading: isLoadingLogin } = trpc.useMutation('auth.login', {
    onSuccess: (data) => {
      dispatch(setCredentials(data))
      router.push('/tasks')
    },
    onError: (error) => {
      setError(error.message)
      setIsLoading(false)
    },
  })

  useEffect(() => {
    return () => {
      dispatch(clearCredentials())
    }
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/tasks')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setEmailError(emailError)
      setPasswordError(passwordError)
      setIsLoading(false)
      return
    }

    mutate({ email, password })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <ErrorAlert message={error} />}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              placeholder="Email"
              icon={<FaEnvelope />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
          </div>
          <div className="mb-6">
            <Input
              placeholder="Password"
              type="password"
              icon={<FaLock />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
            />
          </div>
          <div className="flex justify-center">
            <Button type="submit" disabled={isLoading || isLoadingLogin}>
              {isLoading || isLoadingLogin ? <Spinner /> : 'Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login