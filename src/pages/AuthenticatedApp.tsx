import * as React from 'react'
import { Button } from '@/components/lib'
import * as mq from '@/styles/media-queries'
import { DiscoverBooks } from '@/components/DiscoverBooks'
import { User } from '@/types/user'

interface AuthenticatedAppProps {
  user: User
  logout: () => void
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({
  user,
  logout,
}) => {
  return (
    <React.Fragment>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
      >
        {user.username}
        <Button
          variant="secondary"
          css={{ marginLeft: '10px' }}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
      <div
        css={{
          margin: '0 auto',
          padding: '4em 2em',
          maxWidth: '840px',
          width: '100%',
          display: 'grid',
          gridGap: '1em',
          gridTemplateColumns: '1fr 3fr',
          [mq.small]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto',
            width: '100%',
          },
        }}
      >
        <DiscoverBooks />
      </div>
    </React.Fragment>
  )
}

export { AuthenticatedApp }
