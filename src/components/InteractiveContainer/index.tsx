import React from 'react'
import classNames from 'classnames'
import Container from '../Container'
const InteractiveContainer: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    active?: boolean
  }
> = (props) => {
  const { active = false, className, ...other } = props

  return (
    <Container
      {...other}
      className={classNames([
        'hover:bg-black/[0.06]',
        'dark:hover:bg-white/[0.12]',
        active &&
          'bg-[#e6f4ff] text-[#1677ff] dark:bg-[#1668dc] dark:text-white',
        'hover:cursor-pointer',
        className
      ])}
    >
      {other.children}
    </Container>
  )
}
export default InteractiveContainer
