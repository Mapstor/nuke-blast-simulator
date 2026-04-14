export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XDZQYKGTE2"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XDZQYKGTE2');
          `,
        }}
      />
      {children}
    </>
  )
}