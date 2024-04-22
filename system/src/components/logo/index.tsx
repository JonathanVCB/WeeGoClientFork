import { CropContainer, FormContainer, UploadContainer } from "./style";
import { db, storage } from "../../services/firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
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

const LogoUpload = () => {
  const [uploadFile, uploading, snapshot, error] = useUploadFile();

  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(1 / 1);

  const idUser = localStorage.getItem("@idUser");
  const emailUser = localStorage.getItem("@emailUser");
  const { user, shopping } = useContext(AuthContext);

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

  async function onDownloadCropClick() {
    const image = imgRef.current;

    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Obtém o contexto 2D do canvas
    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    const ctx = previewCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Desenha a imagem no canvas
    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    // Converte o canvas em um blob
    const blob = await new Promise<Blob | null>((resolve) => {
      previewCanvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });

    if (!blob) {
      throw new Error("Failed to convert canvas to blob");
    }

    // Cria um arquivo a partir do blob
    const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });

    return file;
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

  async function upload(event: any) {
    event.preventDefault();

    // const file = event.target[0].files[0];
    const file = await onDownloadCropClick();
    console.log(file);

    const regex = /([^@]+)/;
    const match = emailUser!.match(regex);
    const username = match ? match[1] : null;

    // Verificando se o nomeLoja do usuário foi extraído com sucesso
    if (username && file) {
      // Criando a referência no Firebase Storage
      const reference = ref(
        storage,
        `logos/${username}/${idUser}/${file.name}`
      );

      try {
        await getDownloadURL(reference);
      } catch (error) {
        // Se ocorrer um erro, a pasta não existe, então criamos
        // Criando a pasta
        await uploadBytes(reference, new Uint8Array());
      }

      const result = await uploadFile(reference, file, {
        contentType: "image/jpeg",
      });
      if (result) {
        const imgUrl = await getDownloadURL(result.ref);

        // Atualização da logoUrl
        const firestoreRef = doc(
          db,
          `${shopping}`,
          "lojas",
          "lojas",
          `${user?.uid}`
        );

        try {
          await updateDoc(firestoreRef, {
            logoUrl: imgUrl,
          });
          toast.success("Logo Adicionada com Sucesso!");
        } catch (error) {
          toast.error("Algo deu errado!");
          console.log(error);
        }
      }
    }
  }

  return (
    <>
      <FormContainer onSubmit={upload}>
        <UploadContainer>
          <label htmlFor="banner_pic">Selecione sua Logo</label>
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
              minWidth={250}
              minHeight={250}
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
    </>
  );
};

export default LogoUpload;
