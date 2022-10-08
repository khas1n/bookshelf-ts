import React from 'react'
import { FormGroup, Input, Spinner } from './lib'

export interface LoginFormField {
  username: string
  password: string
}

interface LoginFormProps {
  onSubmit: (formData: LoginFormField) => void
  submitButton: JSX.Element
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  submitButton,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      username: { value: string }
      password: { value: string }
    }
    const username = target.username.value
    const password = target.password.value
    onSubmit({ username, password })
  }
  return (
    <form
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '> div': {
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px',
        },
      }}
      onSubmit={handleSubmit}
    >
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input type="text" id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input type="password" id="password" />
      </FormGroup>
      <div>
        {React.cloneElement(submitButton, { type: 'submit' })}
        <Spinner />
      </div>
    </form>
  )
}

export default LoginForm
