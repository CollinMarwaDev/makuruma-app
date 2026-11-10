import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import type { FormField } from '~/global/components/form-controls/types'
import { NoneEmptyStringSchema } from '~/global/utils/r3/zod-common'
import { useAuth } from '~/hooks/useAuth'

const LoginSchema = z.object({
  email: NoneEmptyStringSchema('Email').email('Enter a valid email address'),
  password: NoneEmptyStringSchema('Password'),
})

export type LoginFormValues = z.infer<typeof LoginSchema>

/** Login form state, validation and submit (global form-controls + react-hook-form + zod). */
export function useManageLoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string>()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' }, resolver: zodResolver(LoginSchema) })

  const fields: FormField<LoginFormValues>[] = [
    {
      autoComplete: 'email',
      errorMessage: errors.email?.message,
      hasError: !!errors.email,
      inputType: 'text-input',
      label: 'Email',
      name: 'email',
      placeholder: 'you@makuruma.co.tz',
      register,
      type: 'email',
    },
    {
      autoComplete: 'current-password',
      errorMessage: errors.password?.message,
      hasError: !!errors.password,
      inputType: 'text-input',
      label: 'Password',
      name: 'password',
      placeholder: 'Your password',
      register,
      type: 'password',
    },
  ]

  const onSubmit = handleSubmit(async (values) => {
    setServerError(undefined)
    try {
      await login(values)
      navigate('/')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed')
    }
  })

  return { fields, isSubmitting, onSubmit, serverError }
}
