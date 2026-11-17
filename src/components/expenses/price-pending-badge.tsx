import type { FC } from 'react'
import type { ExpenseOrder } from '~/types/expense'
import { Badge } from '~/global/components/badge'

/** "Price pending" / "Price overdue" on fuel orders still waiting for a price (Expense UAT req. 10). */
export const PricePendingBadge: FC<{ expense: ExpenseOrder }> = ({ expense }) => {
  if (!expense.pending_price) return null

  return expense.price_overdue ? <Badge variant="danger" label="Price overdue" /> : <Badge variant="warning" hideDotIndicator label="Price pending" />
}
