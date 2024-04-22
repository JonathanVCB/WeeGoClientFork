import { FormContainer, ListCupons, UploadContainer } from "./style";
import { db } from "../../services/firebaseConfig";
import { toast } from "react-toastify";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../../contexts/UserContext";
import CardStorieSquareCupom from "../cards";

const CupomUpload = ({ cupons }: any) => {
  const { user, shopping, NameLoja } = useContext(AuthContext);

  async function upload(event: any) {
    event.preventDefault();

    // Transforma a data e a hora em um timestamp do Firebase
    const dataHora = new Date(
      `${event.target[2].value}T${event.target[3].value}`
    );
    const timestamp = Timestamp.fromDate(dataHora);

    const data = {
      codigoCupom: event.target[0].value,
      descricaoCupom: event.target[1].value,
      estaAtivo: true,
      expiracao: timestamp.toDate(),
      nomeLoja: NameLoja,
      tipoDesconto: "valor",
      // tipoDesconto: event.target[4].value,
      user: user?.uid,
      valorCupom: Number(event.target[4].value),
    };

    console.log(data);

    const firestoreRef = collection(
      db,
      `${shopping}`,
      "lojas",
      "lojas",
      `${user?.uid}`,
      "cupons"
    );

    try {
      await setDoc(doc(firestoreRef), data);
      toast.success("Cupom adicionado com Sucesso!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <FormContainer onSubmit={upload}>
        <UploadContainer>
          <label htmlFor="codigoCupom">Escreva o código do cupom</label>
          <input type="text" id="codigoCupom" />

          <label htmlFor="descricaoCupom">Escreva a descrição do cupom</label>
          <input type="text" id="descricaoCupom" />

          <label htmlFor="data">Data:</label>
          <input type="date" id="data" name="data" />

          <label htmlFor="hora">Hora:</label>
          <input type="time" id="hora" name="hora" />

          <label htmlFor="valorCupom">Escreva o valor do desconto</label>
          <input type="number" id="valorCupom" />

          {/* <select name="tipodesConto" id="tipodesConto">
            <option value="valor">$</option>
            <option value="porcentagem">%</option>
          </select> */}
        </UploadContainer>
        <button type="submit">Enviar</button>
      </FormContainer>
      <ListCupons>
        {cupons?.map((cupons: any) => (
          <CardStorieSquareCupom
            key={cupons.codigoCupom}
            card={cupons}
            doc={"cupons"}
          />
        ))}
      </ListCupons>
    </>
  );
};

export default CupomUpload;
