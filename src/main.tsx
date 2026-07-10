import React, { ComponentType, CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  FileText,
  HandCoins,
  LineChart,
  Mail,
  Menu,
  Phone,
  Workflow,
  X,
} from "lucide-react";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

type Solution = {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  detail: string;
  icon: IconComponent;
  bullets: string[];
  image: string;
  metric: string;
  accent: string;
};

type SolutionVisualSet = {
  hero: string;
  banner: string;
  flow: string;
  layout: "capital" | "protection" | "advisory" | "retail" | "control";
};

type SolutionTheme = {
  proof: { value: string; label: string }[];
  audience: string;
  promise: string;
  operatingTitle: string;
  operatingText: string;
  operating: { title: string; text: string }[];
  cases: { title: string; text: string }[];
  flow: { title: string; text: string }[];
  faq: { q: string; a: string }[];
};

const HERO_IMAGE = "/assets/credmais-campaign-hero.png";
const ABOUT_IMAGE = "/assets/credmais-campaign-about.png";
const CONTACT_IMAGE = "/assets/credmais-humanized-finance.png";
const LOGO_IMAGE = "/assets/credmais-logo.avif";
const CONTACT_EMAIL = "contato@credmaissecuritizadora.com.br";
const CONTACT_WHATSAPP_DISPLAY = "(11) 94089-3852";
const CONTACT_WHATSAPP_URL = "https://wa.me/5511940893852";
const CONTACT_CNPJ = "67.859.471/0001-20";

const solutionVisualSets: Partial<Record<string, SolutionVisualSet>> = {
  "antecipacao-de-recebiveis": {
    hero: "/assets/page-antecipacao-hero.png",
    banner: "/assets/page-antecipacao-banner.png",
    flow: "/assets/page-antecipacao-flow.png",
    layout: "capital",
  },
  "boleto-garantido": {
    hero: "/assets/page-boleto-hero.png",
    banner: "/assets/page-boleto-banner.png",
    flow: "/assets/page-boleto-flow.png",
    layout: "protection",
  },
  consultoria: {
    hero: "/assets/page-consultoria-hero.png",
    banner: "/assets/page-consultoria-banner.png",
    flow: "/assets/page-consultoria-flow.png",
    layout: "advisory",
  },
  crediario: {
    hero: "/assets/page-crediario-hero.png",
    banner: "/assets/page-crediario-banner.png",
    flow: "/assets/page-crediario-flow.png",
    layout: "retail",
  },
  "gestao-de-contas": {
    hero: "/assets/page-gestao-hero.png",
    banner: "/assets/page-gestao-banner.png",
    flow: "/assets/page-gestao-flow.png",
    layout: "control",
  },
};

const solutions: Solution[] = [
  {
    slug: "antecipacao-de-recebiveis",
    title: "Antecipacao de Recebiveis",
    headline: "Transforme vendas a prazo em caixa hoje.",
    summary: "Vendeu a prazo? Receba a vista. A Credmais encurta o ciclo financeiro para sua empresa investir onde importa.",
    detail: "Compra de recebiveis comerciais com analise objetiva, documentacao clara e pagamento agil.",
    icon: HandCoins,
    bullets: ["Taxas competitivas", "Analise de duplicatas, boletos e contratos", "Fluxo de caixa imediato"],
    image: "/assets/solution-antecipacao-red.png",
    metric: "Caixa imediato",
    accent: "#ef1717",
  },
  {
    slug: "boleto-garantido",
    title: "Boleto Garantido",
    headline: "Recebimento garantido, sem risco de inadimplencia.",
    summary: "Seguranca para vender com boleto e reduzir o impacto financeiro de atrasos e inadimplencia.",
    detail: "Proteja o recebimento da operacao e simplifique a gestao de risco comercial.",
    icon: FileText,
    bullets: ["Risco reduzido de perda", "Gestao de cobranca inclusa", "Previsibilidade no contas a receber"],
    image: "/assets/solution-boleto-red.png",
    metric: "Recebimento protegido",
    accent: "#e5161d",
  },
  {
    slug: "consultoria",
    title: "Consultoria",
    headline: "Estruturacao financeira sob medida.",
    summary: "Especialistas para desenhar a melhor estrutura de capital para o momento real do seu negocio.",
    detail: "Avaliamos contratos, recebiveis, prazos, garantias e rotina financeira para montar uma estrategia aderente ao fluxo.",
    icon: LineChart,
    bullets: ["Diagnostico de fluxo", "Estrategia de capital de giro", "Reestruturacao com dados"],
    image: "/assets/solution-consultoria-purple.png",
    metric: "Decisao orientada",
    accent: "#8b23d8",
  },
  {
    slug: "crediario",
    title: "Crediario",
    headline: "Ofereca parcelamento ao seu cliente final.",
    summary: "Venda mais com parcelamento direto, sem uma jornada bancaria pesada para o comprador.",
    detail: "Conecte sua venda ao financiamento do cliente final com analise, documentacao e acompanhamento da carteira.",
    icon: CircleDollarSign,
    bullets: ["Parcelamento para vender mais", "Jornada simples", "Acompanhamento de carteira"],
    image: "/assets/solution-crediario-lavender.png",
    metric: "Mais conversao",
    accent: "#a638e8",
  },
  {
    slug: "gestao-de-contas",
    title: "Gestao de Contas",
    headline: "Controle e conciliacao do seu fluxo.",
    summary: "Controle total do contas a receber e a pagar em uma rotina mais clara, intuitiva e humana.",
    detail: "Apoio no controle operacional de contas, conciliacoes e previsoes para melhorar a tomada de decisao financeira.",
    icon: Workflow,
    bullets: ["Rotina organizada", "Conciliacao de recebiveis", "Visao clara de entradas e saidas"],
    image: "/assets/solution-gestao-blue.png",
    metric: "Fluxo sob controle",
    accent: "#1f7be8",
  },
];

const trustProfiles = ["Varejo B2B", "Servicos", "Distribuicao", "Industria", "Operacoes recorrentes"];

const testimonials = [
  {
    quote: "A Credmais ajudou nossa equipe a entender onde antecipar, onde proteger e como planejar o caixa sem improviso.",
    author: "Diretoria financeira",
    company: "Empresa de distribuicao",
  },
  {
    quote: "O atendimento deixou a operacao simples: recebiveis, boletos e prazos ficaram claros antes da decisao.",
    author: "Gestao comercial",
    company: "Rede de servicos",
  },
  {
    quote: "Conseguimos oferecer prazo ao cliente mantendo visibilidade sobre risco, cobranca e recebimento.",
    author: "Operacao financeira",
    company: "Varejo B2B",
  },
];

