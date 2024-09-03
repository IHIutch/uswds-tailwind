import type { ogImageProps } from "types"

export default ({
  title,
  description,
  isHome = false
}: ogImageProps) => {

  return (
    <div
      style={{
        background: '#112f4e',
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '10rem 14rem',
        fontSize: '1rem',
        fontFamily: 'Public Sans',
        flexDirection: 'column',
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src={import.meta.env.SITE + "/logo.svg"}
          width={isHome ? 256 : 192}
          style={{
            width: isHome ? '256px' : '192px',
          }}
        />
        {isHome ? null : (
          <p
            style={{
              fontSize: '5.5rem',
              lineHeight: '5rem',
              fontWeight: '700',
              marginLeft: '5rem',
            }}
          >
            USWDS + Tailwind
          </p>
        )}
      </div>
      {isHome ? (
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <p
            style={{
              fontSize: '12rem',
              fontWeight: '700',
              marginTop: '4rem',
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: '5rem',
              lineHeight: '7rem',
              fontWeight: '400',
              marginTop: '3rem',
            }}
          >
            {description}
          </p>
        </div>
      ) : (
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <p
            style={{
              fontSize: '11rem',
              lineHeight: '12.5rem',
              fontWeight: '700',
              marginBottom: '4rem',
            }}
          >
            {title}
          </p>
          <p
            style={{
              display: 'block',
              fontSize: '5rem',
              lineHeight: '7rem',
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
