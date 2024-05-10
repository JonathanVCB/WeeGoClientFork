import { useContext } from "react";
import { ContainerCards } from "./style";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { AuthContext } from "../../contexts/UserContext";

const CardStorieSquareCupom = ({ card, doc }: any) => {
  const { user, shopping } = useContext(AuthContext);

  async function toggleStatus() {
    try {
      // Encontra o documento no Firebase com a mesma imgUrl
      const storiesRef = collection(
        db,
        `${shopping}`,
        "lojas",
        `lojas/${user?.uid}/${doc}`
      );
      const q = query(storiesRef, where("imgUrl", "==", card.imgUrl));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        // Atualiza o documento encontrado com o novo estado
        await updateDoc(doc.ref, {
          estaAtivo: !card.estaAtivo,
        });
      });
    } catch (error) {
      console.error("Erro ao atualizar o estado da história:", error);
    }
  }
  return (
    <ContainerCards>
      <h5>{card.nomeLoja}</h5>
      <img src={card.imgUrl} alt="" />
      <div onClick={toggleStatus}>
        {card.estaAtivo ? <p>Ativo</p> : <span>Inativo</span>}
      </div>
    </ContainerCards>
  );
};

export default CardStorieSquareCupom;
