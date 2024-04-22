import {
  Container,
  ContentContainer,
  DivOptions,
  DivWeego,
  FooterContainer,
  LateralMenu,
  MenuHeader,
  PageContainer,
} from "./style";
import PinLogo from "../../assets/PinLogo.png";
import LogoLojaMenu from "../../assets/LogoLojaMenu.png";
import LogoWeeGo from "../../assets/Logo.png";
import Home from "../../assets/Home.png";
import Phone from "../../assets/PhoneIcon.png";
import Mail from "../../assets/MailIcon.png";
import Notification from "../../assets/Notification.png";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebaseConfig";
import StorieUpload from "../../components/storie";
import SquareUpload from "../../components/square";
import LogoUpload from "../../components/logo";
import ModalUpdatePass from "../../components/modalUpdatePass";
import { AuthContext } from "../../contexts/UserContext";
import {
  Timestamp,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Plans from "../../components/plans";
import CupomUpload from "../../components/cupom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [signOut, loading, errors] = useSignOut(auth);

  const [StorieShow, setStorieShow] = useState(false);
  const [LogoShow, setLogoShow] = useState(false);
  const [SquareShow, setSquareShow] = useState(false);
  const [CupomShow, setCupomShow] = useState(false);

  const [PlanLoja, setPlanLoja] = useState("");

  const [ClassButtonLogo, setClassButtonLogo] = useState("");
  const [ClassButtonSquare, setClassButtonSquare] = useState("");
  const [ClassButtonStorie, setClassButtonStorie] = useState("");
  const [ClassButtonCupom, setClassButtonCupom] = useState("");

  const [planShow, setplanShow] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [squares, setSquares] = useState<Square[]>([]);
  const [cupons, setCupons] = useState<Cupom[]>([]);

  const { user, NameLoja, shopping } = useContext(AuthContext);

  interface Story {
    estaAtivo: boolean;
    imgUrl: string;
    nomeLoja: string;
    user: string;
  }
  interface Square {
    estaAtivo: boolean;
    imgUrl: string;
    nomeLoja: string;
    user: string;
  }
  interface Cupom {
    codigoCupom: string;
    estaAtivo: boolean;
    expiracao: Timestamp;
    nomeLoja: string;
    tipodesConto: string;
    user: string;
    valorCupom: number;
  }

  useEffect(() => {
    const fetchData = async () => {
      await getStories();
      await getSquares();
      await getCupons();
    };

    fetchData();
  }, [user]);
  getPlan();

  async function getStories() {
    const storiesaref = collection(
      db,
      `${shopping}`,
      "lojas",
      `lojas/${user?.uid}/stories`
    );
    const qstorie = query(storiesaref, where("user", "==", `${user?.uid}`));
    const stories = onSnapshot(qstorie, (querySnapshot: any) => {
      let storiesData: Story[] = [];
      querySnapshot.forEach((doc: any) => {
        const data = doc.data() as Story;
        storiesData.push(data);
      });
      setStories(storiesData);
    });
  }

  async function getSquares() {
    const squareref = collection(
      db,
      `${shopping}`,
      "lojas",
      `lojas/${user?.uid}/squares`
    );
    const qsquare = query(squareref, where("user", "==", `${user?.uid}`));
    const squares = onSnapshot(qsquare, (querySnapshot: any) => {
      let squareData: Square[] = [];
      querySnapshot.forEach((doc: any) => {
        const data = doc.data() as Square;
        squareData.push(data);
      });
      setSquares(squareData);
    });
  }

  async function getCupons() {
    const cuponsRef = collection(
      db,
      `${shopping}`,
      "lojas",
      `lojas/${user?.uid}/cupons`
    );
    const qcupons = query(cuponsRef, where("user", "==", `${user?.uid}`));
    const cupons = onSnapshot(qcupons, (querySnapshot: any) => {
      let cuponsData: Cupom[] = [];
      querySnapshot.forEach((doc: any) => {
        const data = doc.data() as Cupom;
        cuponsData.push(data);
      });
      setCupons(cuponsData);
    });
  }

  async function getPlan() {
    //Métdo para pegar o tipo de plano da loja
    const lojaref = collection(db, `${shopping}`, "lojas", "lojas");
    const q = query(lojaref, where("user", "==", `${user?.uid}`));

    try {
      let loja: Array<any> = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loja.push(data);
      });
      setPlanLoja(loja[0].tipoPlano);
    } catch (error) {}
  }

  async function logOut() {
    const sucess = await signOut();
    if (sucess) {
      toast.success("Deslogado com sucesso!");
      navigate("/login");
      localStorage.clear();
    }
  }
  function showStorie() {
    setStorieShow(true);
    setLogoShow(false);
    setSquareShow(false);
    setCupomShow(false);
    setClassButtonLogo("");
    setClassButtonSquare("");
    setClassButtonStorie("onFocus");
    setClassButtonCupom("");
  }
  function showLogo() {
    setStorieShow(false);
    setLogoShow(true);
    setSquareShow(false);
    setCupomShow(false);
    setClassButtonLogo("onFocus");
    setClassButtonSquare("");
    setClassButtonStorie("");
    setClassButtonCupom("");
  }
  function showSquare() {
    setStorieShow(false);
    setLogoShow(false);
    setSquareShow(true);
    setCupomShow(false);
    setClassButtonLogo("");
    setClassButtonSquare("onFocus");
    setClassButtonStorie("");
    setClassButtonCupom("");
  }

  function showPlans() {
    setClassButtonLogo(`hidden`);
    setClassButtonSquare(`hidden`);
    setClassButtonStorie(`hidden`);
    setClassButtonCupom("hidden");
    setLogoShow(false);
    setSquareShow(false);
    setStorieShow(false);
    setplanShow(true);
    setCupomShow(false);
  }
  function showCupom() {
    setStorieShow(false);
    setLogoShow(false);
    setSquareShow(false);
    setCupomShow(true);
    setClassButtonLogo("");
    setClassButtonSquare("");
    setClassButtonStorie("");
    setClassButtonCupom("onFocus");
  }

  function showModalPassword() {
    setModalPassword(true);
  }

  function closeModalPassword() {
    setModalPassword(false);
  }

  return (
    <Container>
      <LateralMenu>
        <div>
          <img src={PinLogo} alt="PinLogo" />
        </div>
        <div>
          <img src={LogoLojaMenu} alt="LogoLojaMenu" />
        </div>
        <div id="home">
          <img src={Home} alt="Home" onClick={() => window.location.reload()} />
        </div>
        <button onClick={logOut}>Log out</button>
      </LateralMenu>
      <MenuHeader>
        <h1>Home</h1>
        <div>
          <button onClick={showModalPassword}>Mudar Senha</button>
          <img src={Notification} alt="" />
          {NameLoja && <p>{NameLoja} </p>}
        </div>
      </MenuHeader>

      <PageContainer>
        <DivWeego>
          <img src={LogoWeeGo} alt="Logo Wee Go" />
          <div>
            <img src={Phone} alt="" />
            <p>+55 00 0000-0000</p>
          </div>
          <div>
            <img src={Mail} alt="" />
            <p>email@weego.com</p>
          </div>
          <h5 onClick={showPlans}>Conheça nossos planos</h5>
        </DivWeego>
        <ContentContainer>
          <DivOptions>
            {PlanLoja === "silver" && (
              <>
                <button className={ClassButtonLogo} onClick={showLogo}>
                  Imagem logo
                </button>
                <button className={ClassButtonStorie} onClick={showStorie}>
                  Stories
                </button>
              </>
            )}

            {PlanLoja === "gold" && (
              <>
                <button className={ClassButtonLogo} onClick={showLogo}>
                  Imagem logo
                </button>
                <button className={ClassButtonSquare} onClick={showSquare}>
                  Square Balão
                </button>
              </>
            )}

            {PlanLoja === "platinum" && (
              <>
                <button className={ClassButtonLogo} onClick={showLogo}>
                  Imagem logo
                </button>
                <button className={ClassButtonSquare} onClick={showSquare}>
                  Square Balão
                </button>
                <button className={ClassButtonStorie} onClick={showStorie}>
                  Stories
                </button>
                <button className={ClassButtonCupom} onClick={showCupom}>
                  Cupons
                </button>
              </>
            )}

            {PlanLoja === "shop" && (
              <>
                <button className={ClassButtonLogo} onClick={showLogo}>
                  Imagem logo
                </button>
                <button className={ClassButtonStorie} onClick={showStorie}>
                  Stories
                </button>
              </>
            )}
          </DivOptions>
          {StorieShow && <StorieUpload stories={stories} />}
          {LogoShow && <LogoUpload />}
          {SquareShow && <SquareUpload squares={squares} />}
          {planShow && <Plans planLoja={PlanLoja} />}
          {CupomShow && <CupomUpload cupons={cupons} />}
        </ContentContainer>
      </PageContainer>

      <FooterContainer>
        <img src={LogoWeeGo} alt="Logo Wee Go" />
        <p>
          2024 <strong>WeeGo Technologies®</strong> Todos os direitos reservados
        </p>
        <p>Termos de Uso</p>
        <p>Contato</p>
      </FooterContainer>
      {modalPassword && (
        <ModalUpdatePass closeModalPassword={closeModalPassword} />
      )}
    </Container>
  );
};

export default DashboardPage;
