import { useSearchParamsState } from '~/global/utils/r3/hooks'

/** Opens/closes the DetailsSlideOver by writing `?details=<id>` to the URL. */
export function useDetailsParam() {
  const [, setParams] = useSearchParamsState<{ details?: string }>()
  return {
    closeDetails: () => setParams({ details: undefined }),
    openDetails: (id: number) => setParams({ details: String(id) }),
  }
}
