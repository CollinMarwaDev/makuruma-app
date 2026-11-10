import logo from '../assets/logo.png'
import bgLogin from '../assets/bg-login.png'
import { Button } from '~/global/components/button'
import { RenderFormField } from '~/global/components/form-controls/render-form-field'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { useManageLoginForm } from '~/components/login/use-manage-login-form'

function Login() {
  const { fields, isSubmitting, onSubmit, serverError } = useManageLoginForm()

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-background/90 via-background/80 to-brand/20" />

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Makuruma Logistics" className="h-16" />
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl bg-surface p-4 shadow-xl ring-1 ring-border md:p-8">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your fleet</p>
          </div>

          <ModalFormError message={serverError} className="mt-0" />

          {fields.map((field) => (
            <RenderFormField key={field.name} {...field} />
          ))}

          <Button type="submit" className="w-full" loading={isSubmitting} loadingText="Logging in…">
            Log In
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
