import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = join(scriptDirectory, '..');
const templatePath = join(sourceDirectory, 'index.html');

const englishPublicationTitles = [
  'The Interplay between Learning Design and Learning Analytics Indicators in Higher Education',
  'Exploring the Complex Analytics Interplay of LMS Design, Usage, Academic Outcomes, and Perceived Workload',
  'Institutional, Academic, and Learning Analytics: A Bibliometric Study',
  'Extracting Institutional Analytics Features from LMS Data: Towards Bridging LD Analytics and LA',
  'Surviving and Thriving: How Changes in Teaching Modalities Influenced Student Satisfaction',
  'Generative Pre-trained Transformers for Coding Text Data? An Analysis with Classroom Orchestration Data',
  'Teaching Principles of Programming without ICT: Design of a Board Game',
];

const locales = {
  es: {
    route: '/es/',
    htmlLang: 'es',
    title: 'Ariel Ortiz Beltrán — Investigador, ingeniero y educador',
    description: 'Investigador en analítica institucional y diseño del aprendizaje, con experiencia en arquitectura de datos, aprendizaje automático y educación superior.',
    ogTitle: 'Ariel Ortiz Beltrán — Portafolio',
    ogDescription: 'Dar sentido a los datos. Cuidar lo humano.',
    ogLocale: 'es_ES',
    ogAlternates: ['en_US', 'ca_ES'],
    currentLanguage: 'es',
    replacements: [
      ['<a href="#main" class="skip-link">Skip to content</a>', '<a href="#main" class="skip-link">Saltar al contenido</a>'],
      ['aria-label="Ariel Ortiz Beltrán, home"', 'aria-label="Ariel Ortiz Beltrán, inicio"'],
      ['<span>Menu</span>', '<span>Menú</span>'],
      ['aria-label="Main navigation"', 'aria-label="Navegación principal"'],
      ['<a href="#work" class="nav-link">Work</a>', '<a href="#work" class="nav-link">Proyectos</a>'],
      ['<a href="#research" class="nav-link">Research</a>', '<a href="#research" class="nav-link">Investigación</a>'],
      ['<a href="#about" class="nav-link">About</a>', '<a href="#about" class="nav-link">Sobre mí</a>'],
      ['<a href="#teaching" class="nav-link">Teaching</a>', '<a href="#teaching" class="nav-link">Docencia</a>'],
      ['<a href="#contact" class="nav-link nav-link--contact">Contact</a>', '<a href="#contact" class="nav-link nav-link--contact">Contacto</a>'],
      ['aria-label="Choose language"', 'aria-label="Elegir idioma"'],
      ['Institutional analytics · Learning design · Human-centered technology', 'Analítica institucional · Diseño del aprendizaje · Tecnología centrada en las personas'],
      ['Make sense of data.<br>Care for what makes us human.', 'Dar sentido a los datos.<br>Cuidar lo humano.'],
      ['I study how learning environments shape student experience, and I build data and machine-learning systems that make complex decisions easier.', 'Estudio cómo los entornos de aprendizaje influyen en la experiencia del estudiantado y construyo sistemas de datos y aprendizaje automático que facilitan decisiones complejas.'],
      ['>View projects</a>', '>Ver proyectos</a>'],
      ['>Email me <span', '>Escríbeme <span'],
      ['Postdoctoral Researcher · Universitat Pompeu Fabra · Barcelona', 'Investigador posdoctoral · Universitat Pompeu Fabra · Barcelona'],
      ['data-running="running:" data-boids="boids flocking" data-reaction-diffusion="reaction–diffusion" data-game-of-life="game of life"', 'data-running="ejecutando:" data-boids="simulación de boids" data-reaction-diffusion="reacción–difusión" data-game-of-life="juego de la vida"'],
      ['Move the pointer. The system responds.', 'Mueve el puntero. El sistema responde.'],
      ['aria-label="Areas of practice"', 'aria-label="Áreas de práctica"'],
      ['<h2>Research</h2>', '<h2>Investigar</h2>'],
      ['Course design, student engagement, workload, and academic outcomes.', 'Diseño de cursos, participación estudiantil, carga de trabajo y resultados académicos.'],
      ['<h2>Build</h2>', '<h2>Construir</h2>'],
      ['Data platforms, machine-learning systems, and visual tools.', 'Plataformas de datos, sistemas de aprendizaje automático y herramientas visuales.'],
      ['<h2>Serve</h2>', '<h2>Servir</h2>'],
      ['Teaching, community work, and technology centered on the people who use it.', 'Docencia, trabajo comunitario y tecnología centrada en las personas que la utilizan.'],
      ['<p class="section-kicker">01 / Work</p>', '<p class="section-kicker">01 / Proyectos</p>'],
      ['<h2>Selected projects</h2>', '<h2>Proyectos seleccionados</h2>'],
      ['A selection from more than eight years in software engineering, data architecture, machine learning, and applied research.', 'Una selección de más de ocho años de trabajo en ingeniería de software, arquitectura de datos, aprendizaje automático e investigación aplicada.'],
      ['Product architecture · Grupo Bernier', 'Arquitectura de producto · Grupo Bernier'],
      ['AnniQ — AutoML platform', 'AnniQ — Plataforma AutoML'],
      ['I designed the first version of a cloud platform that allowed non-technical teams to build machine-learning pipelines—from data ingestion to model deployment—without writing code.', 'Diseñé la primera versión de una plataforma en la nube que permitía a equipos no técnicos crear pipelines de aprendizaje automático —desde la ingesta de datos hasta el despliegue de modelos— sin escribir código.'],
      ['<dt>Role</dt><dd>Architect &amp; Tech Lead</dd>', '<dt>Rol</dt><dd>Arquitecto y líder técnico</dd>'],
      ['<dt>Focus</dt><dd>End-to-end ML workflows</dd>', '<dt>Enfoque</dt><dd>Flujos de trabajo de ML de principio a fin</dd>'],
      ['<dt>Stack</dt>', '<dt>Tecnologías</dt>'],
      ['Computer vision · Ecopetrol', 'Visión por computador · Ecopetrol'],
      ['Submarine pipeline inspection', 'Inspección de tuberías submarinas'],
      ['A real-time computer-vision system using convolutional neural networks to detect anomalies in submarine pipeline video.', 'Un sistema de visión por computador en tiempo real que utiliza redes neuronales convolucionales para detectar anomalías en vídeos de tuberías submarinas.'],
      ['1st place · Innovate 2019', 'Primer lugar · Innovate 2019'],
      ['Data architecture · DataKnow', 'Arquitectura de datos · DataKnow'],
      ['Cloud data architectures', 'Arquitecturas de datos en la nube'],
      ['At DataKnow, I designed analytics and forecasting architectures on AWS and Azure, covering ETL, data modeling, deployment, and maintenance.', 'En DataKnow diseñé arquitecturas de analítica y predicción en AWS y Azure, desde ETL y modelado de datos hasta despliegue y mantenimiento.'],
      ['aria-label="Technologies"', 'aria-label="Tecnologías"'],
      ['<span>Forecasting</span>', '<span>Predicción</span>'],
      ['Guest analytics · Movich Hotels', 'Analítica de huéspedes · Movich Hotels'],
      ['Guest analytics for Movich Hotels', 'Analítica de huéspedes para Movich Hotels'],
      ['At Grupo Bernier, I built machine-learning models and Tableau dashboards to analyze booking behavior for one of Colombia’s largest hotel chains.', 'En Grupo Bernier desarrollé modelos de aprendizaje automático y dashboards de Tableau para analizar el comportamiento de las reservas de una de las mayores cadenas hoteleras de Colombia.'],
      ['<p class="section-kicker">02 / Research</p>', '<p class="section-kicker">02 / Investigación</p>'],
      ['Learning design &amp; institutional analytics', 'Diseño del aprendizaje y analítica institucional'],
      ['I study relationships between course design, LMS use, student workload, and academic outcomes. More recently, I have explored how large language models can support the analysis of educational data.', 'Estudio las relaciones entre el diseño de cursos, el uso de LMS, la carga de trabajo del estudiantado y los resultados académicos. Más recientemente, he explorado cómo los modelos de lenguaje de gran tamaño pueden apoyar el análisis de datos educativos.'],
      ['aria-label="Current research focus"', 'aria-label="Enfoque de investigación actual"'],
      ['<p class="research-focus-label">Current question</p>', '<p class="research-focus-label">Pregunta actual</p>'],
      ['What can institutions learn from educational data—and what can the data not tell us?', '¿Qué pueden aprender las instituciones de los datos educativos y qué no pueden decirnos esos datos?'],
      ['<span>Institutional Analytics</span>', '<span>Analítica institucional</span>'],
      ['<span>Learning Design</span>', '<span>Diseño del aprendizaje</span>'],
      ['<span>Learning Analytics</span>', '<span>Analítica del aprendizaje</span>'],
      ['<span>Large Language Models</span>', '<span>Modelos de lenguaje de gran tamaño</span>'],
      ['<h3>Publications</h3>', '<h3>Publicaciones</h3>'],
      ['Open an entry for authors and links.', 'Abre una publicación para ver la autoría y los enlaces.'],
      ['Ph.D. Thesis · Universitat Pompeu Fabra', 'Tesis doctoral · Universitat Pompeu Fabra'],
      ['>View thesis <span', '>Ver tesis <span'],
      ['>Paper <span', '>Artículo <span'],
      ['>View <span', '>Ver <span'],
      ['<p class="section-kicker">03 / About</p>', '<p class="section-kicker">03 / Sobre mí</p>'],
      ['<h2>Background</h2>', '<h2>Trayectoria</h2>'],
      ['I’m from Bogotá and live in Barcelona. My work has moved between software engineering, data science, higher education, and learning design.', 'Soy de Bogotá y vivo en Barcelona. Mi trabajo ha transitado entre la ingeniería de software, la ciencia de datos, la educación superior y el diseño del aprendizaje.'],
      ['Eight years in industry taught me to build for real constraints and real users. Academia taught me to ask slower questions. I try to hold both habits together—and to treat technology as a form of service.', 'Ocho años en la industria me enseñaron a construir para restricciones y personas reales. La academia me enseñó a formular preguntas más pausadas. Intento mantener ambos hábitos —y entender la tecnología como una forma de servicio.'],
      ['<h3>Formation</h3>', '<h3>Formación</h3>'],
      ['Ph.D. in Information and Communication Technologies', 'Doctorado en Tecnologías de la Información y la Comunicación'],
      ['Deep Learning Specialization &amp; DS4A', 'Deep Learning Specialization y DS4A'],
      ['M.A. in Multimedia Creation &amp; Serious Games', 'Máster en Creación Multimedia y Serious Games'],
      ['Fundación Carolina scholarship', 'Beca de la Fundación Carolina'],
      ['B.Sc. in Systems Engineering', 'Grado en Ingeniería de Sistemas'],
      ['<h3>Practice</h3>', '<h3>Áreas de práctica</h3>'],
      ['<p>Technical</p>', '<p>Técnica</p>'],
      ['<span>Data Science</span>', '<span>Ciencia de datos</span>'],
      ['<span>Machine Learning</span>', '<span>Aprendizaje automático</span>'],
      ['<span>AWS &amp; Azure</span>', '<span>AWS y Azure</span>'],
      ['<span>Data Pipelines</span>', '<span>Pipelines de datos</span>'],
      ['<span>Visualization</span>', '<span>Visualización</span>'],
      ['<span>Software Engineering</span>', '<span>Ingeniería de software</span>'],
      ['<p>Teaching &amp; research</p>', '<p>Docencia e investigación</p>'],
      ['<span>Teaching</span>', '<span>Docencia</span>'],
      ['<span>Research</span>', '<span>Investigación</span>'],
      ['<span>UX Evaluation</span>', '<span>Evaluación UX</span>'],
      ['<span>Facilitation</span>', '<span>Facilitación</span>'],
      ['<p>Languages</p>', '<p>Idiomas</p>'],
      ['<span>Spanish · Native</span>', '<span>Español · Nativo</span>'],
      ['<span>English · C1</span>', '<span>Inglés · C1</span>'],
      ['<span>Catalan · B1</span>', '<span>Catalán · B1</span>'],
      ['<p class="section-kicker">Selected recognition</p>', '<p class="section-kicker">Reconocimientos destacados</p>'],
      ['<strong>1st Place</strong><span>Ecopetrol Innovate 2019 · Computer Vision</span>', '<strong>Primer lugar</strong><span>Ecopetrol Innovate 2019 · Visión por computador</span>'],
      ['<strong>Top 5 Project</strong><span>Data Science for All 2020 · 92 teams</span>', '<strong>Proyecto entre los 5 mejores</strong><span>Data Science for All 2020 · 92 equipos</span>'],
      ['<strong>PlaCLIK Grant</strong><span>Gamification-based programming pedagogy</span>', '<strong>Beca PlaCLIK</strong><span>Pedagogía de la programación basada en gamificación</span>'],
      ['<strong>Teaching nomination</strong>', '<strong>Nominación docente</strong>'],
      ['<p class="section-kicker">04 / Teaching</p>', '<p class="section-kicker">04 / Docencia</p>'],
      ['Teaching &amp; community', 'Docencia y comunidad'],
      ['I have taught in universities, online courses, and open workshops. My classes often use games and practical challenges to make algorithms and machine learning easier to enter without simplifying the subject.', 'He enseñado en universidades, cursos en línea y talleres abiertos. En mis clases suelo utilizar juegos y retos prácticos para facilitar la entrada a los algoritmos y al aprendizaje automático sin simplificar la materia.'],
      ['<h3>Guest Professor</h3>', '<h3>Profesor invitado</h3>'],
      ['Design and prototyping of ML and neural networks', 'Diseño y prototipado de ML y redes neuronales'],
      ['<h3>Instructor</h3>', '<h3>Docente</h3>'],
      ['Data Structures and Algorithms for ICT programs', 'Estructuras de datos y algoritmos para programas de TIC'],
      ['Associate Professor &amp; Researcher', 'Profesor asociado e investigador'],
      ['Algorithms, UX, and Systems Engineering curriculum redesign', 'Algoritmos, UX y rediseño curricular de Ingeniería de Sistemas'],
      ['<span>Online</span>', '<span>En línea</span>'],
      ['Machine Learning with Scikit-learn', 'Aprendizaje automático con Scikit-learn'],
      ['<p class="section-kicker">Community initiatives</p>', '<p class="section-kicker">Iniciativas comunitarias</p>'],
      ['A free weekly space for conversations about AI, machine learning, and data science across Latin America.', 'Un espacio semanal y gratuito para conversar sobre inteligencia artificial, aprendizaje automático y ciencia de datos en América Latina.'],
      ['Engega’t — Gamified Job Insertion', 'Engega’t — Inserción laboral gamificada'],
      ['Gamification design for a municipal job-insertion program for young people in Catalonia.', 'Diseño de gamificación para un programa municipal de inserción laboral dirigido a jóvenes en Cataluña.'],
      ['>Press <span', '>Prensa <span'],
      ['A Latin American space for open and alternative theological conversation.', 'Un espacio latinoamericano para una conversación teológica abierta y alternativa.'],
      ['>Visit <span', '>Visitar <span'],
      ['<p class="section-kicker">05 / Contact</p>', '<p class="section-kicker">05 / Contacto</p>'],
      ['<h2>Get in touch</h2>', '<h2>Hablemos</h2>'],
      ['If you are working on learning analytics, education, technology that serves people, or a problem that crosses disciplines, I would be glad to hear from you.', 'Si trabajas en analítica del aprendizaje, educación, tecnología al servicio de las personas o en un problema que cruza disciplinas, estaré encantado de conocerte.'],
      ['<span>Email</span><strong>', '<span>Correo</span><strong>'],
      ['Barcelona · Open to in-person and remote collaboration', 'Barcelona · Disponible para colaboraciones presenciales y remotas'],
      ['Built with curiosity and a few living algorithms.', 'Hecho con curiosidad y unos cuantos algoritmos vivos.'],
    ],
  },
  ca: {
    route: '/ca/',
    htmlLang: 'ca',
    title: 'Ariel Ortiz Beltrán — Investigador, enginyer i educador',
    description: 'Investigador en analítica institucional i disseny de l’aprenentatge, amb experiència en arquitectura de dades, aprenentatge automàtic i educació superior.',
    ogTitle: 'Ariel Ortiz Beltrán — Portafolis',
    ogDescription: 'Donar sentit a les dades. Tenir cura d’allò humà.',
    ogLocale: 'ca_ES',
    ogAlternates: ['en_US', 'es_ES'],
    currentLanguage: 'ca',
    replacements: [
      ['<a href="#main" class="skip-link">Skip to content</a>', '<a href="#main" class="skip-link">Ves al contingut</a>'],
      ['aria-label="Ariel Ortiz Beltrán, home"', 'aria-label="Ariel Ortiz Beltrán, inici"'],
      ['<span>Menu</span>', '<span>Menú</span>'],
      ['aria-label="Main navigation"', 'aria-label="Navegació principal"'],
      ['<a href="#work" class="nav-link">Work</a>', '<a href="#work" class="nav-link">Projectes</a>'],
      ['<a href="#research" class="nav-link">Research</a>', '<a href="#research" class="nav-link">Recerca</a>'],
      ['<a href="#about" class="nav-link">About</a>', '<a href="#about" class="nav-link">Sobre mi</a>'],
      ['<a href="#teaching" class="nav-link">Teaching</a>', '<a href="#teaching" class="nav-link">Docència</a>'],
      ['<a href="#contact" class="nav-link nav-link--contact">Contact</a>', '<a href="#contact" class="nav-link nav-link--contact">Contacte</a>'],
      ['aria-label="Choose language"', 'aria-label="Tria l’idioma"'],
      ['Institutional analytics · Learning design · Human-centered technology', 'Analítica institucional · Disseny de l’aprenentatge · Tecnologia centrada en les persones'],
      ['Make sense of data.<br>Care for what makes us human.', 'Donar sentit a les dades.<br>Tenir cura d’allò humà.'],
      ['I study how learning environments shape student experience, and I build data and machine-learning systems that make complex decisions easier.', 'Estudio com els entorns d’aprenentatge influeixen en l’experiència de l’estudiantat i construeixo sistemes de dades i aprenentatge automàtic que faciliten decisions complexes.'],
      ['>View projects</a>', '>Veure projectes</a>'],
      ['>Email me <span', '>Escriu-me <span'],
      ['Postdoctoral Researcher · Universitat Pompeu Fabra · Barcelona', 'Investigador postdoctoral · Universitat Pompeu Fabra · Barcelona'],
      ['data-running="running:" data-boids="boids flocking" data-reaction-diffusion="reaction–diffusion" data-game-of-life="game of life"', 'data-running="en execució:" data-boids="estol de boids" data-reaction-diffusion="reacció–difusió" data-game-of-life="joc de la vida"'],
      ['Move the pointer. The system responds.', 'Mou el punter. El sistema respon.'],
      ['aria-label="Areas of practice"', 'aria-label="Àmbits de pràctica"'],
      ['<h2>Research</h2>', '<h2>Investigar</h2>'],
      ['Course design, student engagement, workload, and academic outcomes.', 'Disseny de cursos, participació de l’estudiantat, càrrega de treball i resultats acadèmics.'],
      ['<h2>Build</h2>', '<h2>Construir</h2>'],
      ['Data platforms, machine-learning systems, and visual tools.', 'Plataformes de dades, sistemes d’aprenentatge automàtic i eines visuals.'],
      ['<h2>Serve</h2>', '<h2>Servir</h2>'],
      ['Teaching, community work, and technology centered on the people who use it.', 'Docència, treball comunitari i tecnologia centrada en les persones que la fan servir.'],
      ['<p class="section-kicker">01 / Work</p>', '<p class="section-kicker">01 / Projectes</p>'],
      ['<h2>Selected projects</h2>', '<h2>Projectes seleccionats</h2>'],
      ['A selection from more than eight years in software engineering, data architecture, machine learning, and applied research.', 'Una selecció de més de vuit anys de treball en enginyeria del programari, arquitectura de dades, aprenentatge automàtic i recerca aplicada.'],
      ['Product architecture · Grupo Bernier', 'Arquitectura de producte · Grupo Bernier'],
      ['AnniQ — AutoML platform', 'AnniQ — Plataforma AutoML'],
      ['I designed the first version of a cloud platform that allowed non-technical teams to build machine-learning pipelines—from data ingestion to model deployment—without writing code.', 'Vaig dissenyar la primera versió d’una plataforma al núvol que permetia a equips no tècnics crear pipelines d’aprenentatge automàtic —des de la ingesta de dades fins al desplegament de models— sense escriure codi.'],
      ['<dt>Role</dt><dd>Architect &amp; Tech Lead</dd>', '<dt>Rol</dt><dd>Arquitecte i líder tècnic</dd>'],
      ['<dt>Focus</dt><dd>End-to-end ML workflows</dd>', '<dt>Enfocament</dt><dd>Fluxos de treball d’ML d’extrem a extrem</dd>'],
      ['<dt>Stack</dt>', '<dt>Tecnologies</dt>'],
      ['Computer vision · Ecopetrol', 'Visió per computador · Ecopetrol'],
      ['Submarine pipeline inspection', 'Inspecció de canonades submarines'],
      ['A real-time computer-vision system using convolutional neural networks to detect anomalies in submarine pipeline video.', 'Un sistema de visió per computador en temps real que utilitza xarxes neuronals convolucionals per detectar anomalies en vídeos de canonades submarines.'],
      ['1st place · Innovate 2019', 'Primer lloc · Innovate 2019'],
      ['Data architecture · DataKnow', 'Arquitectura de dades · DataKnow'],
      ['Cloud data architectures', 'Arquitectures de dades al núvol'],
      ['At DataKnow, I designed analytics and forecasting architectures on AWS and Azure, covering ETL, data modeling, deployment, and maintenance.', 'A DataKnow vaig dissenyar arquitectures d’analítica i predicció a AWS i Azure, des d’ETL i modelatge de dades fins a desplegament i manteniment.'],
      ['aria-label="Technologies"', 'aria-label="Tecnologies"'],
      ['<span>Forecasting</span>', '<span>Predicció</span>'],
      ['Guest analytics · Movich Hotels', 'Analítica d’hostes · Movich Hotels'],
      ['Guest analytics for Movich Hotels', 'Analítica d’hostes per a Movich Hotels'],
      ['At Grupo Bernier, I built machine-learning models and Tableau dashboards to analyze booking behavior for one of Colombia’s largest hotel chains.', 'A Grupo Bernier vaig desenvolupar models d’aprenentatge automàtic i dashboards de Tableau per analitzar el comportament de les reserves d’una de les cadenes hoteleres més grans de Colòmbia.'],
      ['<p class="section-kicker">02 / Research</p>', '<p class="section-kicker">02 / Recerca</p>'],
      ['Learning design &amp; institutional analytics', 'Disseny de l’aprenentatge i analítica institucional'],
      ['I study relationships between course design, LMS use, student workload, and academic outcomes. More recently, I have explored how large language models can support the analysis of educational data.', 'Estudio les relacions entre el disseny de cursos, l’ús de l’LMS, la càrrega de treball de l’estudiantat i els resultats acadèmics. Més recentment, he explorat com els models de llenguatge de gran mida poden donar suport a l’anàlisi de dades educatives.'],
      ['aria-label="Current research focus"', 'aria-label="Enfocament actual de recerca"'],
      ['<p class="research-focus-label">Current question</p>', '<p class="research-focus-label">Pregunta actual</p>'],
      ['What can institutions learn from educational data—and what can the data not tell us?', 'Què poden aprendre les institucions de les dades educatives, i què no ens poden dir aquestes dades?'],
      ['<span>Institutional Analytics</span>', '<span>Analítica institucional</span>'],
      ['<span>Learning Design</span>', '<span>Disseny de l’aprenentatge</span>'],
      ['<span>Learning Analytics</span>', '<span>Analítica de l’aprenentatge</span>'],
      ['<span>Large Language Models</span>', '<span>Models de llenguatge de gran mida</span>'],
      ['<h3>Publications</h3>', '<h3>Publicacions</h3>'],
      ['Open an entry for authors and links.', 'Obre una publicació per veure’n l’autoria i els enllaços.'],
      ['Ph.D. Thesis · Universitat Pompeu Fabra', 'Tesi doctoral · Universitat Pompeu Fabra'],
      ['>View thesis <span', '>Veure la tesi <span'],
      ['>Paper <span', '>Article <span'],
      ['>View <span', '>Veure <span'],
      ['<p class="section-kicker">03 / About</p>', '<p class="section-kicker">03 / Sobre mi</p>'],
      ['<h2>Background</h2>', '<h2>Trajectòria</h2>'],
      ['I’m from Bogotá and live in Barcelona. My work has moved between software engineering, data science, higher education, and learning design.', 'Soc de Bogotà i visc a Barcelona. La meva feina ha transitat entre l’enginyeria del programari, la ciència de dades, l’educació superior i el disseny de l’aprenentatge.'],
      ['Eight years in industry taught me to build for real constraints and real users. Academia taught me to ask slower questions. I try to hold both habits together—and to treat technology as a form of service.', 'Vuit anys a la indústria em van ensenyar a construir per a restriccions i persones reals. L’acadèmia em va ensenyar a formular preguntes més pausades. Intento mantenir tots dos hàbits —i entendre la tecnologia com una forma de servei.'],
      ['<h3>Formation</h3>', '<h3>Formació</h3>'],
      ['Ph.D. in Information and Communication Technologies', 'Doctorat en Tecnologies de la Informació i la Comunicació'],
      ['Deep Learning Specialization &amp; DS4A', 'Deep Learning Specialization i DS4A'],
      ['M.A. in Multimedia Creation &amp; Serious Games', 'Màster en Creació Multimèdia i Serious Games'],
      ['Fundación Carolina scholarship', 'Beca de la Fundación Carolina'],
      ['B.Sc. in Systems Engineering', 'Grau en Enginyeria de Sistemes'],
      ['<h3>Practice</h3>', '<h3>Àrees de pràctica</h3>'],
      ['<p>Technical</p>', '<p>Tècnica</p>'],
      ['<span>Data Science</span>', '<span>Ciència de dades</span>'],
      ['<span>Machine Learning</span>', '<span>Aprenentatge automàtic</span>'],
      ['<span>AWS &amp; Azure</span>', '<span>AWS i Azure</span>'],
      ['<span>Data Pipelines</span>', '<span>Pipelines de dades</span>'],
      ['<span>Visualization</span>', '<span>Visualització</span>'],
      ['<span>Software Engineering</span>', '<span>Enginyeria del programari</span>'],
      ['<p>Teaching &amp; research</p>', '<p>Docència i recerca</p>'],
      ['<span>Teaching</span>', '<span>Docència</span>'],
      ['<span>Research</span>', '<span>Recerca</span>'],
      ['<span>UX Evaluation</span>', '<span>Avaluació UX</span>'],
      ['<span>Facilitation</span>', '<span>Facilitació</span>'],
      ['<p>Languages</p>', '<p>Idiomes</p>'],
      ['<span>Spanish · Native</span>', '<span>Castellà · Nadiu</span>'],
      ['<span>English · C1</span>', '<span>Anglès · C1</span>'],
      ['<span>Catalan · B1</span>', '<span>Català · B1</span>'],
      ['<p class="section-kicker">Selected recognition</p>', '<p class="section-kicker">Reconeixements destacats</p>'],
      ['<strong>1st Place</strong><span>Ecopetrol Innovate 2019 · Computer Vision</span>', '<strong>Primer lloc</strong><span>Ecopetrol Innovate 2019 · Visió per computador</span>'],
      ['<strong>Top 5 Project</strong><span>Data Science for All 2020 · 92 teams</span>', '<strong>Projecte entre els 5 millors</strong><span>Data Science for All 2020 · 92 equips</span>'],
      ['<strong>PlaCLIK Grant</strong><span>Gamification-based programming pedagogy</span>', '<strong>Beca PlaCLIK</strong><span>Pedagogia de la programació basada en ludificació</span>'],
      ['<strong>Teaching nomination</strong>', '<strong>Nominació docent</strong>'],
      ['<p class="section-kicker">04 / Teaching</p>', '<p class="section-kicker">04 / Docència</p>'],
      ['Teaching &amp; community', 'Docència i comunitat'],
      ['I have taught in universities, online courses, and open workshops. My classes often use games and practical challenges to make algorithms and machine learning easier to enter without simplifying the subject.', 'He ensenyat en universitats, cursos en línia i tallers oberts. A les meves classes acostumo a utilitzar jocs i reptes pràctics per facilitar l’entrada als algoritmes i a l’aprenentatge automàtic sense simplificar la matèria.'],
      ['<h3>Guest Professor</h3>', '<h3>Professor convidat</h3>'],
      ['Design and prototyping of ML and neural networks', 'Disseny i prototipatge de ML i xarxes neuronals'],
      ['<h3>Instructor</h3>', '<h3>Docent</h3>'],
      ['Data Structures and Algorithms for ICT programs', 'Estructures de dades i algoritmes per a programes de TIC'],
      ['Associate Professor &amp; Researcher', 'Professor associat i investigador'],
      ['Algorithms, UX, and Systems Engineering curriculum redesign', 'Algoritmes, UX i redisseny curricular d’Enginyeria de Sistemes'],
      ['<span>Online</span>', '<span>En línia</span>'],
      ['Machine Learning with Scikit-learn', 'Aprenentatge automàtic amb Scikit-learn'],
      ['<p class="section-kicker">Community initiatives</p>', '<p class="section-kicker">Iniciatives comunitàries</p>'],
      ['A free weekly space for conversations about AI, machine learning, and data science across Latin America.', 'Un espai setmanal i gratuït per conversar sobre intel·ligència artificial, aprenentatge automàtic i ciència de dades a l’Amèrica Llatina.'],
      ['Engega’t — Gamified Job Insertion', 'Engega’t — Inserció laboral ludificada'],
      ['Gamification design for a municipal job-insertion program for young people in Catalonia.', 'Disseny de ludificació per a un programa municipal d’inserció laboral adreçat a joves de Catalunya.'],
      ['>Press <span', '>Premsa <span'],
      ['A Latin American space for open and alternative theological conversation.', 'Un espai llatinoamericà per a una conversa teològica oberta i alternativa.'],
      ['>Visit <span', '>Visita <span'],
      ['<p class="section-kicker">05 / Contact</p>', '<p class="section-kicker">05 / Contacte</p>'],
      ['<h2>Get in touch</h2>', '<h2>Parlem</h2>'],
      ['If you are working on learning analytics, education, technology that serves people, or a problem that crosses disciplines, I would be glad to hear from you.', 'Si treballes en analítica de l’aprenentatge, educació, tecnologia al servei de les persones o en un problema que travessa disciplines, estaré encantat de conèixer-te.'],
      ['<span>Email</span><strong>', '<span>Correu electrònic</span><strong>'],
      ['Barcelona · Open to in-person and remote collaboration', 'Barcelona · Disponible per a col·laboracions presencials i remotes'],
      ['Built with curiosity and a few living algorithms.', 'Fet amb curiositat i uns quants algoritmes vius.'],
    ],
  },
};

