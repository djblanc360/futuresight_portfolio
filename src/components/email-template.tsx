import * as React from 'react';

type EmailTemplateProps = {
  name: string;
  email: string;
  message: string;
}

export function EmailTemplate({ name, email, message }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#1a1f2e',
        padding: '0',
        margin: '0',
      }}
    >
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#222B39',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(185, 116, 82, 0.15)',
        }}
      >
        {/* Header */}
        <tr>
          <td
            style={{
              background: 'linear-gradient(135deg, #B97452 0%, #C17E3D 50%, #D4956A 100%)',
              padding: '32px 40px',
              textAlign: 'center' as const,
            }}
          >
            <h1
              style={{
                margin: '0',
                color: '#FAE3C6',
                fontSize: '28px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              ✨ New Message Received
            </h1>
            <p
              style={{
                margin: '8px 0 0 0',
                color: 'rgba(250, 227, 198, 0.85)',
                fontSize: '14px',
              }}
            >
              Someone reached out through your portfolio
            </p>
          </td>
        </tr>

        {/* Body */}
        <tr>
          <td style={{ padding: '40px' }}>
            {/* Sender Info Card */}
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                marginBottom: '24px',
                border: '1px solid rgba(185, 116, 82, 0.3)',
              }}
            >
              <tr>
                <td style={{ padding: '24px' }}>
                  <table width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={{ paddingBottom: '16px' }}>
                        <span
                          style={{
                            color: '#C17E3D',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase' as const,
                            letterSpacing: '1px',
                          }}
                        >
                          From
                        </span>
                        <p
                          style={{
                            margin: '4px 0 0 0',
                            color: '#FAE3C6',
                            fontSize: '18px',
                            fontWeight: '500',
                          }}
                        >
                          {name}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span
                          style={{
                            color: '#C17E3D',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase' as const,
                            letterSpacing: '1px',
                          }}
                        >
                          Email
                        </span>
                        <p style={{ margin: '4px 0 0 0' }}>
                          <a
                            href={`mailto:${email}`}
                            style={{
                              color: '#D4956A',
                              fontSize: '16px',
                              textDecoration: 'none',
                            }}
                          >
                            {email}
                          </a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            {/* Message Card */}
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                border: '1px solid rgba(185, 116, 82, 0.3)',
              }}
            >
              <tr>
                <td style={{ padding: '24px' }}>
                  <span
                    style={{
                      color: '#C17E3D',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '1px',
                    }}
                  >
                    Message
                  </span>
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '16px',
                      backgroundColor: 'rgba(185, 116, 82, 0.08)',
                      borderRadius: '6px',
                      borderLeft: '3px solid #B97452',
                    }}
                  >
                    <p
                      style={{
                        margin: '0',
                        color: '#FAE3C6',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap' as const,
                      }}
                    >
                      {message}
                    </p>
                  </div>
                </td>
              </tr>
            </table>

            {/* Reply Button */}
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '32px' }}>
              <tr>
                <td style={{ textAlign: 'center' as const }}>
                  <a
                    href={`mailto:${email}?subject=Re: Your message from the portfolio`}
                    style={{
                      display: 'inline-block',
                      padding: '14px 32px',
                      backgroundColor: '#B97452',
                      color: '#FAE3C6',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(185, 116, 82, 0.35)',
                    }}
                  >
                    Reply to {name}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Footer */}
        <tr>
          <td
            style={{
              padding: '24px 40px',
              borderTop: '1px solid rgba(185, 116, 82, 0.2)',
              textAlign: 'center' as const,
            }}
          >
            <p
              style={{
                margin: '0',
                color: 'rgba(250, 227, 198, 0.5)',
                fontSize: '13px',
              }}
            >
              This message was sent from your portfolio contact form
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
}
