import type { ExpenseOrder } from '~/types/expense'

/** Reg nos of a Truck order's trucks (from its lines; older orders kept one truck on the order). */
export function truckRegNos(expense: ExpenseOrder): string[] {
  const fromLines = [...new Set(expense.lines.flatMap((l) => (l.truck ? [l.truck.reg_no] : [])))]
  return fromLines.length || !expense.truck ? fromLines : [expense.truck.reg_no]
}
