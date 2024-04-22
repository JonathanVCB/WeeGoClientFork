import {
  CropContainer,
  FormContainer,
  ListSquares,
  UploadContainer,
} from "./style";
import { useContext } from "react";
import { AuthContext } from "../../contexts/UserContext";
import React, { useState, useRef } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "../Crop/canvasPreview";
import { useDebounceEffect } from "../Crop/useDebounceEffect";
import "react-image-crop/dist/ReactCrop.css";
import CardStorieSquareCupom from "../cards";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const SquareUpload = ({ squares }: any) => {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(1 / 1);

  const { upload } = useContext(AuthContext);

  //começa aqui
  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  //termina aqui

  return (
    <>
      <FormContainer onSubmit={(event) => upload(event, "squares")}>
        <UploadContainer>
          <label htmlFor="banner_pic">Selecione seu Square</label>
          <input
            type="file"
            id="banner_pic"
            accept=".jpg, .jpeg, .png"
            onChange={onSelectFile}
          />
        </UploadContainer>
        {!!imgSrc && (
          <CropContainer>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              maxWidth={300}
              maxHeight={300}
              minWidth={171}
              minHeight={234}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            {completedCrop && (
              <>
                <div>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      border: "1px solid black",
                      objectFit: "contain",
                      width: completedCrop.width,
                      height: completedCrop.height,
                      margin: "0 auto",
                      display: "none",
                    }}
                  />
                </div>
              </>
            )}
          </CropContainer>
        )}

        <button type="submit">Publicar</button>
      </FormContainer>
      <ListSquares>
        {squares?.map((squares: any) => (
          <CardStorieSquareCupom
            key={squares.imgUrl}
            card={squares}
            doc={"squares"}
          />
        ))}
      </ListSquares>
    </>
  );
};

export default SquareUpload;
