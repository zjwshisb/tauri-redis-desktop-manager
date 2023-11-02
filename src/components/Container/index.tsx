import React from 'react'
import classNames from 'classnames'
const Container: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    level?: 1 | 2 | 3 | 4 | 5
  }
> = (props) => {
  const { level = 5, ...other } = props

  return (
    <div
      {...other}
      // eslint-disable-next-line react/prop-types
      className={classNames([
        level === 4 &&
          'bg-gray-1 dark:bg-gray-10 text-neutral-text-2 dark:text-neutral-text-2-dark',
        level === 3 &&
          'bg-gray-2 dark:bg-gray-11 text-neutral-text-2 dark:text-neutral-text-2-dark',
        level === 2 &&
          'bg-gray-3 dark:bg-gray-12 text-neutral-text-1 dark:text-neutral-text-1-dark',
        level === 1 &&
          'bg-gray-4 dark:bg-gray-12 text-neutral-text-1 dark:text-neutral-text-1-dark',
        'border-neutral-border',
        'dark:border-neutral-border-dark',
        other.className
      ])}
    ></div>
  )
}
export default Container