function replaceRequired(source, from, to, locale) {
  if (!source.includes(from)) {
    throw new Error(`[${locale}] Missing required template text: ${from}`);
  }

  return source.replaceAll(from, to);
}

function localizeMetadata(source, locale, config) {
  let result = source;
  const absoluteUrl = `https://portfolio.ludthor.es${config.route}`;

  result = replaceRequired(result, '<html lang="en">', `<html lang="${config.htmlLang}">`, locale);
  result = replaceRequired(result, '<title>Ariel Ortiz Beltrán — Researcher, Engineer &amp; Educator</title>', `<title>${config.title.replace('&', '&amp;')}</title>`, locale);
  result = replaceRequired(result, '<meta name="description" content="Researcher in institutional analytics and learning design, with experience in data architecture, machine learning, and higher education.">', `<meta name="description" content="${config.description}">`, locale);
  result = replaceRequired(result, '<link rel="canonical" href="https://portfolio.ludthor.es/">', `<link rel="canonical" href="${absoluteUrl}">`, locale);
  result = replaceRequired(result, '<meta property="og:title" content="Ariel Ortiz Beltrán — Portfolio">', `<meta property="og:title" content="${config.ogTitle}">`, locale);
  result = replaceRequired(result, '<meta property="og:description" content="Make sense of data. Care for what makes us human.">', `<meta property="og:description" content="${config.ogDescription}">`, locale);
  result = replaceRequired(result, '<meta property="og:url" content="https://portfolio.ludthor.es/">', `<meta property="og:url" content="${absoluteUrl}">`, locale);
  result = replaceRequired(
    result,
    '  <meta property="og:locale" content="en_US">\n  <meta property="og:locale:alternate" content="es_ES">\n  <meta property="og:locale:alternate" content="ca_ES">',
    `  <meta property="og:locale" content="${config.ogLocale}">\n  <meta property="og:locale:alternate" content="${config.ogAlternates[0]}">\n  <meta property="og:locale:alternate" content="${config.ogAlternates[1]}">`,
    locale,
  );

  return result;
}

