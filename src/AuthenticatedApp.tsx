import * as React from 'react'
import { Button } from '@/components/lib'
import * as mq from '@/styles/media-queries'
import {
  Routes,
  Route,
  Link,
  LinkProps,
  useMatch,
  useResolvedPath,
} from 'react-router-dom'

import { DiscoverBooksScreen } from '@/screens/DiscoverBooks'
import { BookScreen } from '@/screens/Book'
import { NotFoundScreen } from '@/screens/NotFound'

import { User } from '@/types/user'
import * as colors from '@/styles/colors'

interface AuthenticatedAppProps {
  user: User
  logout: () => void
}

interface AppRoutesProps {
  user: User
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
        <div css={{ position: 'relative' }}>
          <Nav />
        </div>
        <main css={{ width: '100%' }}>
          <AppRoutes user={user} />
        </main>
      </div>
    </React.Fragment>
  )
}
const NavLink: React.FC<LinkProps> = (props) => {
  const resolved = useResolvedPath(props.to)
  const match = useMatch({ path: resolved.pathname, end: true })
  return (
    <Link
      css={[
        {
          display: 'block',
          padding: '8px 15px 8px 10px',
          margin: '5px 0',
          width: '100%',
          height: '100%',
          color: colors.text,
          borderRadius: '2px',
          borderLeft: '5px solid transparent',
          ':hover': {
            color: colors.indigo,
            textDecoration: 'none',
            background: colors.gray10,
          },
        },
        match
          ? {
              borderLeft: `5px solid ${colors.indigo}`,
              background: colors.gray10,
              ':hover': {
                background: colors.gray10,
              },
            }
          : null,
      ]}
      {...props}
    />
  )
}

const Nav: React.FC = () => {
  return (
    <nav
      css={{
        position: 'sticky',
        top: '4px',
        padding: '1em 1.5em',
        border: `1px solid ${colors.gray10}`,
        borderRadius: '3px',
        [mq.small]: {
          position: 'static',
          top: 'auto',
        },
      }}
    >
      <ul
        css={{
          listStyle: 'none',
          padding: '0',
        }}
      >
        <li>
          {/*
              🐨 Once the NavLink has been updated to use a Router Link,
                change from the href prop to a "to" prop
          */}
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  )
}

const AppRoutes: React.FC<AppRoutesProps> = ({ user }) => {
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverBooksScreen user={user} />} />
      <Route path="/book/:bookId" element={<BookScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

export { AuthenticatedApp }
