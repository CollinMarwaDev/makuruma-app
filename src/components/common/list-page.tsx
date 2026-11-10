import type { ReactNode } from 'react'
import { ErrorFallback, GeneralErrorBoundary } from '~/global/components/error-boundary'
import PageHeader from '~/global/components/page-header'

interface ListPageProps {
  actions?: ReactNode
  /** Render without the page frame and header (the list sits inside another page, e.g. a tab). */
  embedded?: boolean
  /** The list section(s); replaced by ErrorFallback when loading failed. */
  children: ReactNode
  error: unknown
  loading: boolean
  /** Slide-overs and modals, rendered outside the error fallback. */
  overlays?: ReactNode
  retryLink: string
  subtitle: string
  title: string
}

/** Page frame for list pages: PageHeader, ErrorFallback on load error, GeneralErrorBoundary around the content. */
export function ListPage({ actions, children, embedded, error, loading, overlays, retryLink, subtitle, title }: ListPageProps) {
  const content = error && !loading ? <ErrorFallback error={error} ctaLabel="Try again" ctaLink={retryLink} /> : <GeneralErrorBoundary>{children}</GeneralErrorBoundary>

  if (embedded) {
    return (
      <>
        {content}
        {overlays}
      </>
    )
  }

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader title={title} subtitle={subtitle} titleClassName="font-semibold tracking-tight text-foreground" subTitleClassName="text-muted-foreground" />
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {content}
      {overlays}
    </div>
  )
}
