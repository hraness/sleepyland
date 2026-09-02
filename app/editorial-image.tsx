import Image from "next/image";

import type { EditorialImage } from "./editorial-images";

export function EditorialImageFigure({
  image,
  preload = false,
  sizes = "(max-width: 46rem) calc(100vw - 2rem), 46rem",
  variant = "banner",
}: Readonly<{
  image: EditorialImage;
  preload?: boolean;
  sizes?: string;
  variant?: "banner" | "interstitial";
}>) {
  return (
    <figure
      className="editorial-image"
      data-editorial-image-kind={image.kind}
      data-editorial-image-variant={variant}
    >
      <Image
        alt={image.alt}
        className="editorial-image__asset"
        height={image.height}
        preload={preload}
        sizes={sizes}
        src={image.src}
        width={image.width}
      />
      <figcaption className="editorial-image__caption">
        <span>{image.caption}</span>
        <small>{image.credit}</small>
      </figcaption>
    </figure>
  );
}

export function EditorialImageThumbnail({
  image,
  sizes,
}: Readonly<{
  image: EditorialImage;
  sizes: string;
}>) {
  return (
    <Image
      alt=""
      className="editorial-image__thumbnail"
      height={image.height}
      sizes={sizes}
      src={image.src}
      width={image.width}
    />
  );
}
