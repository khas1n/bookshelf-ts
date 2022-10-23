import React, { PropsWithChildren } from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import { Dialog, CircleButton } from './lib'
import { DialogProps } from '@reach/dialog'

type CallBack = (...args: unknown[]) => void

type ComponentWithChildren = {
  children: React.ReactElement
}

const callAll =
  (...fns: Array<CallBack | undefined>) =>
  (...args: unknown[]) =>
    fns.forEach((fn) => fn && fn(...args))

type ModalContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>]
const ModalContext = React.createContext<ModalContextType | null>(null)

const Modal: React.FC<PropsWithChildren> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

const useModal = () => {
  const ctx = React.useContext(ModalContext)
  if (ctx === null)
    throw new Error('useModal must be used within a ModalContext.Provider')
  return ctx
}

const ModalDismissButton: React.FC<ComponentWithChildren> = ({
  children: child,
}) => {
  const [, setIsOpen] = useModal()
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

const ModalOpenButton: React.FC<ComponentWithChildren> = ({
  children: child,
}) => {
  const [, setIsOpen] = useModal()
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

const ModalContentsBase: React.FC<DialogProps> = (props) => {
  const [isOpen, setIsOpen] = useModal()
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

const ModalContents: React.FC<{ title: string } & DialogProps> = ({
  title,
  children,
  ...props
}) => {
  return (
    <ModalContentsBase {...props}>
      <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{ textAlign: 'center', fontSize: '2em' }}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export { Modal, ModalDismissButton, ModalOpenButton, ModalContents }
