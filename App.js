import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from "react-native";

/**
 * App.js completo
 * - Home (saudação + botão Iniciar + assinatura)
 * - Menu Principal (categorias)
 * - Onílẹ̀ e Èègúngún (conteúdo/descrição)
 * - Adimú (lista dos alimentos/itens)
 * - Cursos (acesso protegido por login local — 10 contas)
 * - Calendário de Festas (descrição + cadastro protegido por senha 'administrador')
 * - Contatos / Perguntas Frequentes (botões que mostram Alert com respostas e opção de enviar via WhatsApp)
 * - Assentamento (descrição)
 *
 * Observações:
 * - Login é local (sem banco). Primeiro usuário já cadastrado: arleirufino2015@gmail.com / administrador
 * - Demais 9 espaços listados em 'users' ficam prontos para edição.
 * - Ao clicar em "Cursos" abre uma modal de login se não estiver logado.
 * - Cadastros de festas são salvos em memória na sessão (variável de estado).
 */

/* -----------------------------
   Lista de logins (configurável)
   Preencha aqui com novos usuários quando quiser.
   Cada item: { email: '', senha: '', nome: '' }
   ----------------------------- */
const initialUsers = [
  { email: "arleirufino2015@gmail.com", senha: "administrador", nome: "Arlêi Rufino" },
  { email: "", senha: "", nome: "" }, // espaço 2
  { email: "", senha: "", nome: "" }, // espaço 3
  { email: "", senha: "", nome: "" }, // espaço 4
  { email: "", senha: "", nome: "" }, // espaço 5
  { email: "", senha: "", nome: "" }, // espaço 6
  { email: "", senha: "", nome: "" }, // espaço 7
  { email: "", senha: "", nome: "" }, // espaço 8
  { email: "", senha: "", nome: "" }, // espaço 9
  { email: "", senha: "", nome: "" }, // espaço 10
];

/* Senha única do calendário (usar administrador por padrão) */
const CALENDARIO_SENHA = "administrador";

export default function App() {
  const [screen, setScreen] = useState("home");

  // Estado do sistema de usuários/local login
  const [users, setUsers] = useState(initialUsers);
  const [loggedUser, setLoggedUser] = useState(null); // objeto { email, nome }
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginMensagem, setLoginMensagem] = useState("");

  // Calendário: senha + formulário + lista (em memória)
  const [calSenha, setCalSenha] = useState("");
  const [calNome, setCalNome] = useState("");
  const [calData, setCalData] = useState("");
  const [calDescricao, setCalDescricao] = useState("");
  const [festas, setFestas] = useState([]);

  // Perguntas (dúvidas frequentes) — exemplos
  const perguntasFreq = [
    { q: "O que é Èègúngún?", a: "Èègúngún representa os ancestrais que retornam à Terra para abençoar seus descendentes." },
    { q: "O que é Onílẹ̀?", a: "Onílẹ̀ significa 'Dona da Terra', guardiã do solo e ancestralidade." },
    { q: "Como fazer uma oferenda (Adimú)?", a: "Adimú deve ser feito com respeito e orientação de um sacerdote responsável. Consulte sempre o Òjé." },
  ];

  // -----------------------
  // Funções de Login local
  // -----------------------
  function openLoginModal() {
    setLoginEmail("");
    setLoginSenha("");
    setLoginMensagem("");
    setLoginModalVisible(true);
  }

  function tryLogin() {
    const email = loginEmail.trim().toLowerCase();
    const senha = loginSenha;

    if (!email || !senha) {
      setLoginMensagem("Preencha e-mail e senha.");
      return;
    }

    // Procura usuário na lista
    const found = users.find((u) => u.email.trim().toLowerCase() === email && u.senha === senha);
    if (found && found.email) {
      setLoggedUser({ email: found.email, nome: found.nome || found.email });
      setLoginModalVisible(false);
      setLoginMensagem("");
      Alert.alert("Bem-vindo", `Login efetuado como ${found.email}`);
    } else {
      setLoginMensagem("E-mail ou senha incorretos.");
    }
  }

  function logout() {
    setLoggedUser(null);
    Alert.alert("Saída", "Você saiu da conta.");
  }

  // -----------------------
  // Calendário - cadastrar festa (senha protegida)
  // -----------------------
  function tentarLiberarCadastroCalendario() {
    if (calSenha === CALENDARIO_SENHA) {
      Alert.alert("Acesso liberado", "Senha correta — agora preencha os dados e cadastre a festa.");
    } else {
      Alert.alert("Senha incorreta", "A senha fornecida está incorreta.");
    }
  }

  function cadastrarFesta() {
    if (calSenha !== CALENDARIO_SENHA) {
      Alert.alert("Atenção", "Digite a senha correta para cadastrar.");
      return;
    }
    if (!calNome || !calData || !calDescricao) {
      Alert.alert("Atenção", "Preencha nome, data e descrição.");
      return;
    }
    const novo = { nome: calNome, data: calData, descricao: calDescricao };
    setFestas([novo, ...festas]);
    setCalNome("");
    setCalData("");
    setCalDescricao("");
    Alert.alert("Sucesso", "Festa cadastrada (em memória).");
  }

  // -----------------------
  // Dúvidas -> enviar direto ao WhatsApp (abre link) - aqui simula com Alert
  // -----------------------
  function enviarDuvidaWhatsApp(text) {
    // abrir link real: const url = `https://wa.me/5532984794519?text=${encodeURIComponent(text)}`;
    // Linking.openURL(url)
    Alert.alert("Enviar via WhatsApp", `Texto que seria enviado:\n\n${text}`);
  }

  // -----------------------
  // Renderização das telas
  // -----------------------

  // ---------------- HOME ----------------
  if (screen === "home") {
    return (
      <View style={styles.container}>
        <Text style={styles.homeTitle}>E Kaabo gbogbo ebi Èègúngún</Text>
        <Text style={styles.homeSubtitle}>(Sejam bem vindos todos da família Èègúngún)</Text>

        <TouchableOpacity style={styles.homeButton} onPress={() => setScreen("menu")}>
          <Text style={styles.homeButtonText}>Iniciar</Text>
        </TouchableOpacity>

        <Text style={styles.homeSignature}>Òjé Èègunyálè - Arlêi Rufino</Text>
      </View>
    );
  }

  // ---------------- MENU PRINCIPAL ----------------
  if (screen === "menu") {
    return (
      <View style={styles.containerScroll}>
        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}>
          <Text style={styles.menuTitle}>📜 Menu Principal</Text>
          
          <TouchableOpacity
  style={styles.menuButton}
  onPress={() => setScreen("oqueEegungun")}
>
  <Text style={styles.menuButtonText}>O que é Èègúngún ?</Text>
</TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("onile_e_eegungun")}>
            <Text style={styles.menuButtonText}>🕯️ Onílẹ̀ e Èègúngún</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
  style={styles.menuButton}
  onPress={() => setScreen("orisaEEegungun")}
>
  <Text style={styles.menuButtonText}>Orisá e Èègúngún</Text>
</TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("adimu")}>
            <Text style={styles.menuButtonText}>🌿 Adimú</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              // Ao clicar em Cursos: se já logado, vai direto; se não, abre modal de login
              if (loggedUser) setScreen("cursos");
              else openLoginModal();
            }}
          >
            <Text style={styles.menuButtonText}>🎓 Cursos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("calendario")}>
            <Text style={styles.menuButtonText}>📅 Calendário de Festas</Text>
          </TouchableOpacity>   

          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("assentamento")}>
            <Text style={styles.menuButtonText}>⚱️ Assentamento</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("contatos")}>
            <Text style={styles.menuButtonText}>📞 Contatos / Perguntas Frequentes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => setScreen("home")}>
            <Text style={styles.backButtonText}>🏠 Voltar</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Login Modal (abre ao tentar entrar em Cursos sem estar logado) */}
        <Modal visible={loginModalVisible} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>🔐 Login — Acessar Cursos</Text>

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                autoCapitalize="none"
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={loginSenha}
                onChangeText={setLoginSenha}
              />

              {loginMensagem ? <Text style={styles.loginMsg}>{loginMensagem}</Text> : null}

              <View style={{ width: "100%", alignItems: "center" }}>
                <TouchableOpacity style={styles.modalButton} onPress={tryLogin}>
                  <Text style={styles.modalButtonText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#e6e6e6", marginTop: 8 }]}
                  onPress={() => {
                    setLoginModalVisible(false);
                    setLoginMensagem("");
                  }}
                >
                  <Text style={{ color: "#333", fontWeight: "bold" }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  
  // ---------------- TELA: O que é Èègúngún ----------------
if (screen === "oqueEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>🕯️ <Text style={{ fontWeight: 'bold' }}>O que é Èègúngún?</Text></Text>

      <Text style={styles.paragraph}>
        Èègúngún é a manifestação dos ancestrais na tradição yorùbá, representando a presença viva daqueles que vieram antes de nós.
      </Text>

      <Text style={styles.paragraph}>
        Por meio dos rituais de Èègúngún, os ancestrais comunicam ensinamentos, orientações e proteção para a comunidade e para cada indivíduo.
      </Text>

      <Text style={styles.paragraph}>
        A palavra “Èègúngún” refere-se tanto aos espíritos ancestrais quanto às personificações físicas durante as cerimônias, quando indivíduos, vestidos com trajes ritualísticos e máscaras, incorporam a energia ancestral.
      </Text>

      <Text style={styles.paragraph}>
        Cada traje, máscara e movimento possui um significado profundo, transmitindo mensagens sagradas e reforçando a conexão entre o mundo espiritual e o mundo físico.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>
        <Text style={{ fontWeight: 'bold' }}>Os rituais de Èègúngún têm múltiplas funções:</Text>
      </Text>

      <Text style={styles.paragraph}>
        Honrar os antepassados, preservar a memória cultural, orientar decisões, proteger a comunidade e fortalecer os laços familiares e espirituais.
      </Text>

      <Text style={styles.paragraph}>
        Eles são uma ponte entre passado, presente e futuro, mantendo viva a sabedoria ancestral.
      </Text>

      <Text style={styles.paragraph}>
        Participar de Èègúngún é mais que observar; é sentir a presença dos ancestrais, respeitar seus ensinamentos e integrar suas orientações no dia a dia, promovendo equilíbrio, proteção e prosperidade.
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("menu")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar ao Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

  // ---------------- ONÍLẸ̀ E ÈÈGÚNGÚN ----------------
if (screen === "onile_e_eegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>🕯️ Onílẹ̀ e sua ligação com o culto de Èègúngún</Text>
      <Text style={styles.paragraph}>
        Onílẹ̀, cujo nome significa “Dona da Terra”, é uma divindade primordial, guardiã do solo, dos ancestrais e de tudo o que vive e retorna à Terra. Na cosmologia yorùbá, Onílẹ̀ é a testemunha silenciosa de todos os acontecimentos no Àiyé, pois tudo o que nasce dela, volta a ela. Por isso, seu culto é o alicerce de todos os outros — inclusive o culto de Èègúngún.
      </Text>

      <Text style={styles.subHeading}>🌿 1. A Terra como morada dos ancestrais</Text>
      <Text style={styles.paragraph}>
        Èègúngún representa os espíritos ancestrais que retornam da Terra dos Mortos (Òrun) para visitar e abençoar os vivos. Quando um corpo é enterrado, ele se entrega a Onílẹ̀, e o espírito segue sua jornada para o Òrun. Assim, o retorno de Èègúngún é sempre uma manifestação que parte do ventre de Onílẹ̀ — é a Terra que libera os ancestrais para se comunicarem com seus descendentes. Por isso, durante rituais de Èègúngún, Onílẹ̀ é reverenciada antes de qualquer evocação, pois sem sua permissão, nenhum espírito ancestral pode se erguer do solo sagrado.
      </Text>

      <Text style={styles.subHeading}>⚱️ 2. Onílẹ̀ como testemunha dos juramentos e segredos</Text>
      <Text style={styles.paragraph}>
        No culto de Èègúngún, assim como em outros cultos tradicionais yorùbá, os juramentos, iniciações e segredos são confiados a Onílẹ̀. Ela guarda o segredo da origem, do nascimento e do retorno dos ancestrais. Por isso, em rituais de iniciação, o chão — símbolo de Onílẹ̀ — é tocado, beijado ou aspergido com oferendas, pedindo permissão para abrir o caminho da comunicação entre o mundo dos vivos e dos mortos.
      </Text>

      <Text style={styles.subHeading}>🔥 3. Onílẹ̀, Èègúngún e o princípio da ancestralidade</Text>
      <Text style={styles.paragraph}>
        Èègúngún é a expressão visível da força ancestral que reside na Terra. Onílẹ̀ é o ponto de ligação entre Òrun e Àiyé — é nela que o sangue dos sacrifícios penetra, que os ossos descansam, e de onde a energia vital é retirada. Por isso, Onílẹ̀ é considerada a “mãe ancestral de todos os Èègúngún”, a base que sustenta sua existência e poder. Cada passo de Èègúngún no chão é um ato de reverência a Onílẹ̀, pois é dela que ele se ergue e nela que repousa novamente.
      </Text>

      <Text style={styles.subHeading}>🌺 4. Síntese espiritual</Text>
      <Text style={styles.paragraph}>
        A relação entre Onílẹ̀ e Èègúngún é de complementaridade espiritual: Onílẹ̀ representa a matéria, o corpo e a ancestralidade da Terra; Èègúngún representa o espírito ancestral, a consciência viva dos mortos; juntos, simbolizam o elo entre o visível e o invisível, o eterno ciclo da vida e da morte. Por isso se diz: "Onílẹ̀ ni gbogbo ohun tí a bá ṣe n'Ilẹ̀ Àiyé." (Onílẹ̀ é testemunha de tudo o que fazemos na Terra.)
      </Text>

      <Text style={styles.subHeading}>🕯️ Saudação tradicional a Onílẹ̀</Text>
      <Text style={styles.paragraph}>
        Onílẹ̀ mo júbà o! Onílẹ̀ mo pè ó! Onílẹ̀, ayé òrun, ayé àiyé, ayé àtẹ́lẹwọ́! Onílẹ̀, ayé tí gbogbo wa ti wá, tí gbogbo wa yóò padà sí! Onílẹ̀, ẹ jọ̀wọ́, gba ẹbọ wa, jẹ́ kí ìbá wa gbà! Onílẹ̀, má jẹ́ kí ẹsẹ̀ wa tẹ̀ ẹ̀bi, má jẹ́ kí ọwọ́ wa kọ ẹ̀sùn! Onílẹ̀, alágbára gbogbo ohun alààyè! Onílẹ̀ mo júbà o!
      </Text>
      <Text style={styles.paragraph}>
        Tradução: Onílẹ̀, eu te saúdo! Onílẹ̀, eu te invoco! Terra do Céu, Terra do Mundo, Terra das mãos dos ancestrais! Onílẹ̀, Terra de onde todos viemos e para onde todos retornaremos! Aceita nossas oferendas e que nossas saudações sejam aceitas! Não permita que nossos pés pisem o erro, nem que nossas mãos cometam ofensa! Poderosa força de tudo o que vive! Eu te saúdo!
      </Text>

      <Text style={styles.subHeading}>🕯️ Saudação conjunta a Onílẹ̀ e Èègúngún</Text>
      <Text style={styles.paragraph}>
        Onílẹ̀ mo júbà o! Onílẹ̀, ayé àtà Òrun, ìyá gbogbo ẹ̀dá! A dúpẹ́ fún ìbùkún rẹ, fún ààbò rẹ, fún agbára tí o fi ń gbé gbogbo wa! Onílẹ̀, ẹ jọ̀wọ́, jẹ́ kí gbogbo ohun tí a bá ṣe lónìí ní àláfíà! Èègún mo júbà o! Èègún dide, Ẹ̀mí Àwọn Bàbá àti Ìyá wa! Ẹ jẹ́ kí àfihàn yín dá wa lórí, kí àṣẹ yín má bà jé! Onílẹ̀ àti Èègún, ẹ jẹ́ kí ìbá wa gbà! Ẹ má jẹ́ kí ẹsẹ̀ wa tẹ̀ ẹ̀bi, kí ọwọ́ wa má ṣe àṣìṣe! Àṣẹ!
      </Text>
      <Text style={styles.paragraph}>
        Tradução: Onílẹ̀, eu te saúdo! Onílẹ̀, Terra e Céu, mãe de todas as existências! Agradecemos por tuas bênçãos, tua proteção e pela força com que sustentas todos nós! Onílẹ̀, permita que tudo o que fizermos hoje seja em paz! Èègún, eu te saúdo! Èègún, levanta-te, Espírito de nossos Pais e Mães! Que vossa presença nos abençoe e vosso Àṣẹ não se quebre! Onílẹ̀ e Èègún, aceitem nossas saudações! Não deixem que nossos pés caiam no erro, nem que nossas mãos pratiquem ofensa! Àṣẹ!
      </Text>

      <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("menu")}>
        <Text style={styles.menuButtonText}>🔙 Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- TELA: Orisá e Èègúngún (Menu principal) ----------------
if (screen === "orisaEEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>🌀 Orisá e Èègúngún</Text>

      <Text style={styles.paragraph}>
        Explore a relação entre diferentes Orisás e o culto de Èègúngún.
      </Text>
      
      {/* Botões adicionais de divindades */}
<TouchableOpacity
  style={styles.menuButton}
  onPress={() => setScreen("divindadeAganEEegungun")}
>
  <Text style={styles.menuButtonText}>Divindade Agàn e Èègúngún</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.menuButton}
  onPress={() => setScreen("divindadeIyaamiAjeEEegungun")}
>
  <Text style={styles.menuButtonText}>Divindade Iyaami Ajé e Èègúngún</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.menuButton}
  onPress={() => setScreen("orunmilaEEegungun")}
>
  <Text style={styles.menuButtonText}>Orunmilá e Èègúngún</Text>
</TouchableOpacity>

      {/* Botões dos Orisás */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orisaEsuEEegungun")}
      >
        <Text style={styles.menuButtonText}>Orisá Èsú e Èègúngún</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orisaOgunEEegungun")}
      >
        <Text style={styles.menuButtonText}>Orisá Ogun e Èègúngún</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orisaSangoEEegungun")}
      >
        <Text style={styles.menuButtonText}>Orisá Ṣàngó e Èègúngún</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orisaOiyaEEegungun")}
      >
        <Text style={styles.menuButtonText}>Orisá Òiyá e Èègúngún</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orisaOsosiEEegungun")}
      >
        <Text style={styles.menuButtonText}>Orisá Ososi e Èègúngún</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orisaOsunEEegungun")}
      >
        <Text style={styles.menuButtonText}>Orisá Osun e Èègúngún</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orisaOsanyinEEegungun")}
      >
        <Text style={styles.menuButtonText}>Orisá Osanyin e Èègúngún</Text>
      </TouchableOpacity>

      {/* Botão para voltar ao Menu principal */}
      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("menu")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar ao Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- TELA: Iyaami Àjé e Èègúngún ----------------
if (screen === "divindadeIyaamiAjeEEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>🕯️ <Text style={{ fontWeight: 'bold' }}>Iyaami Àjé e Èègúngún</Text></Text>

      <Text style={[styles.paragraph, { marginTop: 10 }]}>
        <Text style={{ fontWeight: 'bold' }}>Sabedoria e Ancestralidade na Tradição Yorùbá</Text>
      </Text>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 10 }]}>
        "O poder do pássaro negro de Iyaami (Akalá) repousa sobre o ombro de Èègúngún e faz com que ele abra a sua fala e traga mensagens dos nossos Ancestrais e Antepassados".
      </Text>

      <Text style={styles.paragraph}>
        Na tradição yorùbá, Iyaami Àjé — as Mães Ancestrais, guardiãs do poder de Oshorongá — representam a força feminina primordial que sustenta o equilíbrio entre o visível e o invisível, o material e o espiritual.
      </Text>

      <Text style={styles.paragraph}>
        Ela governa os mistérios da criação, da transformação e da justiça cósmica, sendo detentora do poder de <Text style={{ fontWeight: 'bold' }}>Àjé</Text>, que permeia tudo o que existe.
      </Text>

      <Text style={styles.paragraph}>
        Èègúngún, por sua vez, é a manifestação ritual dos nossos ancestrais. Por meio de máscaras, cânticos e danças, os egungun tornam-se canais de comunicação entre os vivos e os mortos, trazendo orientação, proteção e sabedoria ancestral.
      </Text>

      <Text style={styles.paragraph}>
        É na presença de Iyaami que o egungun encontra força para se expressar; o pássaro negro, símbolo de Akalá, carrega sua energia sobre o ombro do dançarino, abrindo o caminho da fala ancestral e revelando os ensinamentos dos que vieram antes de nós.
      </Text>

      <Text style={styles.paragraph}>
        Essa ligação entre Iyaami e Èègúngún reflete o equilíbrio entre o feminino e o masculino, o invisível e o tangível.
      </Text>

      <Text style={styles.paragraph}>
        Enquanto Iyaami guia com seu poder misterioso e transformador, Èègúngún torna visível a presença dos ancestrais, mantendo viva a memória da linhagem, protegendo a comunidade e preservando a harmonia do mundo espiritual.
      </Text>

      <Text style={styles.paragraph}>
        Em cada ritual, em cada dança e em cada palavra que emerge do egungun, sentimos a interconexão entre essas forças: a autoridade ancestral de Iyaami e a manifestação coletiva de Èègúngún se entrelaçam, lembrando-nos que somos sustentados por um legado profundo, que transcende o tempo e nos conecta ao infinito dos nossos antepassados.
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("orisaEEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar a Orisá e Èègúngún</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- TELA: Òrúnmìlà e Èègúngún ----------------
if (screen === "orunmilaEEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>🕯️ <Text style={{ fontWeight: 'bold' }}>Òrúnmìlà e Èègúngún</Text></Text>

      <Text style={[styles.paragraph, { marginTop: 10 }]}>
        <Text style={{ fontWeight: 'bold' }}>Sabedoria e Ancestralidade na Tradição Yorùbá</Text>
      </Text>

      <Text style={styles.paragraph}>
        Na tradição espiritual dos povos Yorùbá, tudo o que existe está interligado — o céu e a terra, o visível e o invisível, o passado e o futuro.
      </Text>

      <Text style={styles.paragraph}>
        Dentro dessa harmonia cósmica, duas forças se destacam pela profundidade de sua importância: Òrúnmìlà, o testemunho do destino e senhor da sabedoria divina, e Èègúngún, a presença viva dos ancestrais.
      </Text>

      <Text style={styles.paragraph}>
        Ambos representam pilares fundamentais da estrutura espiritual do mundo yorùbá, pois sem sabedoria não há continuidade, e sem ancestralidade não há identidade.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>
        🔮 <Text style={{ fontWeight: 'bold' }}>Òrúnmìlà – O Guardião do Destino</Text>
      </Text>

      <Text style={styles.paragraph}>
        Òrúnmìlà, também chamado de Ifá, é o Orìsà do conhecimento profundo, da revelação e da orientação espiritual.
      </Text>

      <Text style={styles.paragraph}>
        Segundo a cosmogonia yorùbá, Òrúnmìlà estava presente quando cada ser humano escolheu o próprio destino diante de Olódùmarè, tornando-se assim o Elérìí Ìpín — “A Testemunha do Destino”.
      </Text>

      <Text style={styles.paragraph}>
        Através do sistema de divinação de Ifá, ele revela as leis que regem o equilíbrio da vida, indicando os caminhos que cada pessoa deve trilhar para cumprir sua missão na Terra.
      </Text>

      <Text style={styles.paragraph}>
        Òrúnmìlà é, portanto, o elo entre o Àiyé (mundo material) e o Òrun (mundo espiritual), aquele que ensina a humanidade a viver conforme o Òrì (consciência).
      </Text>

      <Text style={styles.paragraph}>
        Em cada consulta de Ifá, fala-se com Òrúnmìlà para compreender os desígnios dos ancestrais e dos Òrìsà, pois ele é o intérprete divino da vontade de Olódùmarè.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>
        👻 <Text style={{ fontWeight: 'bold' }}>Èègúngún – A Manifestação dos Ancestrais</Text>
      </Text>

      <Text style={styles.paragraph}>
        Èègúngún é o Orisá que representa o espírito coletivo dos antepassados que viveram e cumpriram com honra seus destinos na Terra. No Brasil, possui um espírito principal a ser reverenciado.
      </Text>

      <Text style={styles.paragraph}>
        Eles não morrem; apenas atravessam o véu do Òrun e retornam sob a forma ritual de Èègúngún — os mascarados sagrados que simbolizam a presença viva dos ancestrais entre os vivos.
      </Text>

      <Text style={styles.paragraph}>
        O culto de Èègúngún é uma das mais antigas expressões de reverência à ancestralidade no mundo yorùbá. Ele mantém viva a memória da linhagem, reforça os valores morais e espirituais e assegura a proteção das famílias e comunidades.
      </Text>

      <Text style={styles.paragraph}>
        Quando Èègúngún dança, não é o homem quem se move, mas o espírito ancestral que visita o mundo dos vivos para abençoar, aconselhar e corrigir.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>
        ⚖️ <Text style={{ fontWeight: 'bold' }}>Sabedoria e Ancestralidade: A Unidade entre Òrúnmìlà e Èègúngún</Text>
      </Text>

      <Text style={styles.paragraph}>
        Dentro da tradição yorùbá, Òrúnmìlà e Èègúngún formam uma dupla inseparável. Enquanto Òrúnmìlà guarda o conhecimento espiritual e os segredos do destino, Èègúngún representa a experiência vivida e transmitida através das gerações.
      </Text>

      <Text style={styles.paragraph}>
        Ambos sustentam a continuidade da existência: Òrúnmìlà ensina o caminho correto para não romper com a ordem do universo; Èègúngún mantém viva a memória de quem já trilhou esse caminho antes de nós.
      </Text>

      <Text style={styles.paragraph}>
        Se Òrúnmìlà é o sábio que fala do que deve ser feito, Èègúngún é o espírito que mostra o que já foi vivido. Juntos, eles asseguram que o homem jamais se perca entre o que sabe e o que é, entre o destino e a herança espiritual que o sustenta.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>
        🌿 <Text style={{ fontWeight: 'bold' }}>O Encontro dos Dois Caminhos</Text>
      </Text>

      <Text style={styles.paragraph}>
        Nos rituais de Ifá, é comum que Òrúnmìlà seja invocado para revelar como honrar os ancestrais; e nos cultos de Èègúngún, os cânticos e danças frequentemente celebram o saber de Ifá, reconhecendo que sem Òrúnmìlà ninguém compreenderia os mistérios do Òrun.
      </Text>

      <Text style={styles.paragraph}>
        Assim, a sabedoria e a ancestralidade caminham lado a lado — uma ilumina, a outra sustenta. Os antigos ensinam que:
      </Text>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 10 }]}>
        “Ifá dá a palavra, Èègúngún dá a força. A sabedoria orienta, a ancestralidade confirma.”
      </Text>

      <Text style={[styles.paragraph, { marginTop: 20 }]}>
        ✨ <Text style={{ fontWeight: 'bold' }}>Conclusão</Text>
      </Text>

      <Text style={styles.paragraph}>
        Na tradição yorùbá, Òrúnmìlà e Èègúngún representam a base da continuidade da vida espiritual. Um sem o outro seria incompleto: o saber sem memória seria vazio, e a ancestralidade sem sabedoria seria cega.
      </Text>

      <Text style={styles.paragraph}>
        Por isso, toda casa que honra Ifá e reverencia Èègúngún mantém viva a ponte entre o destino individual e a herança coletiva, unindo passado, presente e futuro em um único Àṣẹ.
      </Text>

      <Text style={[styles.paragraph, { marginTop: 20, fontStyle: 'italic' }]}>
        "Egungun gun ani o gun, Akala ka ani oka lekeleke foso."  
        O espírito dos ancestrais monta os médiuns suavemente, a ave de rapina circula a cerimônia como uma cobra.
      </Text>

      <Text style={[styles.paragraph, { marginTop: 10, fontStyle: 'italic' }]}>
        "Ọgbọn ati Imọ ni kọkọrọ si aye kii ṣe owo"  
        Sabedoria e Conhecimento são a chave para a vida, não o dinheiro.
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("orisaEEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar a Orisá e Èègúngún</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- TELA: Orisá Èsú e Èègúngún ----------------
if (screen === "orisaEsuEEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>
        🔺 <Text style={{ fontWeight: "bold" }}>Èsú e Èègúngún: O Caminho Entre o Mundo dos Vivos e o dos Ancestrais</Text> 🔻
      </Text>

      <Text style={[styles.paragraph, { fontStyle: "italic", marginTop: 10 }]}>
        🕯️ “Kò sí Òrìṣà tí lè ṣe ohun tí Èsù kò bá fọwọ́ sí.” {"\n"}
        — “Nenhum Òrìṣà realiza nada sem o consentimento de Èsù.”
      </Text>

      <Text style={styles.paragraph}>
        Èsú é o movimento que abre os caminhos, o guardião das encruzilhadas e das palavras.
      </Text>

      <Text style={styles.paragraph}>
        Èègúngún é o retorno dos Ancestrais, a força que reaviva a memória e a continuidade do sangue que corre em nossos ossos.
      </Text>

      <Text style={styles.paragraph}>
        Entre os dois existe uma ponte sagrada: Èsú é quem desperta o caminho para que Èègúngún possa cruzar entre o <Text style={{ fontWeight: "bold" }}>Àiyé</Text> (mundo dos vivos) e o <Text style={{ fontWeight: "bold" }}>Òrun</Text> (mundo espiritual).
      </Text>

      <Text style={styles.paragraph}>
        É através de Èsú que a fala dos vivos chega aos Ancestrais, e é também por ele que a voz dos Ancestrais ecoa de volta aos ouvidos dos filhos.
      </Text>

      <Text style={styles.paragraph}>
        Quando o tambor de Èègúngún ressoa, é Èsú quem guia o vento que levanta o pano sagrado. É Èsú quem leva o <Text style={{ fontWeight: "bold" }}>ebó</Text> e traz o <Text style={{ fontWeight: "bold" }}>àṣẹ</Text> da comunicação entre o visível e o invisível.
      </Text>

      <Text style={styles.paragraph}>
        Por isso, antes que o Ancestral dance, Èsú é louvado; {"\n"}
        antes que a palavra seja dita, Èsú é chamado; {"\n"}
        antes que o espírito atravesse, Èsú é quem abre o portal.
      </Text>

      <Text style={styles.paragraph}>
        Èsú e Èègúngún caminham juntos na eterna dinâmica da vida e da morte — um conduz o movimento, o outro revela o mistério.
      </Text>

      <Text style={styles.paragraph}>
        Juntos, eles recordam que a Ancestralidade só se manifesta quando os caminhos estão abertos, e que o movimento só tem sentido quando é guiado pela sabedoria dos que vieram antes.
      </Text>

      <Text style={[styles.paragraph, { fontWeight: "bold", textAlign: "center", marginTop: 15 }]}>
        Àṣẹ!
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("orisaEEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar a Orisá e Èègúngún</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- TELA: Orisá Ògún e Èègúngún ----------------
if (screen === "orisaOgunEEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>
        <Text style={{ fontWeight: "bold" }}>Ogum, o Primeiro Òjé, e a Conexão com Èègúngún</Text>
      </Text>

      <Text style={styles.paragraph}>
        Na cosmologia iorubá, Ogum é reconhecido como o orixá do ferro, da guerra, do movimento e da tecnologia.
      </Text>

      <Text style={styles.paragraph}>
        Entre os Òrìṣà, ele possui um papel único: é o primeiro Òjé a descer do Céu (<Text style={{ fontWeight: "bold" }}>Orun</Text>) para a Terra (<Text style={{ fontWeight: "bold" }}>Ayé</Text>). Esse ato simboliza não apenas a inauguração dos caminhos físicos e espirituais para os demais Òrìṣà, mas também o estabelecimento da ordem e da proteção na comunidade dos vivos.
      </Text>

      <Text style={styles.paragraph}>
        Ser o primeiro Òjé significa que Ogum é o precursor das práticas de mediação entre o mundo espiritual e o mundo terreno. Ele abre os caminhos, prepara o solo espiritual e estabelece os princípios de liderança e sabedoria que guiarão os demais Òjè, que mais tarde assumirão funções de conexão com os ancestrais e manutenção do equilíbrio comunitário.
      </Text>

      <Text style={styles.paragraph}>
        Nesse contexto, Èègúngún — os ancestrais manifestos através de trajes e máscaras sagradas — está profundamente conectado com Ogum. Os Egúngún representam a presença contínua dos antepassados, a memória viva da comunidade e a orientação espiritual que protege e ensina.
      </Text>

      <Text style={styles.paragraph}>
        A chegada de Ogum como o primeiro Òjé permite que essa ligação entre o Céu e a Terra se torne possível, pois é ele quem estabelece os caminhos seguros para que os ancestrais possam interagir com os vivos.
      </Text>

      <Text style={styles.paragraph}>
        Portanto, Ogum e Èègúngún estão intrinsecamente ligados:
      </Text>

      <Text style={styles.paragraph}>
        Ogum, como pioneiro e guardião dos caminhos, prepara o terreno espiritual;{"\n"}
        Èègúngún, como manifestação dos ancestrais, utiliza esses caminhos para transmitir sabedoria, proteção e justiça à comunidade.
      </Text>

      <Text style={styles.paragraph}>
        Essa relação evidencia que a força de Ogum e a presença dos ancestrais não são separadas, mas complementares, garantindo o equilíbrio entre a ação, a proteção e a memória ancestral.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>Oriki de Ogum</Text>

      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogum Lakayè</Text> — Ogum, senhor da Terra</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ọsin Imọlẹ</Text> — Ogum, aquele que é como a luz do dia / aquele que ilumina o caminho</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogum alada meji</Text> — Ogum de duas lâminas / Ogum que combate em dois fronts</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ofi okan sanko</Text> — Ogum de coração firme, que jamais se abala</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ofi okan yena</Text> — Ogum de espírito resoluto, que decide e age</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ọjọ ogun nti ori oke nbọ</Text> — O dia da batalha sobe ao topo da colina / Ogum prepara a vitória</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Aṣọ ina lọ mu bora</Text> — Ele veste a roupa do fogo e enfrenta tudo sem medo</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ẹwu ẹjẹ lowo</Text> — Suas mãos estão marcadas pelo sangue / símbolo de sua coragem em combate</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun onile owo</Text> — Ogum é o senhor da Terra, dono das riquezas materiais e espirituais</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ọlọ na ola</Text> — Ogum traz glória e prosperidade</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun onile Kongun kongun Ọrun</Text> — Ogum domina a terra e os mistérios do céu</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Olomi ni ile feje we</Text> — A água em sua casa é abundante e purificadora</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Olaso nile fimo kimo bora</Text> — Ele enfeita sua casa com riqueza e proteção</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun apon leyin iju</Text> — Ogum é aquele que surge depois da tempestade, trazendo estabilidade</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Egbe lehin ọmọ kan</Text> — Ele protege os grupos e comunidades, não apenas indivíduos</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun meje logun mi</Text> — Ogum é completo e poderoso, sempre presente em todos os aspectos da vida</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun alara ni n gb’aja</Text> — Ogum é o líder, aquele que vigia a porta e protege a comunidade</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun onire a gb’agbo</Text> — Ogum que cuida dos rebanhos e garante a prosperidade</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun ikole a gb’agbin</Text> — Ogum que supervisiona a construção e a agricultura</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun ila a gb’esun isu</Text> — Ogum que protege e fortalece as plantações</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun akirin a gb’awo agbo</Text> — Ogum que maneja os instrumentos e utensílios sagrados</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun elemono eran ahun ni je</Text> — Ogum que domina a caça e os alimentos da comunidade</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Ogun makinde ti dogun leyin odi</Text> — Ogum que vence qualquer inimigo e defende seu povo</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>Bi o ba gba Tapa a gb’Aboki lo</Text> — Quando ele age, ninguém pode impedir; seus caminhos são abertos</Text>
      <Text style={styles.paragraph}><Text style={{ fontWeight: "bold" }}>A gba Ukuuku a gba Kèmbèrí</Text> — Ele recebe as oferendas corretamente, mantendo a harmonia e proteção espiritual</Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("orisaEEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar a Orisá e Èègúngún</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- TELA: Orisá Ṣàngó e Èègúngún ----------------
if (screen === "orisaSangoEEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>
        <Text style={{ fontWeight: "bold" }}>Ṣàngó e o Culto de Èègúngún</Text>
      </Text>

      <Text style={styles.paragraph}>
        Alguns Itan afirmam que Ṣàngó foi o primeiro Òjé na Terra. Por ter sido humano, desencarnado e passado pelo <Text style={{ fontWeight: "bold" }}>Orun Èègúngún</Text> (reino dos Ancestrais), ele foi divinizado como Òrìṣà através de Òiyá, com a intercessão do próprio Olódùmarè.
      </Text>

      <Text style={styles.paragraph}>
        Por essa trajetória, Ṣàngó é considerado o pai de Èègúngún. 
      </Text>

      <Text style={styles.paragraph}>
        Por isso:{"\n"}
        Èègúngún dança e canta ao som do Alujá{"\n"}
        Veste-se com os Abalá para homenagear Ṣàngó.
      </Text>

      <Text style={styles.paragraph}>
        No Brasil, há um costume equivocado de dizer que Ṣàngó tem medo de Èègúngún, o que é falso dentro do culto tradicional. Na realidade:{"\n"}
        Ṣàngó, por ser um Eborá muito quente, ao passar pelo frio do Orun Èègúngún, preferiu não viver junto ao seu filho, mas isso não significa medo, pois nenhum Eborá como Ṣàngó teme algo.
      </Text>

      <Text style={styles.paragraph}>
        Dentro de Ifá e do culto de Èègúngún, é ensinado que:
      </Text>

      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: "bold" }}>Não há culto a Èègúngún sem Ṣàngó</Text>{"\n"}
        Antes de reverenciar Èègúngún, deve-se reverenciar Ṣàngó.{"\n"}
        Quando Èègúngún se alimenta, Ṣàngó se alimenta, e vice-versa, pois um não deve viver longe do outro aqui no Àiyé.
      </Text>

      <Text style={styles.subHeading}>Os dois Ṣàngó cultuados</Text>

      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: "bold" }}>Ṣàngó Eborá Òrìṣà</Text>{"\n"}
        Aquele que já nasceu como Òrìṣà e que Nunca veio ao Àiyé.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: "bold" }}>Ṣàngó Èègúngún (Obá Koso)</Text>{"\n"}
        Aquele que nasceu humano, reinou em Koso.{"\n"}
        Ao morrer, tornou-se Ancestral Ilustre Divinizado Èègúngún, cultuado em cima do aladò (pilão)
      </Text>

      <Text style={styles.subHeading}>Oriki Ṣàngó</Text>

      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>Ṣàngó, Ọba Koso, ẹni tí í ṣe alágbára,</Text>{"\n"}
        <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>Ẹlẹ́ṣin ní ọ̀run, aláṣẹ àgbáyé,</Text>{"\n"}
        <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>Olókun ní ìmọ̀, ẹni tí ọ̀run ń fi ìyìn ṣe,</Text>{"\n"}
        <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>Ọ̀run ń kó àwọn ọ̀tá rẹ̀, àwọn ọmọ rẹ̀ ń jẹ́ kó rọrùn,</Text>{"\n"}
        <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>Ọba tí ọ̀run ń fi ìbá ṣe, ẹni tí kò ní bẹ̀rù ẹ̀dá.</Text>
      </Text>

      <Text style={styles.subHeading}>Tradução</Text>

      <Text style={styles.paragraph}>
        Ṣàngó, Rei de Koso, aquele que é poderoso,{"\n"}
        Montado nos céus, senhor do mundo,{"\n"}
        Detentor de sabedoria, aquele que o céu enaltece,{"\n"}
        O céu subjuga seus inimigos, seus filhos seguem seu caminho,{"\n"}
        Um Rei que o céu honra, aquele que não teme ninguém.
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("orisaEEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar a Orisá e Èègúngún</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- TELA: Orisá Òyá e Èègúngún ----------------
if (screen === "orisaOiyaEEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>
        Òyá e o Culto de Èègúngún
      </Text>

      <Text style={styles.paragraph}>
        Òyá, também conhecida como <Text style={{ fontWeight: "bold" }}>Ìyá Òyá Ìgbálè</Text>, possui uma ligação profunda com o culto de Èègúngún, os ancestrais divinizados. 
      </Text>

      <Text style={styles.paragraph}>
        Essa ligação, no entanto, é muitas vezes interpretada de forma equivocada em algumas tradições afro-brasileiras.
      </Text>

      <Text style={styles.paragraph}>
        No Brasil, é comum ouvir que Òyá é “mãe dos Eguns”, o que leva à ideia de que ela seria a geradora dos ancestrais.{"\n\n"}
        Mas, na verdade, Òyá não pariu Èègúngún.
      </Text>

      <Text style={styles.paragraph}>
        O que ocorre é que Òyá é uma guardiã dos portais do Òrun, a dimensão espiritual.{"\n"}
        Ela detém o poder da transição entre os mundos, sendo capaz de abrir e fechar os caminhos entre o <Text style={{ fontStyle: "italic" }}>Àiyé</Text> (Terra) e o <Text style={{ fontStyle: "italic" }}>Òrun</Text> (Reino espiritual).
      </Text>

      <Text style={styles.paragraph}>
        Por isso, Òyá é chamada de <Text style={{ fontWeight: "bold" }}>Ìyá Mẹ́sàn Òrun</Text> — A Mãe dos Nove Planos Celestes.{"\n"}
        Seu domínio sobre os ventos, as tempestades e o movimento das energias faz dela a senhora das passagens, aquela que permite que os espíritos transitem entre os reinos.
      </Text>

      <Text style={styles.subHeading}>A Relação Espiritual com Èègúngún</Text>

      <Text style={styles.paragraph}>
        Òyá não é mãe dos Èègúngún, mas é respeitada e reverenciada por eles, pois sem sua permissão nenhum espírito pode atravessar o limiar entre o Òrun e o Àiyé.{"\n\n"}
        Ela é a senhora que domina os caminhos do vento e da morte, mantendo a ordem das energias espirituais e garantindo que os ancestrais se manifestem apenas dentro do equilíbrio e do <Text style={{ fontStyle: "italic" }}>Àṣẹ</Text>.{"\n\n"}
        É por isso que, nos rituais de Èègúngún, Òyá é lembrada, saudada e reverenciada — sem ela, não há passagem segura entre os mundos.
      </Text>

      <Text style={styles.subHeading}>Òyá e Ṣàngó</Text>

      <Text style={styles.paragraph}>
        Assim como Ṣàngó é considerado o primeiro Òjé — aquele que passou pelo Òrun Èègún e foi divinizado —, Òyá é a ponte entre o poder dos ancestrais e o poder divino.{"\n\n"}
        Ela foi quem intercedeu para que Ṣàngó fosse divinizado após sua passagem pelo Òrun Èègún, reforçando seu papel de mediadora entre a vida, a morte e a eternidade.
      </Text>

      <Text style={styles.subHeading}>Síntese</Text>

      <Text style={styles.paragraph}>
        Òyá é senhora da transição, guardiã dos portais do Òrun e respeitada pelos Èègúngún por seu poder de conduzir e controlar o trânsito das almas.{"\n\n"}
        Não é mãe dos ancestrais, mas aquela que possibilita sua presença e seu retorno.{"\n\n"}
        Por isso, o título <Text style={{ fontWeight: "bold" }}>Ìyá Òyá Ìgbálè</Text> não significa que ela habita o mesmo espaço dos Èègúngún, mas que ela rege o poder do movimento entre os mundos, sendo honrada como mãe espiritual dos caminhos da travessia.
      </Text>

      <Text style={styles.subHeading}>Òríkì Òyá Ìgbálè</Text>

      <Text style={styles.paragraph}>
        <Text style={{ fontStyle: "italic" }}>
          Òyá Ìgbálè, Ìyá Mẹ́sàn Òrun,{"\n"}
          Aṣọ rẹ̀ ń fò bí ẹyẹ,{"\n"}
          Ìyá tó ń ru ìrìn àjò àwọn ẹ̀mí,{"\n"}
          Òyá tó ń dá ẹ̀fú̀fù sí orí Òrun,{"\n"}
          Ìyá tó ń ké káàkiri ilẹ̀ àti Òrun,{"\n"}
          Òyá tó ń ṣí ẹnu Òrun,{"\n"}
          Tí ó ń jẹ́ kí Èègúngún bò wá sí Àiyé,{"\n"}
          Ìyá tí kò bẹ̀rù iku,{"\n"}
          Ìyá tí ń dá àgàn wáyé,{"\n"}
          Ìyá tí ń dá òkú di alààyè,{"\n"}
          Ìyá Àjà, ọmọ Odò Òyá,{"\n"}
          Ìyá tí afẹ́fẹ́ rẹ̀ ń gbé orí ẹnikẹ́ni tí ó bá pè ní orúkọ rẹ̀.
        </Text>
      </Text>

      <Text style={styles.subHeading}>🌬️ Tradução Poética</Text>

      <Text style={styles.paragraph}>
        Òyá Ìgbálè, Mãe dos Nove Planos do Òrun,{"\n"}
        Teu pano sagrado dança como o voo de um pássaro,{"\n"}
        Mãe que conduz as almas em sua travessia,{"\n"}
        Òyá, que sopra os ventos até o alto dos céus,{"\n"}
        Mãe que clama entre a Terra e o Òrun,{"\n"}
        Òyá, que abre as portas do mundo espiritual,{"\n"}
        E permite que os Èègúngún desçam à Terra,{"\n"}
        Mãe que não teme a morte,{"\n"}
        Mãe que transforma o estéril em fértil,{"\n"}
        Mãe que desperta os mortos à vida espiritual,{"\n"}
        Senhora dos Ventos, filha do Rio Òyá,{"\n"}
        Mãe cujo sopro levanta o destino de quem pronuncia o teu nome.
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("orisaEEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar a Orisá e Èègúngún</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- TELA: Orisá Òsóòsì e Èègúngún ----------------
if (screen === "orisaOsosiEEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>
        Òsóòsì e o Ritual do Àsèsè
      </Text>

      <Text style={styles.paragraph}>
        Òsóòsì era um caçador humano muito conhecido por sua habilidade e coragem.{"\n\n"}
        Vivendo na cidade de Ketu, era chamado também de Odùlécè, e seu nome era respeitado por todos os que conheciam sua fama como mestre da floresta e da caça.
      </Text>

      <Text style={styles.paragraph}>
        Certo dia, um enorme pássaro negro, enviado pelas poderosas Ìyáàmi Òsóròngá, pousou sobre o telhado do palácio do rei de Ketu, lançando medo e confusão por toda a cidade.{"\n\n"}
        O pássaro gritava, agitava as asas, e ninguém conseguia se aproximar, pois todos que tentavam eram abatidos por seu poder.
      </Text>

      <Text style={styles.paragraph}>
        Os melhores caçadores da cidade foram convocados para enfrentar a criatura, mas nenhum deles conseguiu atingir a ave. Então, o rei mandou chamar Òsóòsì, o grande caçador.{"\n\n"}
        Quando Òsóòsì chegou, observou o pássaro e, com calma e precisão, preparou o seu arco. Com uma única flecha, disparou e atingiu o coração do pássaro negro, que caiu morto diante de todos.
      </Text>

      <Text style={styles.paragraph}>
        Desde então, Òsóòsì recebeu o título de{" "}
        <Text style={{ fontWeight: "bold" }}>"Òsó t’ókàn sósó"</Text>, que significa “o feiticeiro de uma única flecha”.{"\n\n"}
        E passou também a ser chamado de <Text style={{ fontWeight: "bold" }}>Odé N’lá Kétu</Text>, o Grande Caçador de Ketu.{"\n\n"}
        Com o tempo, muitos passaram a confundi-lo com o Obá Alákétu (o Rei de Ketu), porém Òsóòsì nunca reinou — ele permaneceu sendo o caçador supremo, guardião da floresta e símbolo da sabedoria e precisão.
      </Text>

      <Text style={styles.subHeading}>Òsóòsì e o Ritual do Àsèsè</Text>

      <Text style={styles.paragraph}>
        Alguns Ìtàn (histórias sagradas) dizem que Òsóòsì se tornou o patrono do ritual do Àsèsè, o rito de passagem que marca o retorno do espírito ao mundo ancestral (<Text style={{ fontStyle: "italic" }}>Òrun Èègún</Text>).{"\n\n"}
        Conta-se que Òsóòsì vivia com sua filha em uma fazenda à beira da floresta. Certo dia, ele adoeceu e não despertou mais.{"\n\n"}
        Sua filha, em prantos, procurou um Bàbáláwo para saber como deveria proceder com o funeral de seu pai.
      </Text>

      <Text style={styles.paragraph}>
        O sacerdote consultou o Opèlé Ifá e lhe disse:{"\n\n"}
        “Reúna os pertences de seu pai — o arco, a flecha, suas vestes de caça e o àpò, a bolsa que ele usava — cubra tudo com panos coloridos e leve para dentro da floresta.{"\n"}
        Deposite-os aos pés de uma árvore frondosa, invoque o nome de seu pai três vezes, vire-se e vá embora sem olhar para trás.”
      </Text>

      <Text style={styles.paragraph}>
        A filha seguiu as instruções do Bàbáláwo fielmente. Pouco tempo depois, ao amanhecer, ao sair de casa, ela viu o espírito de seu pai Òsóòsì parado à beira da floresta.{"\n\n"}
        Daquele dia em diante, ela passou a cultuar o espírito de seu pai, realizando o ritual do Àsèsè, que marca a passagem do ser humano para o mundo ancestral.
      </Text>

      <Text style={styles.paragraph}>
        Assim, Òsóòsì tornou-se um Èègún divinizado — o primeiro caçador a atravessar o limiar entre o mundo dos vivos e o mundo dos ancestrais — e seu espírito passou a habitar a{" "}
        <Text style={{ fontWeight: "bold" }}>Ìgbó Èègúngún</Text>, a Floresta Sagrada dos Ancestrais.
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30, backgroundColor: "#5dade2" }]}
        onPress={() => setScreen("orisaEEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar a Orisá e Èègúngún</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

  // ---------------- ADIMÚ ----------------
  if (screen === "adimu") {
    // Lista simples dos alimentos (nomes apenas) e categorias conforme seu pedido
    const alimentos = [
      "Akara ou Akarajé",
      "Akasá branco",
      "Akasá branco regado com dendê",
      "Ebò (Canjica branca)",
      "Dmegine (pipoca)", // you wrote Dirimbo / Diginna; keeping "Dmegine (pipoca)" as placeholder
      "Ekuru",
      "Olele",
      "Côco seco",
      "Comidas que a boca come",
    ];
    const bebidas = ["Otin (Gim)", "Vinho de palma", "Água de côco"];
    const temperos = ["Oyin (mel)", "Epò (dendê)", "Omi (água)", "Otin pupa (vinho de palma)", "Ekó (Akasá branco diluído)"];
    const sementes = ["Obí abatá (4 gomos)", "Orobo"];
    const animais = ["Carneiro (Agbò / Aguntàn) — principal", "Galos (Akukó)", "Pombos (Eiyelé)", "Angolas (Etú)"];

    return (
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <Text style={styles.sectionTitle}>🌿 Adimú</Text>
        <Text style={styles.paragraph}>
          Adimú são as oferendas tradicionais usadas nos rituais de Èègúngún. Abaixo estão os itens
          organizados por categorias (nomes apenas).
        </Text>

        <Text style={styles.subHeading}>Alimentos</Text>
        {alimentos.map((it, i) => (
          <Text key={i} style={styles.listItem}>• {it}</Text>
        ))}

        <Text style={[styles.subHeading, { marginTop: 12 }]}>Bebidas</Text>
        {bebidas.map((it, i) => (
          <Text key={i} style={styles.listItem}>• {it}</Text>
        ))}

        <Text style={[styles.subHeading, { marginTop: 12 }]}>Temperos</Text>
        {temperos.map((it, i) => (
          <Text key={i} style={styles.listItem}>• {it}</Text>
        ))}

        <Text style={[styles.subHeading, { marginTop: 12 }]}>Sementes Sagradas</Text>
        {sementes.map((it, i) => (
          <Text key={i} style={styles.listItem}>• {it}</Text>
        ))}

        <Text style={[styles.subHeading, { marginTop: 12 }]}>Animais</Text>
        {animais.map((it, i) => (
          <Text key={i} style={styles.listItem}>• {it}</Text>
        ))}

        <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("menu")}>
          <Text style={styles.menuButtonText}>🔙 Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ---------------- CURSOS (área restrita) ----------------
if (screen === "cursos") {
  // se chegou aqui é porque já estava logado (abrimos o modal na navegação do menu)
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>🎓 Cursos (Área Restrita)</Text>

      <Text style={styles.paragraph}>
        Bem-vindo(a) {loggedUser ? loggedUser.email : ""} — área restrita para conteúdos de cursos.
        Futuramente aqui você poderá cadastrar módulos, vídeos, textos e materiais para iniciados.
      </Text>

      {/* Botões dos cursos */}
      <Text style={[styles.subHeading, { marginTop: 20 }]}>Cursos Disponíveis</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("cursoOrikis")}
      >
        <Text style={styles.menuButtonText}>Orikis</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("cursoOraculos")}
      >
        <Text style={styles.menuButtonText}>Oráculos Divinatórios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("cursoFundamentacao")}
      >
        <Text style={styles.menuButtonText}>Fundamentação de Ilesanyin</Text>
      </TouchableOpacity>      
      
      <TouchableOpacity
  style={styles.menuButton}
  onPress={() => setScreen("cursoRoupasEegungun")}
>
  <Text style={styles.menuButtonText}>Roupas de Èègúngún - Confecção</Text>
</TouchableOpacity>

      {/* Exemplo de lista vazia de conteúdos */}
      <Text style={[styles.subHeading, { marginTop: 10 }]}>Conteúdos</Text>
      <Text style={styles.paragraph}>Nenhum conteúdo cadastrado ainda. Em breve você poderá adicionar.</Text>

      <TouchableOpacity style={styles.menuButton} onPress={logout}>
        <Text style={styles.menuButtonText}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("menu")}>
        <Text style={styles.menuButtonText}>🔙 Voltar ao Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- CURSO: Roupas de Èègúngún ----------------
if (screen === "cursoRoupasEegungun") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>👘 Roupas de Èègúngún - Confecção</Text>

      <Text style={styles.paragraph}>
        Nesta seção você poderá acessar informações e materiais relacionados à confecção das roupas de Èègúngún.
      </Text>

      {/* Botões para categorias */}
      <Text style={[styles.subHeading, { marginTop: 20 }]}>Categorias</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("roupaAfrica")}
      >
        <Text style={styles.menuButtonText}>Roupa de Èègúngún - África</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("roupaBrasil")}
      >
        <Text style={styles.menuButtonText}>Roupa de Bàbá Egum - Brasil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("cursos")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar aos Cursos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- CURSO: Roupa de Èègúngún - África ----------------
