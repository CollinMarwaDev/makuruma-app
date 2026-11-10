import type { UserRecord } from '~/types/user'
import { deleteUser, fetchUsers, resetUserPassword } from '~/services/userService'
import { useAuth } from '~/hooks/useAuth'
import UserForm from '~/components/UserForm'
import { CrudListPage } from '~/components/common/crud-list-page'
import { useConfirmAction } from '~/components/common/use-confirm-action'
import { UserDetails } from '~/components/users/user-details'
import { UsersTableSection } from '~/components/users/users-table-section'
import { Button } from '~/global/components/button'

function Users() {
  const { user: currentUser } = useAuth()
  const confirmAction = useConfirmAction()
  const isAdmin = currentUser?.role?.slug === 'admin'

  const resetPassword = (user: UserRecord) =>
    void confirmAction({
      action: () => resetUserPassword(user.id),
      description: 'Their password goes back to the default. They must change it after signing in.',
      okayText: 'Reset password',
      success: `Password reset for ${user.name}`,
      title: `Reset ${user.name}'s password?`,
      type: 'warning',
    })

  return (
    <CrudListPage
      title="Users"
      subtitle="People who sign in, their role and whether their account is active."
      entity="user"
      retryLink="/users"
      fetchRows={fetchUsers}
      removeRow={deleteUser}
      name={(u) => u.name}
      deleteDescription="They lose access immediately. This cannot be undone."
      renderDetails={(u) => <UserDetails user={u} />}
      renderDetailsActions={(u) => isAdmin && <Button variant="outline" onClick={() => resetPassword(u)}>Reset password</Button>}
      renderForm={(u, onSaved) => <UserForm key={u?.id ?? 'new'} user={u} onSaved={onSaved} />}
      renderList={(h) => <UsersTableSection users={h.rows} canResetPassword={isAdmin} onResetPassword={resetPassword} {...h} />}
    />
  )
}

export default Users
