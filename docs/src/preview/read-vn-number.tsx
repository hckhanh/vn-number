'use client'

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { useState } from 'react'
import { readVnNumber } from 'vn-number'

export function ReadVnNumber() {
  const [number, setNumber] = useState('')

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value)
  }

  const displayCode = `import { readVnNumber } from 'vn-number';

const result = readVnNumber(${number});
// result: ${number && !number.startsWith('-') ? readVnNumber(number) : '(Enter a number below \u{1F447} to see the result)'}`

  return (
    <div>
      <DynamicCodeBlock code={displayCode} lang='ts' />
      <div className='mt-4 sm:w-1/2'>
        <label
          className='block font-medium text-gray-900 text-sm/6 dark:text-white'
          htmlFor='input-example'
        >
          Enter any non-negative number &#x2728;
        </label>
        <div className='mt-2'>
          <input
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-500 focus:-outline-offset-2 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500'
            id='input-example'
            name='input-example'
            onChange={handleNumberChange}
            type='number'
            value={number}
          />
        </div>
      </div>
    </div>
  )
}
