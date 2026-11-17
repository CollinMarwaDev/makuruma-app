import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '~/hooks/useAuth'
import { LookupList } from '~/components/expense-settings/lookup-list'
import { RouteTemplatesList } from '~/components/route-templates/route-templates-list'
import { UsdRatesList } from '~/components/expense-settings/usd-rates-list'
import { BackButton } from '~/global/components/button'
import { GeneralErrorBoundary } from '~/global/components/error-boundary'
import PageHeader from '~/global/components/page-header'
import { TabLinks } from '~/global/components/tab-link'

const TABS = [
  { label: 'Payment accounts', value: 'accounts' },
  { label: 'Route templates', value: 'route-templates' },
  { label: 'Vendor types', value: 'vendor-types' },
  { label: 'Other subcategories', value: 'subcategories' },
  { label: 'USD rates', value: 'usd-rates' },
] as const

const EDITOR_ROLES = ['admin', 'manager', 'accountant']

/** Lists and templates users manage for expenses without a developer (Expense UAT req. 12, 18, 26–28). The API also checks the role. */
function ExpenseSettings() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'accounts'

  if (user && !EDITOR_ROLES.includes(user.role?.slug ?? '')) return <Navigate to="/expenses" replace />

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <BackButton to="/expenses" label="Back to expenses" />
      <PageHeader
        title="Expense settings"
        subtitle="Payment accounts, route templates, vendor types, Other-expense subcategories and USD rates."
        titleClassName="font-semibold tracking-tight text-foreground"
        subTitleClassName="text-muted-foreground"
      />
      <TabLinks
        containerClassName="px-0"
        tabs={TABS.map((t) => ({
          matchPattern: t.value === 'accounts' ? /^\/expenses\/settings(?![^#]*[?&]tab=)/ : new RegExp(`^/expenses/settings\\?(.*&)?tab=${t.value}\\b`),
          name: t.label,
          url: t.value === 'accounts' ? '/expenses/settings' : `/expenses/settings?tab=${t.value}`,
        }))}
      />
      <GeneralErrorBoundary>
        {tab === 'accounts' && (
          <LookupList key="accounts" kind="payment-accounts" entity="account" placeholder="e.g. NMB 2010002" hint="Accounts an expense can be paid from. They appear in the expense form's Payment account list." />
        )}
        {tab === 'vendor-types' && (
          <LookupList key="vendor-types" kind="vendor-types" entity="vendor type" placeholder="e.g. Vibali agent" hint="Types to group vendors by. Fuel vendors appear on fuel lines." />
        )}
        {tab === 'subcategories' && (
          <LookupList key="subcategories" kind="expense-subcategories" entity="subcategory" placeholder="e.g. Tyres" hint="Subcategories of Other expenses; the profit report groups by them." />
        )}
        {tab === 'route-templates' && <RouteTemplatesList />}
        {tab === 'usd-rates' && <UsdRatesList />}
      </GeneralErrorBoundary>
    </div>
  )
}

export default ExpenseSettings
