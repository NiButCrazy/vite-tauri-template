import { type ComponentProps } from 'react'


interface ButtonProps extends ComponentProps<'button'>{
  count: number
  setCount: (count: number) => void
}

function Button(_props: ButtonProps) {
  const { count, setCount, children, ...props } = _props

  function handleClick(e: EventFor<'button', 'onClick'>) {
    setCount(count + 1)
    e.preventDefault()
  }

  return (
    <button className={
      'button1'
    } onClick={ handleClick } { ...props } >
      { children ?? `计数器为 ${ count }` }
    </button>
  )
}

export default Button
