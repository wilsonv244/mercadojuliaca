export function Dashboard1Iframe({ src, title, width, height, display }) {
  return (
    <iframe
      src={src}
      title={title}
      style={{ height: height + "vh", display: display }}
      width="100%"
      allowFullScreen
    />
  );
}
