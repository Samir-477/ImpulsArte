export const processStory = {
  es: {
    title: "Del primer mensaje a una entrega clara.",
    intro:
      "Cada etapa tiene una conversación, una decisión y algo concreto para revisar. Así sabés qué aportar y cómo avanzamos.",
    client: "Lo que aportás",
    team: "Lo que hacemos",
    outcome: "Lo que queda claro",
    desk: "Tu proyecto, paso a paso",
    stages: [
      {
        title: "Primero, entendemos el problema.",
        short: "Escuchar",
        body: "Antes de proponer una solución, conversamos sobre el objetivo, las personas que la van a usar y lo que hoy te está frenando.",
        client:
          "Tu idea, el contexto del negocio y referencias que ayuden a explicarla.",
        team: "Revisamos el pedido y hacemos preguntas sobre prioridades, restricciones y tiempos.",
        outcome:
          "Un punto de partida compartido y las preguntas que necesitamos resolver.",
        artifact: "La idea",
        notes: [
          "Objetivo del proyecto",
          "Personas y contexto",
          "Prioridades y preguntas",
        ],
      },
      {
        title: "Dibujamos un camino posible.",
        short: "Definir",
        body: "Convertimos la conversación en una propuesta. Acordamos qué entra en el proyecto y cómo vamos a revisar el avance.",
        client: "Tu feedback sobre las prioridades y la propuesta de alcance.",
        team: "Definimos entregables, responsabilidades, hitos y tiempos para acordarlos con vos.",
        outcome: "Una propuesta con alcance y próximos pasos definidos.",
        artifact: "El mapa",
        notes: [
          "Alcance acordado",
          "Entregables e hitos",
          "Responsables y tiempos",
        ],
      },
      {
        title: "Le damos forma, por partes.",
        short: "Construir",
        body: "El equipo trabaja sobre el alcance acordado. Revisamos las piezas del proyecto a medida que avanzan, en lugar de dejar toda la conversación para el final.",
        client: "El contenido y las decisiones necesarias para cada hito.",
        team: "Desarrollamos o preparamos los entregables y compartimos avances para revisión.",
        outcome:
          "Trabajo visible que se puede revisar contra el objetivo inicial.",
        artifact: "En construcción",
        notes: [
          "Trabajo por hitos",
          "Avances para revisar",
          "Decisiones compartidas",
        ],
      },
      {
        title: "Revisamos juntos los detalles.",
        short: "Revisar",
        body: "Comparamos los entregables con lo acordado, reunimos feedback y resolvemos los ajustes que corresponden al alcance.",
        client: "Comentarios concretos y validación de los entregables.",
        team: "Revisamos el funcionamiento o el contenido y coordinamos los ajustes necesarios.",
        outcome: "Una revisión compartida y los ajustes registrados.",
        artifact: "La revisión",
        notes: [
          "Feedback reunido",
          "Ajustes del alcance",
          "Validación conjunta",
        ],
      },
      {
        title: "Entregamos con el siguiente paso claro.",
        short: "Entregar",
        body: "Cerramos los entregables acordados y conversamos sobre cómo seguir: usar lo construido, implementarlo o definir una nueva etapa.",
        client:
          "La confirmación de la entrega y las dudas sobre los próximos pasos.",
        team: "Coordinamos la entrega y explicamos lo necesario para continuar.",
        outcome: "Entregables acordados y una dirección para lo que viene.",
        artifact: "El siguiente paso",
        notes: [
          "Entrega acordada",
          "Información para continuar",
          "Próxima etapa",
        ],
      },
    ],
  },
  en: {
    title: "From the first message to a clear handoff.",
    intro:
      "Every stage has a conversation, a decision and something concrete to review. You know what to contribute and how we move forward.",
    client: "What you bring",
    team: "What we do",
    outcome: "What becomes clear",
    desk: "Your project, step by step",
    stages: [
      {
        title: "First, we understand the problem.",
        short: "Listen",
        body: "Before suggesting a solution, we discuss the goal, the people who will use it and what is holding you back today.",
        client:
          "Your idea, business context and references that help explain it.",
        team: "We review the request and ask about priorities, constraints and timing.",
        outcome:
          "A shared starting point and the questions we need to resolve.",
        artifact: "The idea",
        notes: [
          "Project goal",
          "People and context",
          "Priorities and questions",
        ],
      },
      {
        title: "We draw a possible path.",
        short: "Define",
        body: "We turn the conversation into a proposal. Together, we agree on what belongs in the project and how we will review progress.",
        client: "Your feedback on priorities and the proposed scope.",
        team: "We define deliverables, responsibilities, milestones and timing for your agreement.",
        outcome: "A proposal with a defined scope and next steps.",
        artifact: "The map",
        notes: [
          "Agreed scope",
          "Deliverables and milestones",
          "Responsibilities and timing",
        ],
      },
      {
        title: "We give it shape, piece by piece.",
        short: "Build",
        body: "The team works through the agreed scope. We review the pieces as they develop, keeping the conversation open throughout the project.",
        client: "The content and decisions needed for each milestone.",
        team: "We develop or prepare the deliverables and share progress for review.",
        outcome: "Visible work that can be checked against the original goal.",
        artifact: "Work in progress",
        notes: ["Milestone work", "Progress for review", "Shared decisions"],
      },
      {
        title: "We review the details together.",
        short: "Review",
        body: "We compare the deliverables with what we agreed, gather feedback and address adjustments within the scope.",
        client: "Specific feedback and validation of the deliverables.",
        team: "We review the functionality or content and coordinate the required adjustments.",
        outcome: "A shared review and a record of the adjustments.",
        artifact: "The review",
        notes: ["Collected feedback", "Scope adjustments", "Joint validation"],
      },
      {
        title: "We hand over with a clear next step.",
        short: "Deliver",
        body: "We close the agreed deliverables and discuss how to continue: use what we built, put it into practice or define another stage.",
        client: "Delivery confirmation and questions about what comes next.",
        team: "We coordinate the handoff and explain what you need to continue.",
        outcome: "Agreed deliverables and a direction for what follows.",
        artifact: "The next step",
        notes: ["Agreed delivery", "Information to continue", "Next stage"],
      },
    ],
  },
} as const;
