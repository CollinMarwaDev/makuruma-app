import { useState, type FC } from 'react'
import type { TrackingLeg } from '~/types/tracking'
import { deleteProofOfDelivery, fetchTrackingLeg, uploadProofOfDelivery, viewDocument } from '~/services/trackingService'
import { Button } from '~/global/components/button'
import { FilePickerCard } from '~/global/components/file-pickers'
import { useConfirmation } from '~/global/providers/confirmation'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'
import { InlineError, LegSection } from '~/components/tracking/leg-form-common'

const POD_ACCEPT = { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }

const fileName = (path: string | null) => path?.split('/').pop() ?? 'Proof of delivery'

/** View, upload and delete the leg's proof of delivery (contract 2.2 D-5). */
export const LegPodSection: FC<{ leg: TrackingLeg; onUpdated: (leg: TrackingLeg) => void }> = ({ leg, onUpdated }) => {
  const confirm = useConfirmation()
  const [pickerKey, setPickerKey] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pods = leg.documents.filter((d) => d.document_type === 'POD')

  async function run(action: () => Promise<unknown>, success: string, fallback: string) {
    setError(null)
    try {
      await action()
      onUpdated(await fetchTrackingLeg(leg.id))
      toast.success(success)
    } catch (err) {
      setError(err instanceof Error ? err.message : fallback)
    }
  }

  async function upload(file: File | undefined) {
    if (!file) return
    setIsUploading(true)
    await run(() => uploadProofOfDelivery(leg.id, file), 'Proof of delivery uploaded', 'Failed to upload proof of delivery')
    setIsUploading(false)
    setPickerKey((k) => k + 1)
  }

  async function remove(documentId: number) {
    const ok = await confirm({
      cancelText: 'Keep file',
      description: 'The file is removed from this leg. The deletion is recorded with your name.',
      okayText: 'Delete POD',
      title: 'Delete this proof of delivery?',
      type: 'error',
    })
    if (ok) await run(() => deleteProofOfDelivery(leg.id, documentId), 'Proof of delivery deleted', 'Failed to delete proof of delivery')
  }

  async function view(documentId: number) {
    try {
      await viewDocument(documentId)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <LegSection
      title="Proof of delivery"
      description={leg.pod_overdue ? 'POD is overdue: more than 5 days since offloading.' : 'Upload the signed POD after offloading.'}
    >
      <InlineError message={error} />
      <FilePickerCard
        key={pickerKey}
        mode="manual-upload"
        accept={POD_ACCEPT}
        instructionTitle={isUploading ? 'Uploading…' : 'Click or drop the signed POD'}
        instructionText="PDF, JPG or PNG · up to 5 MB"
        onChange={(picked) => void upload(picked?.file)}
      />
      {pods.length === 0 ? (
        <p className="text-sm text-muted-foreground">No proof of delivery uploaded yet.</p>
      ) : (
        <ul className="divide-y divide-outline rounded-lg border border-outline">
          {pods.map((doc) => (
            <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
              <span className="truncate text-sm text-foreground">{fileName(doc.attachment_path)}</span>
              <span className="flex gap-2">
                <Button variant="text" onClick={() => void view(doc.id)} className="px-3 py-1.5">
                  View
                </Button>
                <Button variant="text" onClick={() => void remove(doc.id)} className="px-3 py-1.5 text-status-red-pc">
                  Delete
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </LegSection>
  )
}
