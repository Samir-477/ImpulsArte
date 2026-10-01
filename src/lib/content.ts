export type Locale = "es" | "en";
export type ServiceKey = "websites" | "web-apps" | "maintenance";
export const serviceKeys: ServiceKey[] = [
  "websites",
  "web-apps",
  "maintenance",
];

export const content = {
  es: {
    nav: {
      services: "Servicios",
      process: "Cómo trabajamos",
      about: "Nosotros y contacto",
      contact: "Contacto",
      signin: "Ingresar",
      start: "Contanos tu proyecto",
    },
    home: {
      eyebrow: "Negocios y desarrollo digital, sin vueltas",
      title: "Tus ideas merecen hacerse realidad.",
      intro:
        "Sitios web, aplicaciones, servicios empresariales y consultoría digital. Un equipo que empieza por entender lo que necesitás.",
      searchLabel: "¿Qué necesitás?",
      searchPlaceholder: "Buscá servicios o consultoría...",
      browse: "Explorar servicios",
      sectionTitle: "Encontrá el servicio que encaja con tu proyecto.",
      sectionIntro:
        "Elegí un punto de partida. Después conversamos sobre el alcance real y armamos una propuesta a medida.",
      processTitle: "Un proceso que podés seguir de principio a fin.",
      processIntro:
        "Sabés quién está trabajando en tu proyecto, qué sigue y dónde está cada decisión.",
      steps: [
        {
          title: "Contanos la idea",
          body: "Compartí el objetivo, el contexto y los tiempos. No hace falta tener todo resuelto.",
        },
        {
          title: "Definimos el alcance",
          body: "Revisamos el pedido, hacemos las preguntas necesarias y enviamos una propuesta clara.",
        },
        {
          title: "Construimos juntos",
          body: "Un equipo asignado avanza por hitos y mantiene la conversación en un solo lugar.",
        },
      ],
      ctaTitle: "Empecemos por una buena conversación.",
      ctaBody:
        "Contanos qué querés resolver. Te ayudamos a encontrar el siguiente paso.",
      noResults:
        "No encontramos ese servicio. Contanos qué necesitás y vemos cómo ayudarte.",
    },
    services: {
      websites: {
        name: "Sitios web",
        eyebrow: "Presencia digital",
        short:
          "Un sitio rápido, claro y fácil de usar que represente bien a tu negocio.",
        detail:
          "Creamos sitios que explican lo que hacés y hacen simple el siguiente paso para tus clientes.",
        items: [
          "Sitios para empresas",
          "Landing pages",
          "Tiendas y catálogos",
          "Renovación de sitios",
        ],
        query: "sitio web pagina landing ecommerce tienda web",
      },
      "web-apps": {
        name: "Aplicaciones web",
        eyebrow: "Herramientas a medida",
        short:
          "Software que ordena procesos, conecta herramientas y ayuda a tu equipo a avanzar.",
        detail:
          "Diseñamos y desarrollamos herramientas digitales alrededor de un problema concreto de tu negocio.",
        items: [
          "Portales para clientes",
          "Paneles internos",
          "Automatizaciones",
          "Integraciones",
        ],
        query:
          "app aplicación software portal dashboard automatización integración saas",
      },
      maintenance: {
        name: "Mantenimiento",
        eyebrow: "Soporte continuo",
        short:
          "Mejoras, ajustes y ayuda técnica para que tu producto siga funcionando bien.",
        detail:
          "Acompañamos productos existentes con soporte técnico, mejoras planificadas y trabajo de evolución.",
        items: [
          "Corrección de errores",
          "Mejoras continuas",
          "Actualizaciones",
          "Soporte técnico",
        ],
        query: "mantenimiento soporte arreglar errores bug actualizar mejorar",
      },
    },
    common: {
      explore: "Ver servicio",
      allServices: "Todos los servicios",
      how: "Cómo trabajamos",
      discuss: "Hablemos de tu proyecto",
      customQuote: "Presupuesto a medida",
      learnMore: "Conocer más",
      project: "Empezar un proyecto",
      questions: "¿No sabés por dónde empezar?",
      answer:
        "Contanos qué querés lograr. Te ayudamos a elegir el camino adecuado.",
      footerLine: "Somos la herramienta que mueve tus ideas a la realidad",
      rights: "Todos los derechos reservados.",
      legalPending:
        "El contenido legal estará disponible antes del lanzamiento público.",
    },
  },
  en: {
    nav: {
      services: "Services",
      process: "How we work",
      about: "About & contact",
      contact: "Contact",
      signin: "Sign in",
      start: "Tell us about your project",
    },
    home: {
      eyebrow: "Business and digital development, made clear",
      title: "Your ideas deserve to become reality.",
      intro:
        "Websites, applications, business services and digital consultancy. A team that starts by understanding what you need.",
      searchLabel: "What do you need?",
      searchPlaceholder: "Search services or consultancy...",
      browse: "Explore services",
      sectionTitle: "Find the right starting point for your project.",
      sectionIntro:
        "Choose a service to explore. Then we will discuss the real scope and put together a tailored proposal.",
      processTitle: "A process you can follow from start to finish.",
      processIntro:
        "Know who is working on your project, what comes next and where each decision stands.",
      steps: [
        {
          title: "Share your idea",
          body: "Tell us your goal, context and timeline. You do not need every detail worked out.",
        },
        {
          title: "Define the scope",
          body: "We review your request, ask the right questions and send a clear proposal.",
        },
        {
          title: "Build together",
          body: "An assigned team works through milestones and keeps the conversation in one place.",
        },
      ],
      ctaTitle: "It starts with a good conversation.",
      ctaBody:
        "Tell us what you want to solve. We will help you find the next step.",
      noResults:
        "We could not find that service. Tell us what you need and we will see how to help.",
    },
    services: {
      websites: {
        name: "Websites",
        eyebrow: "Digital presence",
        short:
          "A fast, clear and easy-to-use site that represents your business well.",
        detail:
          "We create sites that explain what you do and make the next step simple for your clients.",
        items: [
          "Business websites",
          "Landing pages",
          "Stores and catalogs",
          "Website redesigns",
        ],
        query: "website landing ecommerce store business site",
      },
      "web-apps": {
        name: "Web applications",
        eyebrow: "Purpose-built tools",
        short:
          "Software that organizes processes, connects tools and helps your team move forward.",
        detail:
          "We design and build digital tools around a specific problem in your business.",
        items: [
          "Client portals",
          "Internal dashboards",
          "Automations",
          "Integrations",
        ],
        query: "app software portal dashboard automation integration saas",
      },
      maintenance: {
        name: "Maintenance",
        eyebrow: "Ongoing support",
        short:
          "Improvements, fixes and technical help so your product keeps working well.",
        detail:
          "We support existing products with technical help, planned improvements and ongoing development.",
        items: [
          "Bug fixes",
          "Ongoing improvements",
          "Updates",
          "Technical support",
        ],
        query: "maintenance support fix bugs update improve",
      },
    },
    common: {
      explore: "Explore service",
      allServices: "All services",
      how: "How we work",
      discuss: "Let's discuss your project",
      customQuote: "Tailored quote",
      learnMore: "Learn more",
      project: "Start a project",
      questions: "Not sure where to start?",
      answer:
        "Tell us what you want to achieve. We will help you choose the right path.",
      footerLine: "We turn your ideas into reality.",
      rights: "All rights reserved.",
      legalPending: "Legal content will be available before public launch.",
    },
  },
} as const;

export function getLocale(value: string): Locale | null {
  return value === "es" || value === "en" ? value : null;
}
export function servicePath(locale: Locale, service: ServiceKey) {
  return "/" + locale + "/services/" + service;
}
