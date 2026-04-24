import { ComponentProps, useState } from 'react'


interface ButtonProps extends ComponentProps<'button'>{
  count: number
  setCount: (count: number) => void
}

function Button(props: ButtonProps) {
  const { count, setCount, children, ...prop } = props

  function handleClick(e: EventFor<'button', 'onClick'>) {
    setCount(count + 1)
    e.preventDefault()
  }

  return (
    <button className={
      'button1'
    } onClick={ handleClick } { ...prop } >
      { children ?? `计数器为 ${ count }` }
    </button>
  )
}

export default Button
