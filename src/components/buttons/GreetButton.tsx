import { ComponentProps } from 'react'


function GreetButton(_props: ComponentProps<'button'>) {
  const { children, onClick, ...props } = _props

  return (
    <button className={
      'button1'
    } onClick={ onClick } { ...props } >
      { children ?? `打个招呼吧` }
    </button>
  )
}

export default GreetButton
