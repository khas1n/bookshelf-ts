import { Logo } from '@/components/Logo'
import React from 'react'
import LoginForm from '@/components/LoginForm'
import { Button } from '@/components/lib'
import { Modal, ModalContents, ModalOpenButton } from '@/components/Modal'
import { LoginFormField, User } from '@/types/user'

enum DialogState {
  'none',
  'login',
  'register',
}

interface UnauthenticatedAppProps {
  login: (formData: LoginFormField) => Promise<void>
  register: (formData: LoginFormField) => Promise<void>
}

const UnauthenticatedApp: React.FC<UnauthenticatedAppProps> = ({
  login,
  register,
}) => {
  const [openModal, setOpenModal] = React.useState<DialogState>(
    DialogState.none,
  )

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Logo height="80" width="80" />
      <h1>Bookself-ts</h1>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridGap: '0.75rem',
        }}
      >
        <Modal>
          <ModalOpenButton>
            <Button>Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <LoginForm onSubmit={login} submitButton={<Button>Login</Button>} />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm
              onSubmit={register}
              submitButton={<Button>Register</Button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

export { UnauthenticatedApp }
