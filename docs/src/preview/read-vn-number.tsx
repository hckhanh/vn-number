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
      <div className='mt-4 w-1/2'>
        <label
          className='block font-medium text-sm/6 text-white'
          htmlFor='input-example'
        >
          Enter any non-negative number &#x2728;
        </label>
        <div className='mt-2'>
          <input
            className='-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-blue-500 sm:text-sm/6'
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
