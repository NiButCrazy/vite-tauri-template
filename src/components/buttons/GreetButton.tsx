import { ComponentProps, useState } from 'react'


function GreetButton(props: ComponentProps<'button'>) {
  const { children, onClick, ...prop } = props

  return (
    <button className={
      'button1'
    } onClick={ onClick } { ...prop } >
      { children ?? `打个招呼吧` }
    </button>
  )
}

export default GreetButton
