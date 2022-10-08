import { LoginFormField, User } from '@/types/user'
import { useAsync } from '@/utils/hooks'
import React from 'react'
import { ErrorMessage, FormGroup, Input, Spinner } from './lib'

interface LoginFormProps {
  onSubmit: (formData: LoginFormField) => Promise<void>
  submitButton: JSX.Element
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  submitButton,
}) => {
  const { isLoading, isError, error, run } = useAsync()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      username: { value: string }
      password: { value: string }
    }
    const username = target.username.value
    const password = target.password.value
    run(onSubmit({ username, password }))
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
        {React.cloneElement(
          submitButton,
          { type: 'submit' },
          ...(Array.isArray(submitButton.props.children)
            ? submitButton.props.children
            : [submitButton.props.children]),
          isLoading ? <Spinner css={{ marginLeft: 5 }} /> : null,
        )}
      </div>
      {isError && error ? <ErrorMessage error={error} /> : null}
    </form>
  )
}

export default LoginForm