const homeFaq = [
  {
    q: "Qual solucao escolher primeiro?",
    a: "Comece pelo objetivo: caixa imediato, protecao do boleto, crediario para vender mais, consultoria ou gestao de contas.",
  },
  {
    q: "A Credmais avalia minha operacao antes da proposta?",
    a: "Sim. A analise considera recebiveis, prazos, documentos, risco e necessidade real de capital.",
  },
  {
    q: "Preciso contratar todos os servicos?",
    a: "Nao. A estrutura pode comecar por uma frente e evoluir conforme a rotina financeira da empresa.",
  },
];

const solutionThemes: Record<string, SolutionTheme> = {
  "antecipacao-de-recebiveis": {
    proof: [
      { value: "D+1", label: "caixa em operacoes elegiveis" },
      { value: "Prazo", label: "transformado em folego imediato" },
      { value: "Carteira", label: "avaliada antes da oferta" },
    ],
    audience: "Para empresas que vendem a prazo e precisam manter compra, folha, estoque ou expansao sem esperar vencimentos.",
    promise: "A antecipacao organiza duplicatas, boletos ou contratos em uma operacao simples, com leitura clara de risco e custo.",
    operatingTitle: "Prioridade para liquidez sem desmontar sua venda a prazo.",
    operatingText: "A pagina de antecipacao mostra o caminho do recebivel ate o caixa com foco em velocidade, margem e previsibilidade.",
    operating: [
      { title: "Selecao do lote", text: "Escolha quais recebiveis fazem sentido antecipar e preserve os demais para o fluxo futuro." },
      { title: "Custo visivel", text: "Veja taxa, prazo e valor liquido antes de assumir a operacao." },
      { title: "Caixa direcionado", text: "Use o capital para estoque, folha, fornecedor ou campanha sem perder leitura do ciclo." },
    ],
    cases: [
      { title: "Estoque e compra", text: "Use recebiveis futuros para aproveitar oportunidades comerciais sem travar o giro." },
      { title: "Folha e fornecedores", text: "Antecipe entradas previstas para cumprir compromissos sem recorrer a credito pesado." },
      { title: "Expansao comercial", text: "Venda mais a prazo mantendo capital para operar o crescimento." },
    ],
    flow: [
      { title: "Carteira", text: "Recebiveis, cedentes, sacados e prazos entram na primeira leitura." },
      { title: "Oferta", text: "Taxa, prazo, documentos e valor liquido ficam claros antes da assinatura." },
      { title: "Caixa", text: "Com tudo validado, a liberacao acontece com acompanhamento da operacao." },
    ],
    faq: [
      { q: "Preciso antecipar toda a carteira?", a: "Nao. A operacao pode ser montada por lote, prazo ou necessidade de caixa." },
      { q: "A taxa aparece antes?", a: "Sim. A proposta deixa custo, valor liquido e condicoes visiveis antes da decisao." },
      { q: "Serve para vendas recorrentes?", a: "Sim. A Credmais pode acompanhar ciclos recorrentes para dar previsibilidade." },
    ],
  },
  "boleto-garantido": {
    proof: [
      { value: "Protecao", label: "contra inadimplencia" },
      { value: "Cobranca", label: "acompanhada pela operacao" },
      { value: "Previsao", label: "melhor no contas a receber" },
    ],
    audience: "Para empresas que vendem por boleto e querem reduzir incerteza no recebimento sem travar a venda.",
    promise: "O boleto garantido protege o fluxo, melhora a previsibilidade e reduz a pressao da inadimplencia.",
    operatingTitle: "Uma camada de protecao para vender por boleto com menos risco.",
    operatingText: "A pagina separa emissao, risco e acompanhamento para deixar claro onde a Credmais reduz a incerteza.",
    operating: [
      { title: "Politica de risco", text: "A operacao considera cliente, valor, prazo e historico antes da protecao." },
      { title: "Acompanhamento", text: "A cobranca e o status do boleto deixam de ficar soltos na rotina." },
      { title: "Previsibilidade", text: "A empresa planeja entradas com menos surpresa e menor exposicao a inadimplencia." },
    ],
    cases: [
      { title: "Venda B2B", text: "Mantenha prazo comercial para clientes sem carregar todo o risco sozinho." },
      { title: "Carteira pulverizada", text: "Organize cobranca e recebimento quando ha muitos boletos em aberto." },
      { title: "Fluxo previsivel", text: "Planeje entradas com menos surpresa e mais clareza sobre riscos." },
    ],
    flow: [
      { title: "Emissao", text: "A operacao considera dados do boleto, cliente e historico de recebimento." },
      { title: "Protecao", text: "O risco e avaliado e o acompanhamento reduz exposicao a atrasos." },
      { title: "Recebimento", text: "O fluxo fica mais previsivel para tomada de decisao financeira." },
    ],
    faq: [
      { q: "Substitui a cobranca interna?", a: "A estrutura pode complementar sua rotina, com acompanhamento e leitura financeira." },
      { q: "Ajuda em clientes novos?", a: "Sim, desde que a operacao tenha dados suficientes para analise de risco." },
      { q: "Melhora o caixa?", a: "Melhora a previsibilidade e pode ser combinada com outras solucoes de capital." },
    ],
  },
  consultoria: {
    proof: [
      { value: "Diagnostico", label: "do fluxo e da carteira" },
      { value: "Plano", label: "sob medida para capital" },
      { value: "Dados", label: "para decidir com clareza" },
    ],
    audience: "Para empresas que precisam entender qual estrutura financeira faz sentido antes de contratar capital.",
    promise: "A consultoria traduz recebiveis, contratos, prazos e garantias em uma estrategia financeira executavel.",
    operatingTitle: "Diagnostico financeiro para decidir antes de contratar capital.",
    operatingText: "A consultoria ganhou uma leitura mais estrategica, mostrando cenarios, prioridades e execucao em vez de apenas servico.",
    operating: [
      { title: "Mapa do fluxo", text: "Entradas, saidas, contratos e gargalos aparecem em uma mesma leitura." },
      { title: "Cenarios comparados", text: "A empresa entende impacto de prazo, taxa, garantia e necessidade real de capital." },
      { title: "Plano de acao", text: "A recomendacao vira uma sequencia pratica para ajustar rotina e credito." },
    ],
    cases: [
      { title: "Reestruturacao", text: "Organize compromissos, vencimentos e fontes de capital com menos improviso." },
      { title: "Crescimento", text: "Planeje expansao sem comprometer margem, caixa e relacao com clientes." },
      { title: "Decisao de credito", text: "Compare alternativas com custo, prazo e impacto operacional claros." },
    ],
    flow: [
      { title: "Raio-x", text: "Mapeamento de fluxo, contratos, recebiveis e gargalos de caixa." },
      { title: "Cenario", text: "Simulacoes de estrutura, custo, prazo e impacto financeiro." },
      { title: "Execucao", text: "Acompanhamento para transformar plano em rotina financeira." },
    ],
    faq: [
      { q: "E apenas para empresas grandes?", a: "Nao. A consultoria atende empresas que precisam estruturar melhor o fluxo." },
      { q: "Inclui operacao de credito?", a: "Pode incluir, quando fizer sentido dentro do diagnostico." },
      { q: "Qual e a entrega?", a: "Clareza sobre estrutura, prioridades e caminho financeiro para executar." },
    ],
  },
  crediario: {
    proof: [
      { value: "Mais", label: "conversao no ponto de venda" },
      { value: "Prazo", label: "para o cliente final" },
      { value: "Carteira", label: "acompanhada pela operacao" },
    ],
    audience: "Para empresas que querem vender mais oferecendo parcelamento direto ao cliente final com menos friccao.",
    promise: "O crediario permite ampliar ticket, aumentar conversao e manter controle da carteira gerada.",
    operatingTitle: "Parcelamento como ferramenta comercial, nao como improviso.",
    operatingText: "A pagina de crediario diferencia melhor a jornada de venda, aprovacao e acompanhamento da carteira.",
    operating: [
      { title: "Oferta no momento certo", text: "O parcelamento entra quando o preco a vista trava a decisao do cliente." },
      { title: "Aprovacao clara", text: "Dados e documentos sao tratados com uma jornada simples para o comprador." },
      { title: "Carteira acompanhada", text: "A empresa vende mais sem perder visao sobre parcelas e recebimentos." },
    ],
    cases: [
      { title: "Varejo e servicos", text: "Ofereca prazo ao comprador sem depender de uma jornada bancaria pesada." },
      { title: "Ticket maior", text: "Transforme compras maiores em parcelas mais acessiveis para o cliente." },
      { title: "Venda assistida", text: "Equipe comercial ganha uma opcao clara para fechar oportunidades." },
    ],
    flow: [
      { title: "Proposta", text: "O cliente escolhe parcelamento dentro de regras comerciais e financeiras." },
      { title: "Analise", text: "A operacao valida dados, documentos e condicoes de aprovacao." },
      { title: "Venda", text: "A empresa vende com mais previsibilidade e acompanha a carteira." },
    ],
    faq: [
      { q: "Serve para loja fisica e online?", a: "Sim. A estrutura pode apoiar venda presencial, assistida ou digital." },
      { q: "O cliente precisa ir ao banco?", a: "A proposta e simplificar a jornada e reduzir friccao para o comprador." },
      { q: "Ajuda a vender mais?", a: "Sim, principalmente quando o preco a vista limita a decisao do cliente." },
    ],
  },
  "gestao-de-contas": {
    proof: [
      { value: "360", label: "graus do fluxo financeiro" },
      { value: "Rotina", label: "mais organizada" },
      { value: "Concilia", label: "entradas, saidas e previsoes" },
    ],
    audience: "Para empresas que precisam enxergar contas a receber, contas a pagar e conciliacao em uma rotina mais simples.",
    promise: "A gestao de contas reduz ruído operacional e melhora a leitura do caixa antes das decisoes.",
    operatingTitle: "Rotina financeira visivel para agir antes do problema aparecer.",
    operatingText: "A gestao de contas ganhou uma leitura de controle: entradas, saidas, previsao e decisao conectadas.",
    operating: [
      { title: "Consolidacao", text: "Contas, prazos e pendencias saem de leituras soltas e entram em uma base unica." },
      { title: "Conferencia", text: "A conciliacao reduz divergencias entre o que foi vendido, recebido e pago." },
      { title: "Decisao diaria", text: "A visao do fluxo mostra quando antecipar, proteger, renegociar ou segurar caixa." },
    ],
    cases: [
      { title: "Conferencia diaria", text: "Acompanhe entradas, saidas e pendencias sem depender de planilhas soltas." },
      { title: "Previsao de caixa", text: "Tenha visao clara do que entra, vence e precisa de acao." },
      { title: "Operacao integrada", text: "Conecte recebiveis, boletos, contas e oportunidades de capital." },
    ],
    flow: [
      { title: "Organizacao", text: "Mapeamento das contas, categorias, prazos e responsaveis." },
      { title: "Conciliacao", text: "Entradas e saidas sao acompanhadas para reduzir divergencias." },
      { title: "Decisao", text: "O fluxo vira base para antecipar, proteger ou ajustar capital." },
    ],
    faq: [
      { q: "Substitui meu financeiro?", a: "Nao. A solucao apoia a rotina e melhora a visao para decisao." },
      { q: "Ajuda com conciliacao?", a: "Sim. Esse e um dos focos para reduzir erro e retrabalho." },
      { q: "Conecta com outras solucoes?", a: "Sim. A leitura do fluxo pode indicar antecipacao, boleto ou consultoria." },
    ],
  },
};

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname.replace(/\/+$/, "") || "/");
  useEffect(() => {
    const update = () => setPathname(window.location.pathname.replace(/\/+$/, "") || "/");
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return pathname;
}

function App() {
  const pathname = usePathname();
  const page = useMemo(() => {
    const solution = solutions.find((item) => pathname === `/${item.slug}`);
    if (solution) return <SolutionPage solution={solution} />;
    if (pathname === "/sobre") return <AboutPage />;
    if (pathname === "/contato") return <ContactPage />;
    return <HomePage />;
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#16001f] text-white">
      <Header pathname={pathname} />
      <main>{page}</main>
      <Footer />
    </div>
  );
}

function Header({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-4 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <nav className={`mx-auto flex max-w-7xl items-center justify-between rounded-[28px] px-5 py-3 backdrop-blur-2xl transition-all md:px-7 ${scrolled ? "border border-black/10 bg-white/92 text-[#09111f]" : "border border-white/18 bg-black/18 text-white"}`}>
        <a href="/" className="flex items-center gap-3">
          <span className={`brand-logo-shell ${scrolled ? "is-scrolled" : ""}`}>
            <img src={LOGO_IMAGE} alt="Credmais Securitizadora" />
          </span>
        </a>
        <div className="hidden items-center gap-9 text-[11px] font-black uppercase tracking-[0.18em] md:flex">
          <NavLink href="/" active={pathname === "/"} scrolled={scrolled}>Inicio</NavLink>
          <SolutionsDropdown pathname={pathname} scrolled={scrolled} />
          <NavLink href="/sobre" active={pathname === "/sobre"} scrolled={scrolled}>Sobre</NavLink>
          <NavLink href="/contato" active={pathname === "/contato"} scrolled={scrolled}>Contato</NavLink>
        </div>
        <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noreferrer" className={`hidden items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-[0.16em] transition md:inline-flex ${scrolled ? "bg-[#16001f] text-white" : "bg-white text-[#16001f]"}`}>
          Diagnosticar caixa <ArrowUpRight className="h-4 w-4" />
        </a>
        <button className={`grid h-11 w-11 place-items-center rounded-full border md:hidden ${scrolled ? "border-black/10 bg-[#f6f7fb]" : "border-white/18 bg-white/12 text-white"}`} onClick={() => setOpen((value) => !value)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="mobile-menu-panel mx-5 mb-4 grid gap-2 rounded-[28px] border border-black/10 bg-white p-3 text-[#09111f] shadow-2xl md:hidden">
          <MobileLink href="/" onClick={() => setOpen(false)}>Inicio</MobileLink>
          <span className="px-4 pt-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#ff5b00]">Solucoes</span>
          {solutions.map((solution) => <MobileLink key={solution.slug} href={`/${solution.slug}`} onClick={() => setOpen(false)}>{solution.title}</MobileLink>)}
          <MobileLink href="/sobre" onClick={() => setOpen(false)}>Sobre</MobileLink>
          <MobileLink href="/contato" onClick={() => setOpen(false)}>Contato</MobileLink>
        </div>
      )}
    </header>
  );
}

function SolutionsDropdown({ pathname, scrolled }: { pathname: string; scrolled: boolean }) {
  const active = solutions.some((item) => pathname === `/${item.slug}`);
  return (
    <div className="group relative">
      <a href="/#solucoes" className={`inline-flex items-center gap-2 py-3 transition ${active ? "text-[#ff5b00]" : scrolled ? "text-[#293041]/68" : "text-white/72"}`}>
        Solucoes <span className="grid h-5 w-5 place-items-center rounded-full border border-current/20 transition group-hover:rotate-180"><ChevronDown className="h-3 w-3" /></span>
      </a>
      <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 translate-y-3 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <div className="solutions-menu solutions-menu-compact overflow-hidden rounded-[24px] border border-white/60 bg-white p-2 text-[#09111f] shadow-[0_24px_70px_rgba(10,4,22,0.22)]">
          <div className="px-3 pb-2 pt-2">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ff5b00]">Solucoes</span>
            <p className="mt-1 text-xs font-bold leading-5 text-[#6b7280]">Escolha a melhor frente para seu fluxo.</p>
          </div>
          <div className="grid gap-1">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              const itemActive = pathname === `/${solution.slug}`;
              return (
                <a key={solution.slug} href={`/${solution.slug}`} className={`solutions-menu-item ${itemActive ? "is-active" : ""}`} style={{ "--accent": solution.accent } as CSSProperties}>
                  <span className="solutions-menu-icon"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0"><strong>{solution.title}</strong><span>{solution.metric}</span></span>
                  <ArrowUpRight className="solutions-menu-arrow h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, active, scrolled, children }: { href: string; active: boolean; scrolled: boolean; children: ReactNode }) {
  return <a href={href} className={`transition ${active ? "text-[#ff5b00]" : scrolled ? "text-[#293041]/68" : "text-white/72"}`}>{children}</a>;
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: ReactNode }) {
  return <a href={href} onClick={onClick} className="rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#293041]/75 hover:bg-[#f6f7fb]">{children}</a>;
}

function useHomeMotion() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: prefersReducedMotion ? 12 : 48 }, {
          autoAlpha: 1,
          y: 0,
          duration: prefersReducedMotion ? 0.35 : 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
          },
        });
      });

      if (!prefersReducedMotion) {
        gsap.to(".hero-bg-image", {
          scale: 1.08,
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: ".campaign-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".engine-orbit", {
          rotate: 32,
          ease: "none",
          scrollTrigger: {
            trigger: ".webgl-engine",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".float-layer").forEach((layer, index) => {
          gsap.to(layer, {
            yPercent: index % 2 ? -10 : 12,
            xPercent: index % 2 ? 3 : -3,
            ease: "none",
            scrollTrigger: {
              trigger: layer.closest("section") ?? layer,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }

      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        const railSection = document.querySelector<HTMLElement>(".motion-rail-section");
        const railViewport = document.querySelector<HTMLElement>(".motion-rail-viewport");
        const railTrack = document.querySelector<HTMLElement>(".motion-rail-track");
        const railImages = railTrack ? Array.from(railTrack.querySelectorAll("img")) : [];
        const refreshRail = () => ScrollTrigger.refresh();
        let cleanupRail = () => undefined;

        if (railSection && railViewport && railTrack) {
          railSection.classList.add("is-gsap-ready");
          railSection.style.setProperty("--rail-progress", "0");

          const getDistance = () => Math.max(0, railTrack.scrollWidth - railViewport.clientWidth);

          gsap.to(railTrack, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: railSection,
              start: "top top",
              end: () => `+=${Math.max(window.innerHeight, getDistance() + window.innerHeight * 0.35)}`,
              scrub: prefersReducedMotion ? 1.1 : 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                railSection.style.setProperty("--rail-progress", self.progress.toFixed(3));
              },
            },
          });

          railImages.forEach((image) => {
            if (!image.complete) image.addEventListener("load", refreshRail, { once: true });
          });

          const resizeObserver = new ResizeObserver(refreshRail);
          resizeObserver.observe(railTrack);
          resizeObserver.observe(railViewport);

          gsap.delayedCall(0.15, refreshRail);
          gsap.delayedCall(0.75, refreshRail);

          cleanupRail = () => {
            railSection.classList.remove("is-gsap-ready");
            railSection.style.removeProperty("--rail-progress");
            railImages.forEach((image) => image.removeEventListener("load", refreshRail));
            resizeObserver.disconnect();
            gsap.set(railTrack, { clearProps: "transform,opacity,visibility" });
          };
        }

        gsap.utils.toArray<HTMLElement>(".home-pin-card").forEach((card, index) => {
          gsap.fromTo(card, { y: 80 + index * 18, rotate: index % 2 ? 2 : -2, autoAlpha: 0.35 }, {
            y: index * -16,
            rotate: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".home-pin-section",
              start: "top 70%",
              end: "bottom 45%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });

        return () => {
          cleanupRail();
          gsap.set(".home-pin-card", { clearProps: "transform,opacity,visibility" });
        };
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh, { once: true });
      document.fonts?.ready.then(refresh).catch(() => undefined);
      gsap.delayedCall(0.35, refresh);

      return () => {
        window.removeEventListener("load", refresh);
        media.revert();
      };
    });

    return () => {
      ctx.revert();
    };
  }, []);
}

function WebGLFinanceField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: true });
    if (!canvas || !gl) return;

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fragmentSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      float circle(vec2 uv, vec2 p, float r) {
        return smoothstep(r, r - 0.006, length(uv - p));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv.x *= u_resolution.x / u_resolution.y;
        float t = u_time * 0.22;
        vec3 color = vec3(0.025, 0.008, 0.055);
        float grid = 0.0;
        vec2 gv = fract((uv + vec2(t * 0.08, -t * 0.04)) * 9.0) - 0.5;
        grid += smoothstep(0.012, 0.0, abs(gv.x)) * 0.08;
        grid += smoothstep(0.012, 0.0, abs(gv.y)) * 0.05;
        float glow = 0.0;
        for (int i = 0; i < 7; i++) {
          float fi = float(i);
          vec2 p = vec2(0.18 + fi * 0.18, 0.52 + sin(t + fi * 0.9) * 0.16);
          p.x *= u_resolution.x / u_resolution.y;
          glow += circle(uv, p, 0.026 + sin(t + fi) * 0.006);
          glow += 0.022 / max(0.02, length(uv - p));
        }
        float wave = sin((uv.x * 5.5 + uv.y * 2.0 + t * 2.8) * 3.14159) * 0.5 + 0.5;
        color += vec3(0.85, 0.20, 1.0) * glow * 0.18;
        color += vec3(1.0, 0.34, 0.02) * wave * 0.08;
        color += vec3(0.15, 0.50, 1.0) * grid;
        float vignette = smoothstep(1.35, 0.25, distance(uv, vec2(0.7, 0.52)));
        gl_FragColor = vec4(color * vignette, 1.0);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "a_position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    let frame = 0;
    const render = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(time, now * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-canvas" aria-hidden="true" />;
}

function HomePage() {
  useHomeMotion();
  return (
    <>
      <CampaignHero image={HERO_IMAGE} eyebrow="Credmais Securitizadora" titleStart="Venda a prazo." titleBridge="Receba com" words={["liquidez.", "seguranca.", "previsibilidade."]} description="Capital para sua empresa crescer sem esperar o vencimento dos recebiveis." ctaText="Antecipe recebiveis, proteja boletos, organize contas e venda mais com credito estruturado sem depender de banco proprio." buttonText="Quero diagnostico financeiro" buttonHref={CONTACT_WHATSAPP_URL} />
      <HomeProofSection />
      <WebGLEngineSection />
      <PinnedJourneySection />
      <section id="solucoes" className="solutions-showcase relative px-5 py-24 text-[#080510] md:px-[8%] md:py-32">
        <div className="solutions-showcase-bg" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="solutions-scroll-layout">
            <div className="solutions-scroll-copy gsap-reveal">
              <p className="solutions-eyebrow">Solucoes Credmais</p>
              <h2>Transforme seu caixa.</h2>
              <p>
                Uma esteira financeira para vender a prazo, antecipar recebiveis, proteger boletos e organizar contas com previsibilidade.
              </p>

              <div className="solutions-metrics" aria-label="Indicadores das solucoes">
                <span><strong>5</strong> frentes financeiras</span>
                <span><strong>D+1</strong> em operacoes elegiveis</span>
                <span><strong>360</strong> graus do contas a receber</span>
              </div>

              <div className="solutions-scroll-rail" aria-hidden="true">
                <span />
              </div>
            </div>

            <div className="solution-scroll-list">
              {solutions.map((solution, index) => <SolutionCard key={solution.slug} solution={solution} index={index} />)}
            </div>
          </div>
        </div>
      </section>
      <MotionRailSection />
      <HomeTrustSection />
      <HomeFAQSection />
      <ContactSection />
    </>
  );
}

function HomeProofSection() {
  const stats = [
    { value: "D+1", label: "liberacao em operacoes elegiveis" },
    { value: "5", label: "solucoes integradas para o caixa" },
    { value: "360", label: "visao do contas a receber" },
    { value: "Risco", label: "analisado antes da decisao" },
  ];

  return (
    <section className="home-proof-section">
      <div className="home-proof-shell">
        <div className="home-proof-copy gsap-reveal">
          <span>Base operacional</span>
          <h2>Credito com imagem, ritmo e leitura de decisao.</h2>
          <p>Os indicadores aparecem junto de pessoas, operacao e contexto para a marca parecer proxima e confiavel.</p>
        </div>
        <div className="home-proof-media float-layer">
          <img src="/assets/home-proof-finance.png" alt="" loading="lazy" decoding="async" />
          <div className="home-proof-badge">operacao acompanhada</div>
        </div>
        <div className="home-proof-grid">
          {stats.map((item) => (
            <article key={item.value} className="home-proof-card gsap-reveal">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WebGLEngineSection() {
  const stats = [
    { label: "Carteira analisada", value: "94%", note: "leitura de recebiveis" },
    { label: "Risco protegido", value: "baixo", note: "decisao acompanhada" },
    { label: "Pagamento", value: "D+1", note: "operacoes elegiveis" },
  ];

  return (
    <section className="webgl-engine">
      <WebGLFinanceField />
      <div className="engine-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="webgl-engine-copy gsap-reveal">
        <span>Motor financeiro</span>
        <h2>Analise, protecao e capital em um fluxo claro.</h2>
        <p>
          Uma leitura visual da operacao: carteira validada, risco acompanhado e liberacao organizada para a empresa vender sem perder previsibilidade.
        </p>
        <div className="engine-actions">
          <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noreferrer">
            Diagnosticar minha operacao
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <div className="engine-mini-proof">
            <strong>3 etapas</strong>
            <span>analise, estrutura e caixa</span>
          </div>
        </div>
      </div>

      <div className="engine-visual-stack gsap-reveal">
        <div className="engine-human-card float-layer">
          <img src="/assets/credmais-comerciante.jpg" alt="" loading="lazy" decoding="async" />
          <div className="engine-human-caption">
            <span>analise humana + tecnologia</span>
            <strong>Operacao acompanhada</strong>
          </div>
        </div>
        <div className="engine-flow-line" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="engine-dashboard">
          {stats.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PinnedJourneySection() {
  const steps = [
    { title: "Diagnostico", text: "Leitura da carteira, prazos, boletos, contratos e urgencia de capital.", image: "/assets/credmais-pessoal.jpg" },
    { title: "Estrutura", text: "A Credmais define melhor solucao, taxa, garantia e documentos necessarios.", image: "/assets/home-journey-estrutura.png" },
    { title: "Liberacao", text: "O caixa entra com acompanhamento para a empresa vender e operar sem pausa.", image: "/assets/home-journey-liberacao.png" },
  ];

  return (
    <section className="home-pin-section">
      <div className="home-pin-copy gsap-reveal">
        <span>Jornada Credmais</span>
        <h2>Uma esteira que acompanha o scroll e o fluxo da empresa.</h2>
        <p>Cada etapa foi organizada para parecer simples na tela, mas robusta por tras da operacao.</p>
      </div>
      <div className="home-pin-stack">
        {steps.map((step, index) => (
          <article key={step.title} className="home-pin-card">
            <img src={step.image} alt="" loading="lazy" decoding="async" />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MotionRailSection() {
  const items = [
    { image: "/assets/home-rail-capital.png", title: "Capital para vender sem esperar", text: "Antecipacao feita para transformar prazo em caixa planejado." },
    { image: "/assets/home-rail-boleto.png", title: "Protecao para receber melhor", text: "Boleto, risco e cobranca em uma rotina mais previsivel." },
    { image: "/assets/home-rail-crediario.png", title: "Venda parcelada com apoio", text: "Crediario para aumentar conversao no cliente final." },
    { image: "/assets/home-rail-gestao.png", title: "Gestao que aparece no dia a dia", text: "Contas, conciliacao e fluxo financeiro com leitura simples." },
  ];

  return (
    <section className="motion-rail-section">
      <div className="motion-rail-heading gsap-reveal">
        <span>Scroll experience</span>
        <h2>Imagens, ritmo e narrativa para manter a home completa.</h2>
      </div>
      <div className="motion-rail-viewport">
        <div className="motion-rail-track">
          {items.map((item) => (
            <article key={item.title} className="motion-rail-card">
              <img src={item.image} alt="" loading="lazy" decoding="async" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="motion-rail-progress" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

function HomeTrustSection() {
  return (
    <section className="home-trust-section">
      <div className="home-trust-heading gsap-reveal">
        <span>Confianca para decidir</span>
        <h2>Prova social sem exagero: clareza, acompanhamento e operacao visivel.</h2>
        <p>Empresas com venda a prazo precisam de previsibilidade antes de assumir qualquer estrutura financeira.</p>
      </div>
      <div className="trust-profile-row" aria-label="Perfis de empresas atendidas">
        {trustProfiles.map((profile) => (
          <span key={profile}>{profile}</span>
        ))}
      </div>
      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <article key={item.author} className="testimonial-card gsap-reveal">
            <p>{item.quote}</p>
            <div>
              <strong>{item.author}</strong>
              <span>{item.company}</span>
            </div>
          </article>
        ))}
      </div>
      <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noreferrer" className="trust-cta">
        Avaliar minha operacao
        <ArrowUpRight className="h-4 w-4" />
      </a>
      <p className="cta-microcopy">Sem conta digital propria. A Credmais estrutura capital, risco e contas para sua empresa.</p>
    </section>
  );
}

function HomeFAQSection() {
  return (
    <section className="home-faq-section">
      <div className="home-faq-heading gsap-reveal">
        <span>FAQ</span>
        <h2>Duvidas comuns antes de falar com a Credmais.</h2>
      </div>
      <div className="home-faq-list">
        {homeFaq.map((item) => (
          <article key={item.q} className="home-faq-item gsap-reveal">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  const Icon = solution.icon;
  return (
    <a href={`/${solution.slug}`} className="solution-showcase-card group" style={{ "--accent": solution.accent } as CSSProperties}>
      <div className="solution-card-media">
        <img src={solution.image} alt={solution.title} loading="lazy" decoding="async" />
        <span>{String(index + 1).padStart(2, "0")} / {solution.metric}</span>
      </div>
      <div className="solution-card-body">
        <div className="solution-card-topline">
          <span className="solution-card-icon"><Icon className="h-5 w-5" /></span>
          <span className="solution-card-kicker">Credmais</span>
        </div>
        <h3>{solution.title}</h3>
        <p>{solution.summary}</p>
        <div className="solution-card-points">
          {solution.bullets.slice(0, 2).map((bullet) => (
            <span key={bullet}>
              <CheckCircle2 className="h-4 w-4" />
              {bullet}
            </span>
          ))}
        </div>
        <span className="solution-card-link">
          Ver detalhes
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}

function SolutionPage({ solution }: { solution: Solution }) {
  const theme = solutionThemes[solution.slug];
  const visualSet = getSolutionVisualSet(solution);
  const heroCopy: Record<string, { titleStart: string; titleBridge: string; words: string[] }> = {
    "antecipacao-de-recebiveis": {
      titleStart: "Antecipe vendas.",
      titleBridge: "Receba com",
      words: ["liquidez.", "folego.", "controle."],
    },
    "boleto-garantido": {
      titleStart: "Boleto protegido.",
      titleBridge: "Venda com",
      words: ["seguranca.", "garantia.", "controle."],
    },
    consultoria: {
      titleStart: "Decida melhor.",
      titleBridge: "Cresca com",
      words: ["estrategia.", "clareza.", "dados."],
    },
    crediario: {
      titleStart: "Parcele mais.",
      titleBridge: "Venda com",
      words: ["crediario.", "conversao.", "controle."],
    },
    "gestao-de-contas": {
      titleStart: "Organize contas.",
      titleBridge: "Tenha",
      words: ["visao clara.", "fluxo.", "controle."],
    },
  };
  const copy = heroCopy[solution.slug] ?? {
    titleStart: solution.title,
    titleBridge: "com",
    words: ["controle.", "clareza.", "capital."],
  };

  return (
    <>
      <CampaignHero image={visualSet.hero} eyebrow={solution.metric} titleStart={copy.titleStart} titleBridge={copy.titleBridge} words={copy.words} description={solution.summary} ctaText={`${solution.headline} A Credmais avalia documentos, risco, prazo e melhor estrutura para sua operacao, sem modelo de banco proprio.`} buttonText={`Avaliar ${solution.title}`} buttonHref={CONTACT_WHATSAPP_URL} />
      <SolutionProofStrip solution={solution} theme={theme} />
      <section className={`solution-detail-intro solution-detail-${visualSet.layout}`} style={{ "--accent": solution.accent } as CSSProperties}>
        <div className="solution-detail-shell">
          <div className="solution-detail-copy solution-animated">
            <p>{solution.metric}</p>
            <h2>{solution.title}</h2>
            <span>{theme.audience}</span>
          </div>
          <div className="solution-bullet-grid">
            {solution.bullets.map((bullet, index) => (
              <div key={bullet} className="solution-bullet-card solution-animated">
                <CheckCircle2 className="h-6 w-6" />
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SolutionThemeMosaic solution={solution} theme={theme} visualSet={visualSet} />
      <SolutionOperatingPanel solution={solution} theme={theme} visualSet={visualSet} />
      <SolutionExperience solution={solution} theme={theme} visualSet={visualSet} />
      <SolutionFaqSection solution={solution} theme={theme} />
      <ContactSection compact />
    </>
  );
}

function getSolutionVisualSet(solution: Solution): SolutionVisualSet {
  return solutionVisualSets[solution.slug] ?? {
    hero: solution.image,
    banner: solution.image,
    flow: CONTACT_IMAGE,
    layout: "capital",
  };
}

function SolutionProofStrip({ solution, theme }: { solution: Solution; theme: SolutionTheme }) {
  return (
    <section className="solution-proof-strip" style={{ "--accent": solution.accent } as CSSProperties}>
      {theme.proof.map((item) => (
        <article key={item.value}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </section>
  );
}

function SolutionThemeMosaic({ solution, theme, visualSet }: { solution: Solution; theme: SolutionTheme; visualSet: SolutionVisualSet }) {
  return (
    <section className={`solution-theme-mosaic solution-theme-${visualSet.layout}`} style={{ "--accent": solution.accent } as CSSProperties}>
      <div className="solution-theme-copy solution-animated">
        <div className="solution-theme-signal float-layer" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>{solution.title}</span>
        <h2>{theme.promise}</h2>
        <div className="solution-theme-badge">{solution.metric}</div>
      </div>
      <div className="solution-theme-cases">
        {theme.cases.map((item, index) => (
          <article key={item.title} className="solution-theme-case solution-animated">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SolutionOperatingPanel({ solution, theme, visualSet }: { solution: Solution; theme: SolutionTheme; visualSet: SolutionVisualSet }) {
  const Icon = solution.icon;
  return (
    <section className={`solution-operating-panel solution-operating-${visualSet.layout}`} style={{ "--accent": solution.accent } as CSSProperties}>
      <div className="solution-operating-copy solution-animated">
        <span>Plano operacional</span>
        <h2>{theme.operatingTitle}</h2>
        <p>{theme.operatingText}</p>
        <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noreferrer">
          Quero estruturar {solution.title}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
      <div className="solution-operating-stack" aria-label={`Plano operacional de ${solution.title}`}>
        {theme.operating.map((item, index) => (
          <article key={item.title} className="solution-operating-card solution-animated">
            <div>
              <Icon className="h-5 w-5" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SolutionExperience({ solution, theme, visualSet }: { solution: Solution; theme: SolutionTheme; visualSet: SolutionVisualSet }) {
  const Icon = solution.icon;
  const visuals = [
    { title: solution.metric, text: solution.headline },
    { title: "Atendimento humano", text: "Acompanhamento consultivo para a empresa entender cada etapa." },
    { title: "Operacao organizada", text: "Visao integrada de recebiveis, risco, contas e oportunidade comercial." },
  ];

  return (
    <div className={`solution-experience solution-layout-${visualSet.layout}`} style={{ "--accent": solution.accent } as CSSProperties}>
      <section className="solution-page-banner">
        <div className="solution-banner-copy solution-animated">
          <span>{solution.title}</span>
          <h2>Escolha a estrutura certa antes do caixa apertar.</h2>
          <p>
            Se a dor e falta de liquidez, inadimplencia, venda a prazo ou controle financeiro, a Credmais organiza a alternativa certa e acompanha a operacao.
          </p>
          <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noreferrer">
            Receber orientacao Credmais
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="solution-banner-media solution-animated">
          <img src={visualSet.banner} alt={solution.title} loading="lazy" decoding="async" />
          <div className="solution-floating-card solution-floating-card-a">
            <Icon className="h-5 w-5" />
            <strong>{solution.metric}</strong>
          </div>
          <div className="solution-floating-card solution-floating-card-b">
            <span>D+1</span>
            <small>agenda acompanhada</small>
          </div>
        </div>
      </section>

      <section className="solution-flow-section">
        <div className="solution-flow-sticky solution-animated">
          <span>Como funciona</span>
          <h2>Do pedido ao caixa, sem perder visibilidade.</h2>
          <p>{solution.detail}</p>
          <div className="solution-flow-image">
            <img src={visualSet.flow} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="solution-flow-steps">
          {theme.flow.map((item, index) => (
            <article key={item.title} className="solution-flow-step solution-animated">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="solution-visual-grid">
        {visuals.map((item, index) => (
          <article key={item.title} className="solution-visual-card solution-animated">
            <div className="solution-visual-orb" aria-hidden="true">
              <Icon className="h-6 w-6" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div>
              <span>Credmais</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function SolutionFaqSection({ solution, theme }: { solution: Solution; theme: SolutionTheme }) {
  return (
    <section className="solution-faq-section" style={{ "--accent": solution.accent } as CSSProperties}>
      <div className="solution-faq-heading solution-animated">
        <span>Duvidas frequentes</span>
        <h2>O que avaliar antes de escolher {solution.title.toLowerCase()}.</h2>
      </div>
      <div className="solution-faq-list">
        {theme.faq.map((item) => (
          <article key={item.q} className="solution-faq-item solution-animated">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </div>
      <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noreferrer" className="solution-faq-cta">
        Tirar duvidas no WhatsApp
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <CampaignHero image={ABOUT_IMAGE} eyebrow="Sobre a Credmais" titleStart="Credito humano." titleBridge="Crescimento com" words={["confianca.", "clareza.", "parceria."]} description="Uma securitizadora feita para simplificar capital, proteger operacoes e acompanhar empresas em cada fase." ctaText="Fomento, recebiveis, boletos, crediario, consultoria e gestao de contas para empresas que precisam de caixa claro." buttonText="Falar com a Credmais" buttonHref={CONTACT_WHATSAPP_URL} />
      <AboutIntroSection />
      <ContactSection compact />
    </>
  );
}

function AboutIntroSection() {
  const principles = [
    { value: "01", title: "Leitura humana", text: "Antes da proposta, entendemos rotina, prazos e pressao real do caixa." },
    { value: "02", title: "Estrutura clara", text: "Cada alternativa mostra custo, prazo, risco e impacto operacional." },
    { value: "03", title: "Acompanhamento", text: "A empresa nao fica sozinha depois da liberacao ou da decisao financeira." },
  ];

  return (
    <section className="about-intro-section">
      <div className="about-intro-copy">
        <span>Como trabalhamos</span>
        <h2>Mais que uma securitizadora, um parceiro de crescimento.</h2>
        <p>Humanizamos o credito e organizamos estruturas financeiras para empresas evoluirem com previsibilidade, sem deixar operacao, cobranca e capital em blocos separados.</p>
      </div>
      <div className="about-intro-media">
        <img src="/assets/credmais-refer.jpg" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="about-principles">
        {principles.map((item) => (
          <article key={item.value}>
            <strong>{item.value}</strong>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <>
      <CampaignHero image={CONTACT_IMAGE} eyebrow="Contato Credmais" titleStart="Vamos conversar." titleBridge="Sua empresa com" words={["capital.", "apoio.", "direcao."]} description="Conte o que sua empresa precisa. A Credmais avalia a melhor estrutura para o seu fluxo." ctaText="Envie sua necessidade: caixa imediato, boleto protegido, credito para vender mais, consultoria ou organizacao de contas." buttonText="Chamar no WhatsApp" buttonHref={CONTACT_WHATSAPP_URL} />
      <ContactSection compact />
    </>
  );
}

function CampaignHero({ image, eyebrow, titleStart, titleBridge, words, description, ctaText, buttonText, buttonHref }: { image: string; eyebrow: string; titleStart: string; titleBridge: string; words: string[]; description: string; ctaText: string; buttonText: string; buttonHref: string }) {
  return (
    <section className="campaign-hero relative isolate min-h-screen overflow-hidden bg-[#07020c]">
      <div className="hero-bg-image absolute inset-0 -z-10" aria-hidden="true">
        <img src={image} alt="" className="hero-full-image" />
      </div>
      <div className="hero-animated-copy">
        <span>{eyebrow}</span>
        <h1>
          {titleStart}
          <br />
          {titleBridge}
          <span className="hero-word-rotator" aria-hidden="true">
            {words.map((word) => <i key={word}>{word}</i>)}
          </span>
        </h1>
        <p>{description}</p>
      </div>
      <div className="hero-cta">
        <div className="hero-cta-panel">
          <div className="hero-cta-copy">
            <span>Operacao Credmais</span>
            <p>{ctaText}</p>
          </div>
          <div className="hero-service-links" aria-label="Servicos Credmais">
            {solutions.map((solution) => (
              <a key={solution.slug} href={`/${solution.slug}`} style={{ "--accent": solution.accent } as CSSProperties}>
                {solution.title}
              </a>
            ))}
          </div>
          <div className="hero-cta-action">
            <a href={buttonHref} className="hero-cta-button" target={buttonHref.startsWith("http") ? "_blank" : undefined} rel={buttonHref.startsWith("http") ? "noreferrer" : undefined}>
              {buttonText}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <small>Resposta pelo canal oficial da Credmais.</small>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ compact = false }: { compact?: boolean }) {
  return (
    <section id="contato" className={`bg-[#16001f] px-5 text-white md:px-[10%] ${compact ? "py-24" : "py-32"}`}>
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-6 text-xs font-black uppercase tracking-[0.36em] text-[#ffc6a3]">Contato</p>
        <h2 className="text-5xl font-black leading-none tracking-[-0.06em] md:text-8xl">O que sua empresa precisa resolver?</h2>
        <p className="mx-auto mt-6 max-w-3xl text-base font-bold leading-relaxed text-white/58 md:text-lg">
          Fale com a Credmais sobre falta de caixa, venda a prazo, inadimplencia, dificuldade de credito, boleto garantido, crediario ou gestao de contas.
        </p>
        <div className="contact-service-grid" aria-label="Servicos para contato">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <a key={solution.slug} href={`/${solution.slug}`} style={{ "--accent": solution.accent } as CSSProperties}>
                <span className="contact-service-icon"><Icon className="h-5 w-5" /></span>
                <strong>{solution.title}</strong>
                <small>{solution.metric}</small>
              </a>
            );
          })}
        </div>
        <form className="mt-16 grid gap-10 text-left">
          <div className="grid gap-10 md:grid-cols-2"><ContactInput placeholder="Seu nome" /><ContactInput placeholder="Seu e-mail" type="email" /></div>
          <ContactInput placeholder="Sua empresa" />
          <textarea className="contact-input min-h-36 resize-none" placeholder="Conte sua necessidade: antecipar recebiveis, proteger boleto, organizar contas, vender no crediario ou estruturar capital." />
          <div className="grid gap-8 pt-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="grid gap-3 text-sm text-white/55 md:text-left">
              <ContactLine icon={Phone} value={`WhatsApp ${CONTACT_WHATSAPP_DISPLAY}`} href={CONTACT_WHATSAPP_URL} />
              <ContactLine icon={Mail} value={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} />
              <ContactLine icon={FileText} value={`CNPJ ${CONTACT_CNPJ}`} />
            </div>
            <div className="contact-submit-wrap">
              <a href={CONTACT_WHATSAPP_URL} className="contact-submit" target="_blank" rel="noreferrer">
                Falar pelo WhatsApp
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <small>Ou envie email para {CONTACT_EMAIL}.</small>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function ContactInput({ placeholder, type = "text" }: { placeholder: string; type?: string }) {
  return <input type={type} placeholder={placeholder} className="contact-input" />;
}

function ContactLine({ icon: Icon, value, href }: { icon: IconComponent; value: string; href?: string }) {
  const content = (
    <>
      <Icon className="h-4 w-4 text-[#ff5b00]" />
      {value}
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex items-center gap-3 transition hover:text-white" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
        {content}
      </a>
    );
  }

  return <span className="flex items-center gap-3">{content}</span>;
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07020c] px-5 py-10 text-white md:px-[10%]">
      <span className="brand-logo-shell">
        <img src={LOGO_IMAGE} alt="Credmais Securitizadora" />
      </span>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
