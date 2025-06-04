// Preview page (might add thumbnails later)

export default function PreviewPage({ params }) {
  const { filename } = params;

  return (
    <div>
      <h1>Preview Page</h1>
      <p>Now previewing: <strong>{filename}</strong></p>
    </div>
  );
}