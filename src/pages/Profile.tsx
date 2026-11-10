import { useManagePasswordForm } from '~/components/profile/use-manage-password-form'
import { useAuth } from '~/hooks/useAuth'
import { Button } from '~/global/components/button'
import { Card } from '~/global/components/card'
import { RenderFormField } from '~/global/components/form-controls/render-form-field'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import PageHeader from '~/global/components/page-header'

function Profile() {
  const { user } = useAuth()
  const { fields, isSubmitting, onSubmit, serverError } = useManagePasswordForm()

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <PageHeader title="Profile" subtitle="Your account and password." titleClassName="font-semibold tracking-tight text-foreground" subTitleClassName="text-muted-foreground" />

      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Card variant="panel">
          <h2 className="text-sm font-semibold text-foreground">Account</h2>
          <LabelValueListItem label="Name" value={user?.name ?? '—'} />
          <LabelValueListItem label="Email" value={user?.email ?? '—'} />
          <LabelValueListItem label="Role" value={user?.role?.name ?? '—'} />
        </Card>

        <Card variant="panel">
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">Change password</h2>
            <ModalFormError message={serverError} className="mt-0" />
            {fields.map((f) => (
              <RenderFormField key={f.name} {...f} />
            ))}
            <Button type="submit" loading={isSubmitting} loadingText="Updating…">
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Profile
