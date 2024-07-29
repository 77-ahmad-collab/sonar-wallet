import { CSSProperties, useEffect, useState } from "react";

import { ImageContentBox } from "components/styled";
import { DUMMY_IMAGE_URL } from "utils/constants";

interface IProps {
  top?: boolean;
  Opacity?: boolean;
  Logo?: boolean;
  Size?: CSSProperties;
  src?: string;
  alt?: string;
  className?: string;
}

const ImageContent = ({
  top,
  Opacity,
  Logo,
  Size,
  src = DUMMY_IMAGE_URL,
  alt = "DUMMY_IMAGE_ALT_TEXT",
  className,
}: IProps) => {
  const [srcToRender, setSrcToRender] = useState(src);

  useEffect(() => {
    setSrcToRender(src);
  }, [src]);

  return (
    <ImageContentBox
      top={top}
      Opacity={Opacity}
      Logo={Logo}
      Size={Size}
      src={srcToRender}
      alt={alt}
      className={className}
      onError={() => setSrcToRender(DUMMY_IMAGE_URL)}
    />
  );
};

export default ImageContent;
