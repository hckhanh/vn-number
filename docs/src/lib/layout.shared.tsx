import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: 'https://github.com/hckhanh/vn-number',
    nav: {
      title: (
        <span>
          🇻🇳<span className='ml-2'>vn-number</span>
        </span>
      ),
      url: '/docs',
    },
  }
}
