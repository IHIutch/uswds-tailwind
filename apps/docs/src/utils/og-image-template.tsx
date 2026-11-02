import type { ogImageProps } from 'types'
import logo from '../../public/logo.svg?raw'

export default ({
  title,
  description,
  isHome = false,
}: ogImageProps) => {
  return (
    <div
      style={{
        background: '#112f4e',
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '5rem 7rem',
        fontSize: '0.5rem',
        fontFamily: 'Public Sans',
        flexDirection: 'column',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src={`data:image/svg+xml,${encodeURIComponent(logo)}`}
          width={isHome ? 128 : 96}
          style={{
            width: isHome ? '128px' : '96px',
          }}
        />
        {isHome
          ? null
          : (
              <p
                style={{
                  fontSize: '2.75rem',
                  lineHeight: '2.5rem',
                  fontWeight: '700',
                  marginLeft: '2.5rem',
                }}
              >
                USWDS + Tailwind
              </p>
            )}
      </div>
      {isHome
        ? (
            <div style={{
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
            >
              <p
                style={{
                  fontSize: '6rem',
                  fontWeight: '700',
                  marginTop: '2rem',
                }}
              >
                {title}
              </p>
              <p
                style={{
                  fontSize: '2.5rem',
                  lineHeight: '3.5rem',
                  fontWeight: '400',
                  marginTop: '1.5rem',
                }}
              >
                {description}
              </p>
            </div>
          )
        : (
            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  fontSize: '5.5rem',
                  lineHeight: '6.25rem',
                  fontWeight: '700',
                  marginBottom: '2rem',
                }}
              >
                {title}
              </p>
              <p
                style={{
                  display: 'block',
                  fontSize: '2.5rem',
                  lineHeight: '3.5rem',
                  fontWeight: '400',
                  lineClamp: 2,
                  overflow: 'hidden',
                }}
              >
                {description}
              </p>
            </div>
          )}
    </div>
  )
}
