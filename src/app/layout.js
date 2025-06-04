import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', backgroundColor: '#ddd' }}>
          <nav>
            <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
            <Link href="/videos" style={{ marginRight: '1rem' }}>Videos</Link>
          </nav>
        </header>
        <main style={{ padding: '1rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}