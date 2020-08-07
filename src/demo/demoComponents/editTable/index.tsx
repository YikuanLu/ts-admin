import React, { FC, useState, useRef, useEffect } from 'react'

function usePrevious(value: number): number {
  const ref = useRef(0)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const EditTable: FC = () => {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)
  return (
    <div>
      <h1>
        Now:
        {' '}
        {count}
        , before:
        {' '}
        {prevCount}
      </h1>
      <button
        type="button"
        onClick={(): void => {
          setCount((val) => val + 1)
        }}
      >
        +
      </button>
    </div>
  )
}

export default EditTable
