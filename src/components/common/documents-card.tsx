import type { FC } from 'react'
import type { Document } from '~/types/truck'
import { viewDocument } from '~/services/trackingService'
import { Button } from '~/global/components/button'
import { Card } from '~/global/components/card'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'
import { ExpiryBadge } from '~/components/common/expiry-badge'

interface DocumentsCardProps {
  documents: Document[]
  /** Expected document types in display order; others are listed after them. */
  types: readonly { key: string; label: string }[]
}

/** Documents of a driver, truck, trailer or staff member with expiry badges and a View button. */
export const DocumentsCard: FC<DocumentsCardProps> = ({ documents, types }) => {
  const known = types.map((t) => ({ doc: documents.find((d) => d.document_type === t.key), label: t.label }))
  const others = documents.filter((d) => !types.some((t) => t.key === d.document_type)).map((doc) => ({ doc, label: doc.document_type }))

  async function open(id: number) {
    try {
      await viewDocument(id)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Card className="space-y-2 p-4">
      <h3 className="text-sm font-semibold text-foreground">Documents</h3>
      <ul className="divide-y divide-outline">
        {[...known, ...others].map(({ doc, label }) => (
          <li key={label} className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div>
              <p className="text-sm text-foreground">{label}</p>
              {doc?.number && <p className="text-xs text-muted-foreground">No. {doc.number}</p>}
            </div>
            <div className="flex items-center gap-2">
              {doc?.expiry_date && <ExpiryBadge doc={doc} />}
              {doc?.attachment_path ? (
                <Button variant="text" onClick={() => void open(doc.id)} className="px-3 py-1">View</Button>
              ) : (
                !doc && <span className="text-xs text-muted-foreground">Not uploaded</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
