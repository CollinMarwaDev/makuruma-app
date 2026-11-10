import { useConfirmation } from '~/global/providers/confirmation'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

interface ConfirmActionOptions {
  action: () => Promise<unknown>
  cancelText?: string
  description: string
  okayText: string
  /** Toast shown when the action succeeds. */
  success: string
  title: string
  type?: 'error' | 'warning' | 'info' | 'success'
}

/**
 * Delete / approve / reject / mark-paid flow: global confirmation modal, then the action, then a toast.
 * Resolves `true` when the action ran successfully.
 */
export function useConfirmAction() {
  const confirm = useConfirmation()

  return async ({ action, cancelText = 'Cancel', description, okayText, success, title, type = 'error' }: ConfirmActionOptions) => {
    if (!(await confirm({ cancelText, description, okayText, title, type }))) return false
    try {
      await action()
      toast.success(success)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    }
  }
}
