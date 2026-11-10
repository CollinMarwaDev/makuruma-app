import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updatePassword } from '~/services/profileService'
import type { FormField } from '~/global/components/form-controls/types'
import { NoneEmptyStringSchema } from '~/global/utils/r3/zod-common'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const PasswordSchema = z
  .object({
    current_password: NoneEmptyStringSchema('Current password'),
    new_password: NoneEmptyStringSchema('New password').min(8, 'Use at least 8 characters'),
    new_password_confirmation: NoneEmptyStringSchema('Confirmation'),
  })
  .refine((v) => v.new_password === v.new_password_confirmation, {
    message: 'New password and confirmation do not match',
    path: ['new_password_confirmation'],
  })

type PasswordFormValues = z.infer<typeof PasswordSchema>

const EMPTY: PasswordFormValues = { current_password: '', new_password: '', new_password_confirmation: '' }

/** Change-password form on the profile page (global form-controls + react-hook-form + zod). */
export function useManagePasswordForm() {
  const [serverError, setServerError] = useState<string>()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<PasswordFormValues>({ defaultValues: EMPTY, resolver: zodResolver(PasswordSchema) })

  const field = (name: keyof PasswordFormValues, label: string, autoComplete: string): FormField<PasswordFormValues> => ({
    autoComplete,
    errorMessage: errors[name]?.message,
    hasError: !!errors[name],
    inputType: 'text-input',
    label,
    name,
    register,
    type: 'password',
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(undefined)
    try {
      const result = await updatePassword(values)
      toast.success(result?.message || 'Password updated')
      reset(EMPTY)
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  })

  return {
    fields: [
      field('current_password', 'Current password', 'current-password'),
      field('new_password', 'New password', 'new-password'),
      field('new_password_confirmation', 'Confirm new password', 'new-password'),
    ],
    isSubmitting,
    onSubmit,
    serverError,
  }
}