function localizeLanguageSwitcher(source, locale) {
  let result = source;
  const currentMarker = ' aria-current="page"';
  const linkPattern = (language) => new RegExp(`(<a href="[^"]+" class="language-link" data-language-link data-base-path="[^"]+" hreflang="${language}" lang="${language}" aria-label="[^"]+")${language === 'en' ? currentMarker : ''}(>)`);

  result = result.replace(linkPattern('en'), '$1>');
  result = result.replace(linkPattern(locale), `$1${currentMarker}>`);

  if (!result.includes(`hreflang="${locale}" lang="${locale}"`) || !result.includes(`hreflang="${locale}" lang="${locale}" aria-label=`)) {
    throw new Error(`[${locale}] Language switcher could not be localized.`);
  }

  return result;
}

function addPublicationLanguageMarkers(source, locale) {
  let result = source;

  for (const title of englishPublicationTitles) {
    result = replaceRequired(
      result,
      `<span class="pub-title">${title}</span>`,
      `<span class="pub-title" lang="en">${title}</span>`,
      locale,
    );
  }

  return result;
}

async function build() {
  const template = await readFile(templatePath, 'utf8');

  for (const [locale, config] of Object.entries(locales)) {
    let output = localizeMetadata(template, locale, config);
    output = localizeLanguageSwitcher(output, locale);
    output = addPublicationLanguageMarkers(output, locale);

    for (const [from, to] of config.replacements) {
      output = replaceRequired(output, from, to, locale);
    }

    output = replaceRequired(output, 'href="css/style.css?v=i18n-20260901-5"', 'href="/css/style.css?v=i18n-20260901-5"', locale);
    output = replaceRequired(output, 'src="js/alife/loader.js?v=i18n-20260901-5"', 'src="/js/alife/loader.js?v=i18n-20260901-5"', locale);
    output = replaceRequired(output, 'src="js/main.js?v=i18n-20260901-5"', 'src="/js/main.js?v=i18n-20260901-5"', locale);

    const outputDirectory = join(sourceDirectory, locale);
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(join(outputDirectory, 'index.html'), output);
  }
}

await build();