if (screen === "roupaAfrica") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>👘 Roupa de Èègúngún - África</Text>

      <Text style={styles.paragraph}>
        As roupas de Ègúngún são vestimentas cerimoniais profundamente simbólicas e espirituais, usadas em rituais do culto iorubá para representar e invocar os ancestrais.
      </Text>

      <Text style={styles.paragraph}>
        Esses trajes são considerados veículos do poder espiritual (<Text style={{ fontWeight: 'bold' }}>àsè</Text>) e desempenham um papel central nas celebrações e danças que conectam o mundo físico ao espiritual.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>Estrutura e Significado</Text>

      <Text style={styles.paragraph}>
        O traje de Ègúngún é composto por várias camadas de tecidos coloridos, tecidos tradicionais como o Seghosen (um tecido artesanal da região de Owo, na Nigéria), e adornos como contas, conchas de cauris, espelhos e lantejoulas. Esses elementos não são apenas decorativos; cada detalhe carrega significados espirituais e culturais profundos.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>A vestimenta é composta por:</Text>

      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: 'bold' }}>Camada interna:</Text> feita de tecido tradicional iorubá, complementada por uma rede que cobre o rosto e as mãos do mascarado.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: 'bold' }}>Camadas externas:</Text> constituídas por tecidos importados, algodões ou terciopelos, decorados com trançados, lantejoulas e amuletos com fórmulas medicinais.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: 'bold' }}>Tocado exuberante:</Text> muitas criações apresentam um tocado elaborado, que é uma característica marcante do traje.
      </Text>

      <Text style={styles.paragraph}>
        Cada traje de Ègúngún é considerado uma "casca" que ganha vida e poder espiritual quando vestida por um iniciado, transformando-se na manifestação do ancestral durante o ritual.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>Função Ritual e Cultural</Text>

      <Text style={styles.paragraph}>
        Durante as cerimônias, o Ègúngún dança e interage com a comunidade, transmitindo mensagens dos ancestrais e reforçando a conexão espiritual entre os vivos e os mortos.
      </Text>

      <Text style={styles.paragraph}>
        Essas danças são acompanhadas por cantigas e cânticos que evocam a presença dos espíritos.
      </Text>

      <Text style={styles.paragraph}>
        Cada traje de Ègúngún carrega a memória dos ancestrais, sendo uma expressão de tradição, respeito e ancestralidade em cada detalhe.
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("cursoRoupasEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar às Categorias</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- CURSO: Roupa de Bàbá Egum - Brasil ----------------
if (screen === "roupaBrasil") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>👘 Roupa de Bàbá Egum - Brasil</Text>

      <Text style={styles.paragraph}>
        No Brasil, especialmente nos terreiros de Candomblé da Bahia, a vestimenta ritual de Babá Egum (ou Egun) é composta por três partes principais, cada uma com funções simbólicas e práticas distintas.
      </Text>

      <Text style={styles.paragraph}>
        Essas vestimentas são altamente sagradas e devem ser tratadas com o máximo respeito.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>1. Abalá</Text>

      <Text style={styles.paragraph}>
        O <Text style={{ fontWeight: 'bold' }}>abalá</Text> é uma estrutura rígida que cobre a parte superior da cabeça do Babá Egum.
      </Text>

      <Text style={styles.paragraph}>
        Geralmente tem formato quadrado ou redondo e é adornado com franjas de tiras de pano coloridas.
      </Text>

      <Text style={styles.paragraph}>
        Além de proteger a cabeça, simboliza a conexão do Egum com o mundo espiritual.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>2. Kafô</Text>

      <Text style={styles.paragraph}>
        O <Text style={{ fontWeight: 'bold' }}>kafô</Text> é uma túnica longa que cobre o corpo do Babá Egum, incluindo braços e pernas.
      </Text>

      <Text style={styles.paragraph}>
        As mangas se estendem até as mãos, transformando-se em luvas, e as pernas se alargam até os pés, funcionando como sapatos.
      </Text>

      <Text style={styles.paragraph}>
        Do tórax para baixo, o kafô é adornado com tiras de pano coloridas, muitas vezes bordadas com búzios, espelhos e miçangas, que representam a riqueza espiritual e material do Egum.
      </Text>

      <Text style={[styles.subHeading, { marginTop: 20 }]}>3. Banté</Text>

      <Text style={styles.paragraph}>
        O <Text style={{ fontWeight: 'bold' }}>banté</Text> é uma faixa ou tira de pano especial que é presa ao kafô.
      </Text>

      <Text style={styles.paragraph}>
        Cada Babá Egum possui um banté único, decorado de forma individualizada, que serve para identificá-lo e diferenciá-lo de outros Eguns.
      </Text>

      <Text style={styles.paragraph}>
        É considerado um dos elementos mais sagrados da vestimenta.
      </Text>

      <Text style={styles.paragraph}>
        Essas vestimentas são confeccionadas com materiais como tecidos coloridos, búzios, espelhos e miçangas, e são consideradas altamente sagradas.
      </Text>

      <Text style={styles.paragraph}>
        Durante os rituais, os Babá Egum se apresentam com essas vestimentas, representando os espíritos dos ancestrais que retornam para interagir com os vivos.
      </Text>

      <Text style={styles.paragraph}>
        É importante destacar que, devido à sua sacralidade, essas vestimentas não devem ser tocadas por pessoas não iniciadas, e os rituais devem ser conduzidos com o máximo respeito e reverência.
      </Text>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("cursoRoupasEegungun")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar às Categorias</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- CURSO: Orikis ----------------
if (screen === "cursoOrikis") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>📜 Orikis</Text>

      <Text style={styles.paragraph}>
        Nesta seção você poderá acessar os diferentes Orikis relacionados a Èègúngún.
      </Text>

      {/* Botões dos Orikis */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orikiEgungunJeWaMemu")}
      >
        <Text style={styles.menuButtonText}>ÈÈGÚNGÚN JE WA MEMU</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orikiEgungunJeWaMemuMeji")}
      >
        <Text style={styles.menuButtonText}>ÈÈGÚNGÚN JE WA MEMU MEJI</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orikiEgungun")}
      >
        <Text style={styles.menuButtonText}>ORIKI ÈÈGÚNGÚN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orikiEgungunItaparica")}
      >
        <Text style={styles.menuButtonText}>ORIKI ÈÈGÚNGÚN ITAPARICA</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("orikiEgungunItaparicaMeji")}
      >
        <Text style={styles.menuButtonText}>ORIKI ÈÈGÚNGÚN ITAPARICA MEJI</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("cursos")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar aos Cursos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- CURSO: Oráculos Divinatórios ----------------
if (screen === "cursoOraculos") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>🔮 Oráculos Divinatórios</Text>

      <Text style={styles.paragraph}>
        Os 16 Odus principais são a base do sistema de divinação iorubá, cada um representando aspectos essenciais da vida, do destino e da espiritualidade.
      </Text>

      <Text style={styles.paragraph}>
        O método tradicional de estudo consiste em gravar <Text style={{ fontWeight: 'bold' }}>1 Odu a cada 4 dias</Text>, totalizando <Text style={{ fontWeight: 'bold' }}>64 dias</Text> para memorizar e assimilar os 16 Odus principais.
      </Text>

      <Text style={styles.paragraph}>
        Este processo permite que o iniciado compreenda profundamente cada Odu, suas mensagens e aplicações na prática divinatória.
      </Text>

      {/* Botões dos cursos */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("odusPrincipaisOrunmila")}
      >
        <Text style={styles.menuButtonText}>16 ODUS PRINCIPAIS (ORUNMILÁ)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("odusPrincipaisOsetura")}
      >
        <Text style={styles.menuButtonText}>16 ODUS PRINCIPAIS (OSETURÁ)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("odusMejiEegungun")}
      >
        <Text style={styles.menuButtonText}>16 ODUS MEJI DE ÈÈGÚNGÚN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("cursoObiAbata")}
      >
        <Text style={styles.menuButtonText}>CURSO DE OBÍ ABATÁ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("merindilogunOtoOrisa")}
      >
        <Text style={styles.menuButtonText}>MERINDILOGUN (OTO ORISÁ)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setScreen("ojuEegungun")}
      >
        <Text style={styles.menuButtonText}>OJÚ ÈÈGÚNGÚN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 30 }]}
        onPress={() => setScreen("cursos")}
      >
        <Text style={styles.menuButtonText}>🔙 Voltar aos Cursos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

  // ---------------- CALENDÁRIO DE FESTAS ----------------
  if (screen === "calendario") {
    return (
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <Text style={styles.sectionTitle}>📅 Calendário de Festas</Text>

        <Text style={styles.paragraph}>
          Nesta tela você pode cadastrar festas futuras (somente usuários autorizados com a senha).
          As festas são salvas apenas em memória (para persistência real, devemos integrar com banco).
        </Text>

        <TextInput style={styles.input} placeholder="Senha para liberar cadastro" secureTextEntry value={calSenha} onChangeText={setCalSenha} />

        <TouchableOpacity style={styles.menuButton} onPress={tentarLiberarCadastroCalendario}>
          <Text style={styles.menuButtonText}>Liberar Cadastro</Text>
        </TouchableOpacity>

        {/* Formulário de cadastro (funciona mesmo que você não tenha liberado com sucesso; checagem final na função) */}
        <TextInput style={styles.input} placeholder="Nome da Festa" value={calNome} onChangeText={setCalNome} />
        <TextInput style={styles.input} placeholder="Data (ex: 02/11 ou Mês de Maio)" value={calData} onChangeText={setCalData} />
        <TextInput style={[styles.input, { height: 90 }]} placeholder="Descrição" value={calDescricao} onChangeText={setCalDescricao} multiline />

        <TouchableOpacity style={styles.menuButton} onPress={cadastrarFesta}>
          <Text style={styles.menuButtonText}>💾 Cadastrar Festa</Text>
        </TouchableOpacity>

        <Text style={[styles.subHeading, { marginTop: 12 }]}>Festas cadastradas (sessão)</Text>
        {festas.length === 0 ? (
          <Text style={styles.paragraph}>Nenhuma festa cadastrada nesta sessão.</Text>
        ) : (
          <FlatList
            data={festas}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardDate}>{item.data}</Text>
                <Text style={styles.cardDesc}>{item.descricao}</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("menu")}>
          <Text style={styles.menuButtonText}>🔙 Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ---------------- CONTATOS / PERGUNTAS FREQUENTES ----------------
if (screen === "contatos") {
  const abrirWhatsApp = () => {
    const phoneNumber = "5532984794519"; // formato internacional
    const message = "Olá, gostaria de mais informações sobre Èègúngún.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    try {
      Linking.openURL(url);
    } catch (error) {
      alert("Em ambiente de teste o link não abre, mas funcionará no app instalado.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📞 Contatos e Perguntas Frequentes</Text>

        <Text style={styles.text}>
          Caso tenha dúvidas sobre o culto de Èègúngún, os cursos, festas ou consultas espirituais, 
          entre em contato diretamente comigo pelo WhatsApp.
        </Text>

        <TouchableOpacity style={styles.whatsappButton} onPress={abrirWhatsApp}>
          <Text style={styles.whatsappButtonText}>💬 Falar no WhatsApp</Text>
        </TouchableOpacity>

        <Text style={styles.subTitle}>❓ Perguntas Frequentes</Text>
        <Text style={styles.text}>
          🔹 <Text style={{fontWeight:"bold"}}>O que é o culto de Èègúngún?</Text>{"\n"}
          É o culto aos ancestrais masculinos, guardiões da linhagem familiar e da memória ancestral.{"\n\n"}
          🔹 <Text style={{fontWeight:"bold"}}>Como posso participar de um curso?</Text>{"\n"}
          Os cursos são divulgados na aba “Cursos” e também pelo grupo oficial do WhatsApp.{"\n\n"}
          🔹 <Text style={{fontWeight:"bold"}}>As consultas podem ser feitas online?</Text>{"\n"}
          Sim. As consultas podem ser realizadas presencialmente ou online, com relatório e acompanhamento.
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={() => setScreen("menu")}>
          <Text style={styles.backButtonText}>⬅️ Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

  // ---------------- ASSENTAMENTO ----------------
if (screen === "assentamento") {
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <Text style={styles.sectionTitle}>⚱️ Assentamento</Text>

      <Text style={styles.paragraph}>
        O assentamento de Èègúngún é a configuração sagrada onde se firma a presença dos
        ancestrais na Terra. Ele representa a ligação entre o mundo espiritual e o mundo
        material, sendo o ponto de força que ancora a energia ancestral dentro da casa de Àṣẹ.
        É por meio dele que Èègúngún é reverenciado, consultado e fortalecido, garantindo a
        harmonia entre vivos e mortos, entre o passado e o presente.

        {"\n\n"}⚱️ <Text style={{ fontWeight: "bold" }}>Finalidade do Assentamento:</Text>{"\n"}
        A finalidade de um assentamento de Èègúngún é estabelecer um elo permanente com as forças
        ancestrais, permitindo que elas protejam, orientem e sustentem espiritualmente toda a
        comunidade ligada a essa casa. O assentamento é o coração espiritual do culto de Èègúngún,
        responsável por manter viva a ancestralidade e equilibrar as energias no Àiyé (mundo físico).

        {"\n\n"}🌿 <Text style={{ fontWeight: "bold" }}>Cuidados básicos com o Assentamento:</Text>{"\n"}
        O assentamento de Èègúngún deve ser cuidado com zelo e respeito. A limpeza (Osé) deve ser
        realizada a cada 4 dias, conforme o calendário sagrado (Kojoda), ou aos domingos, conforme
        a tradição Yorùbá. Após a limpeza, Èègúngún deve ser untado com uma mistura de azeite de
        dendê, mel e gim — essa combinação serve para manter sua energia ativa, suavizar possíveis
        tensões espirituais e atrair boas vibrações.  

        {"\n\n"}☀️ <Text style={{ fontWeight: "bold" }}>Forma de Cultuar:</Text>{"\n"}
        Èègúngún deve ser cultuado de 4 em 4 dias de acordo com o Kojoda (calendário Yorùbá),
        ou aos domingos. Essa é a prática correta dentro da tradição Yorùbá. Diferente da cultura
        afro-brasileira, que tem o costume de cultuar Egum na segunda-feira, o culto Yorùbá segue o
        ritmo original dos ancestrais, respeitando os ciclos espirituais do tempo sagrado.

        {"\n\n"}O cuidado contínuo com o assentamento é o que garante que Èègúngún mantenha sua
        força, proteção e presença ativa entre os descendentes. É um compromisso de fé, respeito e
        continuidade da ancestralidade viva.
      </Text>

      <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("menu")}>
        <Text style={styles.menuButtonText}>🔙 Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

  // fallback
  return null;
}

/* =========================
   STYLES
   ========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F8FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  containerScroll: {
    flexGrow: 1,
    backgroundColor: "#E6F8FF",
    paddingTop: 30,
    alignItems: "center",
    paddingBottom: 30,
  },

  /* HOME */
  homeTitle: { fontSize: 26, fontWeight: "bold", color: "#003366", textAlign: "center" },
  homeSubtitle: { fontSize: 15, color: "#003366", marginBottom: 18, textAlign: "center" },
  homeButton: {
    backgroundColor: "#0099ff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 12,
    width: "70%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  homeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  homeSignature: { marginTop: 26, color: "#003366", fontStyle: "italic" },

  /* MENU */
  menuTitle: { fontSize: 22, fontWeight: "bold", color: "#003366", marginBottom: 14 },
  menuButton: {
    backgroundColor: "#4DB6E3",
    width: "86%",
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  menuButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backButton: {
    backgroundColor: "#003366",
    width: "86%",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
    alignItems: "center",
  },
  backButtonText: { color: "#fff", fontWeight: "bold" },

  /* TEXTS */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00264d",
    marginBottom: 10,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: "#00264d",
    marginHorizontal: 18,
    marginBottom: 10,
    lineHeight: 22,
    textAlign: "justify",
  },
  subHeading: { fontSize: 17, fontWeight: "bold", color: "#003366", marginTop: 8 },

  /* LIST */
  listItem: { fontSize: 15, color: "#003366", marginLeft: 8, marginVertical: 4 },

  /* INPUTS & CARD */
  input: {
    width: "86%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#cfeefe",
    marginVertical: 8,
  },
  card: {
    width: "90%",
    backgroundColor: "#d9f0ff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  cardTitle: { fontWeight: "bold", color: "#003366", fontSize: 16 },
  cardDate: { color: "#004080", marginTop: 4 },
  cardDesc: { color: "#003055", marginTop: 6 },

  /* Modal (login) */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#003366", marginBottom: 10 },
  modalButton: {
    width: "85%",
    backgroundColor: "#0099ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  card: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 20,
  marginVertical: 20,
  marginHorizontal: 10,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
},
whatsappButton: {
  backgroundColor: "#25D366",
  padding: 14,
  borderRadius: 12,
  marginVertical: 15,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
whatsappButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  loginMsg: { color: "#cc0000", marginTop: 6 },

  /* small */
  menuButtonSmall: { width: "86%", paddingVertical: 8, borderRadius: 8, marginVertical: 6 },
});