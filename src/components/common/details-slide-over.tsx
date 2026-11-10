import type { ReactNode } from 'react'
import { SlideOver } from '~/global/components/slider-over/slide-over'
import { GeneralErrorBoundary } from '~/global/components/error-boundary'
import { useSearchParamsState } from '~/global/utils/r3/hooks'

/** URL param that holds the id of the record shown in the details slide-over. */
export const DETAILS_PARAM = 'details'

interface DetailsSlideOverProps<T extends { id: number }> {
  children: (record: T) => ReactNode
  footer?: (record: T) => ReactNode
  records: T[]
  title: (record: T) => string
}

/**
 * "View" pane for list pages: opens when the URL has `?details=<id>` (so it can be linked and survives refresh)
 * and renders the record with the global SlideOver inside an error boundary.
 */
export function DetailsSlideOver<T extends { id: number }>({ children, footer, records, title }: DetailsSlideOverProps<T>) {
  const [params, setParams] = useSearchParamsState<{ details?: string }>()
  const record = params.details ? records.find((r) => String(r.id) === params.details) : undefined

  return (
    <SlideOver open={!!record} onClose={() => setParams({ details: undefined })}>
      <SlideOver.Panel size="3xl" className="max-w-[calc(100vw-2.5rem)]">
        {record && (
          <>
            <SlideOver.Header title={title(record)} />
            <SlideOver.Content className="space-y-4">
              <GeneralErrorBoundary>{children(record)}</GeneralErrorBoundary>
            </SlideOver.Content>
            {footer && <SlideOver.Footer>{footer(record)}</SlideOver.Footer>}
          </>
        )}
      </SlideOver.Panel>
    </SlideOver>
  )
}
