import type { Config, PluginUtils } from 'tailwindcss/plugin'
import tailwindTypography from '@tailwindcss/typography'

const config = {
  plugins: [tailwindTypography()],
  theme: {
    extend: {
      typography: ({ theme }: PluginUtils) => ({
        DEFAULT: {
          css: {
            'maxWidth': theme('--container-prose'),
            'fontFamily': theme('--font-source-sans'),
            '--font-normalization': theme('--font-source-sans--multiplier'),
            'fontSize': theme('--text-base'),
            'lineHeight': theme('--leading-normal'),
            'color': theme('--color-black'),

            'code': {
              'fontFamily': theme('--font-roboto-mono'),
              '--font-normalization': theme('--font-roboto-mono--multiplier'),
            },
            'kbd': {
              'fontFamily': theme('--font-roboto-mono'),
              '--font-normalization': theme('--font-roboto-mono--multiplier'),
              'borderRadius': theme('rounded'),
              'border': `0.5px solid ${theme('--color-gray-cool-30')}`,
              'color': theme('--color-black'),
              'boxShadow': `0 2px 0px ${theme('--color-gray-cool-20')}, 0 3px 2px ${theme('--color-gray-cool-50')}, 0 2px 0 0 ${theme('--color-white')} inset`,
              'background': theme('--color-gray-cool-2'),
              'backgroundImage': `linear-gradient(to bottom, ${theme('--color-gray-cool-5')}, ${theme('--color-gray-cool-1')})`,
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            'a': {
              'color': theme('--color-blue-60v'),
              'textDecoration': 'underline',
              '&:visited': {
                color: theme('--color-violet-70v'),
              },
            },

            '> * + *': {
              marginTop: '--spacing(4)',
              marginBottom: 0,
            },

            // List style
            'ol': {
              listStyle: 'revert',
              marginBottom: '--spacing(1)',
              marginTop: '--spacing(4)',
              lineHeight: theme('--leading-normal'),
              paddingLeft: '--spacing(6)',
            },
            'ul': {
              listStyle: 'revert',
              marginBottom: '--spacing(1)',
              marginTop: '--spacing(4)',
              lineHeight: theme('--leading-normal'),
              paddingLeft: '--spacing(6)',
            },
            'li': {
              marginTop: '--spacing(1)',
              marginBottom: '--spacing(1)',
            },
            'li::marker': {
              color: 'inherit',
            },
            'ul ul': {
              marginTop: '--spacing(1)',
              paddingLeft: '--spacing(10)',
            },
            'ul ol': {
              marginTop: '--spacing(1)',
              paddingLeft: '--spacing(10)',
            },
            'ul li': {
              marginBottom: '--spacing(1)',
              paddingLeft: 0,
            },
            'ol ol': {
              marginTop: '--spacing(1)',
              paddingLeft: '--spacing(10)',
            },
            'ol ul': {
              marginTop: '--spacing(1)',
              paddingLeft: '--spacing(10)',
            },
            'ol li': {
              marginBottom: '--spacing(1)',
              paddingLeft: 0,
            },
            'ol:last-child': {
              marginBottom: 0,
            },
            'ul:last-child': {
              marginBottom: 0,
            },
            'li:last-child': {
              marginBottom: 0,
            },

            // Table styles
            '> table': {
              fontSize: theme('--text-base'),
              lineHeight: theme('--leading-normal'),
              borderCollapse: 'collapse',
              borderSpacing: 0,
              color: theme('--color-gray-90'),
              margin: '--spacing(5) 0',
              textAlign: 'left',
            },
            '> table th': {
              backgroundColor: theme('--color-white'),
              border: `1px solid ${theme('--color-gray-90')}`,
              fontWeight: theme('--font-normal'),
              padding: '--spacing(2) --spacing(4)',
              verticalAlign: 'middle',
            },
            '> table td': {
              backgroundColor: theme('--color-white'),
              border: `1px solid ${theme('--color-gray-90')}`,
              fontWeight: theme('--font-normal'),
              padding: '--spacing(2) --spacing(4)',
              verticalAlign: 'middle',
            },
            '> table caption': {
              textAlign: 'left',
              fontSize: theme('--text-base'),
              fontWeight: theme('--font-bold'),
              marginBottom: '--spacing(3)',
            },
            '> table th[data-sortable]': {
              paddingRight: '--spacing(10)',
              position: 'relative',
            },
            '> table th[data-sortable]::after': {
              borderBottomColor: 'transparent',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1px',
              bottom: 0,
              content: '""',
              height: 0,
              left: 0,
              position: 'absolute',
              width: '100%',
            },
            '> table tbody th': {
              textAlign: 'left',
            },
            '> table thead th': {
              backgroundColor: theme('--color-gray-cool-10'),
              color: theme('--color-gray-90'),
              backgroundClip: 'padding-box',
              fontWeight: theme('--font-bold'),
              lineHeight: theme('--leading-tight'),
            },
            '> table thead td': {
              backgroundColor: theme('--color-gray-cool-10'),
              color: theme('--color-gray-90'),
            },

            // Text styles
            '> p': {
              lineHeight: theme('--leading-normal'),
            },
            '> h1': {
              marginBottom: 0,
              marginTop: 0,
            },
            '> h2': {
              marginBottom: 0,
              marginTop: 0,
            },
            '> h3': {
              marginBottom: 0,
              marginTop: 0,
            },
            '> h4': {
              marginBottom: 0,
              marginTop: 0,
            },
            '> h5': {
              marginBottom: 0,
              marginTop: 0,
            },
            '> h6': {
              marginBottom: 0,
              marginTop: 0,
            },
            '> * + h1': {
              marginTop: '--spacing(8)',
            },
            '> * + h2': {
              marginTop: '--spacing(8)',
            },
            '> * + h3': {
              marginTop: '--spacing(8)',
            },
            '> * + h4': {
              marginTop: '--spacing(8)',
            },
            '> * + h5': {
              marginTop: '--spacing(8)',
            },
            '> * + h6': {
              marginTop: '--spacing(8)',
            },
            'h1': {
              'fontSize': theme('--text-4xl'),
              'fontFamily': theme('--font-merriweather'),
              '--font-normalization': theme('--font-merriweather--multiplier'),
              'lineHeight': theme('--leading-tight'),
              'fontWeight': theme('--font-bold'),
            },
            'h2': {
              'fontSize': theme('--text-3xl'),
              'fontFamily': theme('--font-merriweather'),
              '--font-normalization': theme('--font-merriweather--multiplier'),
              'lineHeight': theme('--leading-tight'),
              'fontWeight': theme('--font-bold'),
            },
            'h3': {
              'fontSize': theme('--text-xl'),
              'fontFamily': theme('--font-merriweather'),
              '--font-normalization': theme('--font-merriweather--multiplier'),
              'lineHeight': theme('--leading-tight'),
              'fontWeight': theme('--font-bold'),
            },
            'h4': {
              'fontSize': theme('--text-lg'),
              'fontFamily': theme('--font-merriweather'),
              '--font-normalization': theme('--font-merriweather--multiplier'),
              'lineHeight': theme('--leading-tight'),
              'fontWeight': theme('--font-bold'),
            },
            'h5': {
              'fontSize': theme('--text-base'),
              'fontFamily': theme('--font-public-sans'),
              '--font-normalization': theme('--font-public-sans--multiplier'),
              'lineHeight': theme('--leading-tight'),
              'fontWeight': theme('--font-bold'),
            },
            'h6': {
              'fontSize': theme('--text-sm'),
              'fontFamily': theme('--font-source-sans'),
              '--font-normalization': theme('--font-source-sans--multiplier'),
              'lineHeight': theme('--leading-none'),
              'fontWeight': theme('--font-normal'),
              'letterSpacing': theme('--tracking-wide'),
              'textTransform': 'uppercase',
            },
          },
        },
      }),
    },
  },
} satisfies Omit<Config, 'content'>

export default config
