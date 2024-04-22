import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../services/firebaseConfig";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";
import { toast } from "react-toastify";

interface iUserProviderProps {
  children: ReactNode;
}

interface iUserValues {
  user: User | null | undefined;
  NameLoja: string;
  upload: (event: any, album: string) => Promise<void>;
  shopping: string | null;
}

export const AuthContext = createContext<iUserValues>({} as iUserValues);

function AuthProvider({ children }: iUserProviderProps) {
  const [uploadFile, uploading, snapshot, errors] = useUploadFile();

  const [user, loading, error] = useAuthState(auth);
  const [NameLoja, setNameLoja] = useState("");
  const navigate = useNavigate();
  const idUser = localStorage.getItem("@idUser");
  const emailUser = localStorage.getItem("@emailUser");
  const shopping = localStorage.getItem("@shopping");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      }
      if (error) {
        console.log(error);
      }
    }
  }, [user, loading]);

  useEffect(() => {
    getName();
  });

  async function getName() {
    //Métdo para pegar o nome da loja
    const lojaref = collection(db, `${shopping}`, "lojas", "lojas");
    const q = query(lojaref, where("user", "==", `${user?.uid}`));
    let loja: Array<any> = [];
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loja.push(data);
      });
      setNameLoja(loja[0].nomeLoja);
    } catch (error) {
      console.log(error);
    }
  }

  async function upload(event: any, album: string) {
    event.preventDefault();

    const file = event.target[0].files[0];

    const regex = /([^@]+)/;
    const match = emailUser!.match(regex);
    const username = match ? match[1] : null;

    // Verificando se o nomeLoja do usuário foi extraído com sucesso
    if (username && file) {
      // Criando a referência no Firebase Storage
      const reference = ref(
        storage,
        `${album}/${username}/${idUser}/${file.name}`
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

        //ciração do objeto de cupom
        const data = {
          imgUrl,
          estaAtivo: true,
          nomeLoja: NameLoja,
          user: user?.uid,
        };

        const firestoreRef = collection(
          db,
          `${shopping}`,
          "lojas",
          "lojas",
          `${user?.uid}`,
          `${album}`
        );

        try {
          await setDoc(doc(firestoreRef), data);
          toast.success("Square Adicionado com Sucesso!");
        } catch (error) {
          toast.error("Algo deu errado!");
          console.log(error);
        }
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        NameLoja,
        upload,
        shopping,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
