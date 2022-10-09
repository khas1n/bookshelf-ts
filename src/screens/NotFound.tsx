import React from 'react'
import { Link } from '@/components/lib'

const NotFoundScreen: React.FC = () => {
  return (
    <div
      css={{
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        Sorry... nothing here. <Link to="/discover">Go home</Link>
      </div>
    </div>
  )
}

export { NotFoundScreen }
