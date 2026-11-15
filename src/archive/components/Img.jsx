/** 빌드 때 만든 WebP 변형(srcset)을 쓰는 이미지. width/height로 레이아웃 흔들림을 막는다. */
export default function Img({ image, sizes = '100vw', className = '', eager = false, alt }) {
  if (!image) return null;
  return (
    <img
      src={image.src}
      srcSet={image.srcset || undefined}
      sizes={image.srcset ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt ?? ''}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={`block bg-ink/5 ${className}`}
    />
  );
}
