
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#09090f" />
  <meta name="description" content="Documentation for a modern Gemini AI Clone built with React, Vite, and the Google GenAI SDK." />
  <title>Gemini Clone — Project Documentation</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <style>
    :root {
      --bg: #09090f;
      --surface: rgba(255, 255, 255, 0.045);
      --surface-hover: rgba(255, 255, 255, 0.075);
      --border: rgba(255, 255, 255, 0.1);
      --text: #f5f5fa;
      --muted: #9696aa;
      --purple: #a78bfa;
      --blue: #7dd3fc;
      --pink: #f0abfc;
      --green: #86efac;
      --radius: 20px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
      scroll-padding-top: 100px;
    }

    body {
      background:
        radial-gradient(ellipse at 15% 0%, rgba(124, 58, 237, 0.16), transparent 35%),
        radial-gradient(ellipse at 90% 25%, rgba(14, 165, 233, 0.1), transparent 30%),
        var(--bg);
      color: var(--text);
      font-family: "DM Sans", sans-serif;
      line-height: 1.7;
      overflow-x: hidden;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font: inherit;
    }

    .container {
      width: min(1100px, calc(100% - 40px));
      margin-inline: auto;
    }

    .navbar {
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(9, 9, 15, 0.78);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid var(--border);
    }

    .nav-inner {
      min-height: 76px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: "Space Grotesk", sans-serif;
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.7px;
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 13px;
      color: white;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      box-shadow: 0 0 28px rgba(139, 92, 246, 0.3);
      font-size: 20px;
    }

    .brand span span {
      color: var(--purple);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 26px;
      color: var(--muted);
      font-size: 13px;
    }

    .nav-links a:hover {
      color: white;
    }

    .nav-github {
      padding: 9px 15px;
      border: 1px solid var(--border);
      border-radius: 999px;
      color: var(--text);
    }

    .hero {
      position: relative;
      padding: 112px 0 90px;
      text-align: center;
    }

    .orb {
      position: absolute;
      width: 250px;
      height: 250px;
      left: 50%;
      top: 70px;
      transform: translateX(-50%);
      background: #8b5cf6;
      filter: blur(130px);
      opacity: 0.17;
      pointer-events: none;
    }

    .eyebrow {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 7px 13px;
      border: 1px solid rgba(167, 139, 250, 0.25);
      border-radius: 999px;
      color: #d2c4ff;
      background: rgba(139, 92, 246, 0.08);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.7px;
      text-transform: uppercase;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      background: var(--green);
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(134, 239, 172, 0.7);
    }

    h1, h2, h3 {
      font-family: "Space Grotesk", sans-serif;
      line-height: 1.2;
      letter-spacing: -1px;
    }

    h1 {
      position: relative;
      margin: 28px auto 20px;
      max-width: 850px;
      font-size: clamp(43px, 8vw, 82px);
      font-weight: 600;
      letter-spacing: -4px;
    }

    .gradient-text {
      color: transparent;
      background: linear-gradient(100deg, #c4b5fd 10%, #7dd3fc 50%, #f0abfc 90%);
      background-clip: text;
      -webkit-background-clip: text;
    }

    .hero-description {
      max-width: 610px;
      margin: 0 auto;
      color: var(--muted);
      font-size: 17px;
      line-height: 1.9;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 34px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 12px 20px;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      transition: transform 0.2s, background 0.2s;
      cursor: pointer;
    }

    .button:hover {
      transform: translateY(-2px);
    }

    .button-primary {
      color: #10101a;
      background: linear-gradient(110deg, #c4b5fd, #7dd3fc);
      border: none;
    }

    .button-secondary {
      background: rgba(255, 255, 255, 0.04);
    }

    .tech-strip {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 45px;
    }

    .tech-pill {
      padding: 7px 12px;
      border: 1px solid var(--border);
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.025);
      color: #c5c5d4;
      font-family: "DM Mono", monospace;
      font-size: 11px;
    }

    .section {
      padding: 70px 0;
    }

    .section-heading {
      margin-bottom: 30px;
    }

    .section-label {
      margin-bottom: 10px;
      color: var(--purple);
      font-family: "DM Mono", monospace;
      font-size: 11px;
      letter-spacing: 1.8px;
      text-transform: uppercase;
    }

    h2 {
      margin-bottom: 12px;
      font-size: clamp(29px, 4vw, 42px);
      font-weight: 500;
      letter-spacing: -1.7px;
    }

    .section-description {
      max-width: 650px;
      color: var(--muted);
      font-size: 15px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .card {
      padding: 24px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      transition: border-color 0.2s, background 0.2s, transform 0.2s;
    }

    .card:hover {
      background: var(--surface-hover);
      border-color: rgba(167, 139, 250, 0.32);
      transform: translateY(-3px);
    }

    .feature-icon {
      width: 43px;
      height: 43px;
      display: grid;
      place-items: center;
      margin-bottom: 19px;
      border: 1px solid rgba(167, 139, 250, 0.2);
      border-radius: 13px;
      background: rgba(139, 92, 246, 0.11);
      font-size: 20px;
    }

    .card h3 {
      margin-bottom: 9px;
      font-size: 17px;
      font-weight: 600;
      letter-spacing: -0.4px;
    }

    .card p {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.85;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .tech-card {
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: 15px;
      background: var(--surface);
    }

    .tech-card strong {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
      font-weight: 600;
    }

    .tech-card span {
      color: var(--muted);
      font-size: 12px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      align-items: stretch;
    }

    .panel {
      min-width: 0;
      padding: 27px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
    }

    .panel h3 {
      margin-bottom: 17px;
      font-size: 19px;
      letter-spacing: -0.5px;
    }

    .panel > p {
      margin-bottom: 15px;
      color: var(--muted);
      font-size: 13px;
    }

    .code-block {
      position: relative;
      overflow: hidden;
      margin-top: 14px;
      border: 1px solid var(--border);
      border-radius: 13px;
      background: #08080d;
    }

    .code-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 11px 14px;
      border-bottom: 1px solid var(--border);
      color: var(--muted);
      font-family: "DM Mono", monospace;
      font-size: 10px;
    }

    .window-dots {
      display: flex;
      gap: 5px;
    }

    .window-dots span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #50505f;
    }

    pre {
      padding: 18px;
      overflow-x: auto;
      color: #d8d8e6;
      font-family: "DM Mono", monospace;
      font-size: 12px;
      line-height: 1.9;
      white-space: pre;
    }

    .code-key {
      color: #c4b5fd;
    }

    .code-string {
      color: #86efac;
    }

    .code-comment {
      color: #818198;
    }

    .inline-code {
      padding: 3px 7px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: #c4b5fd;
      font-family: "DM Mono", monospace;
      font-size: 12px;
    }

    .step-list {
      display: grid;
      gap: 15px;
      margin-top: 20px;
    }

    .step {
      display: flex;
      gap: 13px;
      align-items: flex-start;
    }

    .step-number {
      flex-shrink: 0;
      width: 29px;
      height: 29px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(167, 139, 250, 0.25);
      border-radius: 9px;
      background: rgba(139, 92, 246, 0.1);
      color: #c4b5fd;
      font-family: "DM Mono", monospace;
      font-size: 11px;
    }

    .step strong {
      display: block;
      margin-bottom: 3px;
      font-size: 13px;
    }

    .step p {
      color: var(--muted);
      font-size: 12px;
    }

    .resource-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .resource {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 17px;
      border: 1px solid var(--border);
      border-radius: 13px;
      background: var(--surface);
      transition: background 0.2s, border-color 0.2s;
    }

    .resource:hover {
      background: var(--surface-hover);
      border-color: rgba(125, 211, 252, 0.3);
    }

    .resource span {
      font-size: 13px;
      font-weight: 500;
    }

    .resource small {
      display: block;
      margin-top: 3px;
      color: var(--muted);
      font-size: 11px;
    }

    .resource-arrow {
      color: var(--blue);
      font-size: 17px;
    }

    .notice {
      padding: 20px 22px;
      border: 1px solid rgba(251, 191, 36, 0.2);
      border-radius: 14px;
      background: rgba(251, 191, 36, 0.045);
      color: #e5d5a4;
      font-size: 13px;
      line-height: 1.9;
    }

    .notice strong {
      color: #fde68a;
    }

    .structure {
      color: #c5c5d4;
      font-family: "DM Mono", monospace;
      font-size: 12px;
      line-height: 2.1;
    }

    .structure .folder {
      color: #c4b5fd;
    }

    .structure .note {
      color: #77778e;
    }

    .footer {
      margin-top: 50px;
      padding: 32px 0;
      border-top: 1px solid var(--border);
      color: var(--muted);
      font-size: 12px;
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
    }

    .footer-brand {
      color: var(--text);
      font-family: "Space Grotesk", sans-serif;
      font-weight: 600;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
    }

    .footer-links a:hover {
      color: white;
    }

    @media (max-width: 850px) {
      .feature-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .tech-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .resource-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 560px) {
      .container {
        width: min(100% - 28px, 1100px);
      }

      .nav-inner {
        min-height: 65px;
      }

      .nav-links {
        gap: 13px;
      }

      .nav-links a:nth-child(1),
      .nav-links a:nth-child(2) {
        display: none;
      }

      .brand {
        font-size: 16px;
      }

      .brand-icon {
        width: 33px;
        height: 33px;
      }

      .hero {
        padding: 80px 0 60px;
      }

      h1 {
        letter-spacing: -2.5px;
      }

      .hero-description {
        font-size: 14px;
      }

      .section {
        padding: 48px 0;
      }

      .feature-grid,
      .tech-grid,
      .resource-grid {
        grid-template-columns: 1fr;
      }

      .card,
      .panel {
        padding: 21px;
      }

      .footer-inner {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>

<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a class="brand" href="#home" aria-label="Gemini Clone home">
        <span class="brand-icon">✳</span>
        <span>gemini<span>.clone</span></span>
      </a>

      <nav class="nav-links" aria-label="Main navigation">
        <a href="#features">Features</a>
        <a href="#stack">Tech stack</a>
        <a href="#setup">Setup</a>
        <a class="nav-github" href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      </nav>
    </div>
  </header>

  <main id="home">
    <section class="hero">
      <div class="orb"></div>

      <div class="container">
        <div class="eyebrow">
          <span class="status-dot"></span>
          Personal AI project · Documentation
        </div>

        <h1>
          Intelligence,<br />
          <span class="gradient-text">beautifully built.</span>
        </h1>

        <p class="hero-description">
          A modern AI chat experience inspired by Google Gemini.
          Built with React, powered by Google's generative AI, and
          designed to make every conversation feel effortless.
        </p>

        <div class="hero-actions">
          <a class="button button-primary" href="#setup">Get started <span>↗</span></a>
          <a class="button button-secondary" href="#features">Explore features ↓</a>
        </div>

        <div class="tech-strip">
          <span class="tech-pill">React</span>
          <span class="tech-pill">Vite</span>
          <span class="tech-pill">JavaScript</span>
          <span class="tech-pill">Google GenAI</span>
          <span class="tech-pill">CSS</span>
        </div>
      </div>
    </section>

    <section class="section" id="features">
      <div class="container">
        <div class="section-heading">
          <p class="section-label">01 / Capabilities</p>
          <h2>More than a chat box.</h2>
          <p class="section-description">
            A collection of AI-powered features wrapped in a clean,
            responsive interface.
          </p>
        </div>

        <div class="feature-grid">
          <article class="card">
            <div class="feature-icon">✳</div>
            <h3>AI conversations</h3>
            <p>Ask questions, explore ideas, explain concepts, and generate useful responses with a supported Google AI model.</p>
          </article>

          <article class="card">
            <div class="feature-icon">◉</div>
            <h3>Image understanding</h3>
            <p>Select an image, preview it before sending, and ask questions about its contents when image input is configured.</p>
          </article>

          <article class="card">
            <div class="feature-icon">⌁</div>
            <h3>Streaming responses</h3>
            <p>Show generated response content progressively when streaming is supported by the configured API integration.</p>
          </article>

          <article class="card">
            <div class="feature-icon">▤</div>
            <h3>Chat history</h3>
            <p>Keep conversations accessible in the browser using local storage, if persistence is enabled in the application.</p>
          </article>

          <article class="card">
            <div class="feature-icon">⌘</div>
            <h3>Markdown rendering</h3>
            <p>Format assistant responses with headings, lists, links, and code blocks using the Marked library.</p>
          </article>

          <article class="card">
            <div class="feature-icon">↗</div>
            <h3>Responsive design</h3>
            <p>Enjoy a flexible layout with rounded components, readable typography, and mobile-friendly styling.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="stack">
      <div class="container">
        <div class="section-heading">
          <p class="section-label">02 / Technology</p>
          <h2>The stack behind the magic.</h2>
          <p class="section-description">
            Familiar frontend tools meet generative AI to create the experience.
          </p>
        </div>

        <div class="tech-grid">
          <div class="tech-card"><strong>React</strong><span>UI components and state</span></div>
          <div class="tech-card"><strong>Vite</strong><span>Development and builds</span></div>
          <div class="tech-card"><strong>JavaScript</strong><span>Application logic</span></div>
          <div class="tech-card"><strong>CSS3</strong><span>Layout and visual design</span></div>
          <div class="tech-card"><strong>Google GenAI</strong><span>AI SDK and model requests</span></div>
          <div class="tech-card"><strong>Marked</strong><span>Markdown rendering</span></div>
          <div class="tech-card"><strong>File API</strong><span>Image selection and previews</span></div>
          <div class="tech-card"><strong>Local Storage</strong><span>Browser-side persistence</span></div>
        </div>
      </div>
    </section>

    <section class="section" id="setup">
      <div class="container">
        <div class="section-heading">
          <p class="section-label">03 / Quick start</p>
          <h2>From zero to running.</h2>
          <p class="section-description">
            Set up your local environment in a few simple steps.
          </p>
        </div>

        <div class="content-grid">
          <article class="panel">
            <h3>Installation</h3>
            <p>Make sure Node.js and npm are installed before starting.</p>

            <div class="code-block">
              <div class="code-top">
                <span>TERMINAL</span>
                <span class="window-dots"><span></span><span></span><span></span></span>
              </div>
              <pre><span class="code-comment"># Install dependencies</span>
npm install

<span class="code-comment"># Add the Google GenAI SDK</span>
npm install @google/genai

<span class="code-comment"># Start the dev server</span>
npm run dev

<span class="code-comment"># Create a production build</span>
npm run build</pre>
            </div>

            <div class="step-list">
              <div class="step">
                <span class="step-number">01</span>
                <div>
                  <strong>Get an API key</strong>
                  <p>Create a key through Google AI Studio.</p>
                </div>
              </div>

              <div class="step">
                <span class="step-number">02</span>
                <div>
                  <strong>Configure your environment</strong>
                  <p>Add the key to a local <span class="inline-code">.env</span> file.</p>
                </div>
              </div>

              <div class="step">
                <span class="step-number">03</span>
                <div>
                  <strong>Launch the application</strong>
                  <p>Open the local URL shown by Vite.</p>
                </div>
              </div>
            </div>
          </article>

          <article class="panel">
            <h3>Environment variables</h3>
            <p>Create a <span class="inline-code">.env</span> file in the project root.</p>

            <div class="code-block">
              <div class="code-top">
                <span>.env</span>
                <span class="code-string">LOCAL CONFIG</span>
              </div>
              <pre>VITE_GEMINI_API_KEY=your_api_key_here</pre>
            </div>

            <div style="height: 20px;"></div>

            <div class="notice">
              <strong>Keep your API key safe.</strong><br />
              Vite variables prefixed with <span class="inline-code">VITE_</span>
              are bundled into client-side code. This setup is convenient
              for local learning, but production applications should make
              AI requests through a backend that protects the key.
            </div>

            <div style="height: 24px;"></div>

            <h3>Useful commands</h3>
            <div class="code-block">
              <div class="code-top"><span>PACKAGE SCRIPTS</span></div>
              <pre>npm run dev
npm run build
npm run preview</pre>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="project-structure">
      <div class="container">
        <div class="section-heading">
          <p class="section-label">04 / Architecture</p>
          <h2>Everything in its place.</h2>
          <p class="section-description">
            An example structure for organizing the React application.
            Adjust it to match your actual repository.
          </p>
        </div>

        <div class="panel">
          <pre class="structure"><span class="folder">gemini-clone/</span>
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── Main/
│   │       ├── Main.jsx
│   │       └── main.css
│   ├── context/
│   │   └── ContextApi.jsx
│   ├── config/
│   │   └── gemini.js
│   ├── App.jsx
│   └── main.jsx
├── <span class="folder">.env</span> <span class="note"># Local API configuration</span>
├── .gitignore
├── index.html
├── package.json
└── README.html</pre>
        </div>
      </div>
    </section>

    <section class="section" id="resources">
      <div class="container">
        <div class="section-heading">
          <p class="section-label">05 / Developer resources</p>
          <h2>Learn from the source.</h2>
          <p class="section-description">
            Documentation for the APIs and libraries used in this project.
          </p>
        </div>

        <div class="resource-grid">
          <a class="resource" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
            <span>Google AI Studio<small>API key management</small></span>
            <span class="resource-arrow">↗</span>
          </a>

          <a class="resource" href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noopener noreferrer">
            <span>Gemini API<small>Models and API guides</small></span>
            <span class="resource-arrow">↗</span>
          </a>

          <a class="resource" href="https://www.npmjs.com/package/@google/genai" target="_blank" rel="noopener noreferrer">
            <span>Google GenAI SDK<small>Package documentation</small></span>
            <span class="resource-arrow">↗</span>
          </a>

          <a class="resource" href="https://react.dev/" target="_blank" rel="noopener noreferrer">
            <span>React<small>UI development</small></span>
            <span class="resource-arrow">↗</span>
          </a>

          <a class="resource" href="https://vite.dev/" target="_blank" rel="noopener noreferrer">
            <span>Vite<small>Build tooling</small></span>
            <span class="resource-arrow">↗</span>
          </a>

          <a class="resource" href="https://marked.js.org/" target="_blank" rel="noopener noreferrer">
            <span>Marked<small>Markdown parser</small></span>
            <span class="resource-arrow">↗</span>
          </a>

          <a class="resource" href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">
            <span>Google Fonts<small>Web typography</small></span>
            <span class="resource-arrow">↗</span>
          </a>

          <a class="resource" href="https://developer.mozilla.org/en-US/docs/Web/API/File_API" target="_blank" rel="noopener noreferrer">
            <span>Browser File API<small>File and image handling</small></span>
            <span class="resource-arrow">↗</span>
          </a>

          <a class="resource" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank" rel="noopener noreferrer">
            <span>Local Storage<small>Browser persistence</small></span>
            <span class="resource-arrow">↗</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section" id="security">
      <div class="container">
        <div class="section-heading">
          <p class="section-label">06 / Important notes</p>
          <h2>Built to learn. Ready to evolve.</h2>
        </div>

        <div class="notice">
          <strong>API access:</strong> Model availability, image support,
          streaming, quotas, and permissions depend on your Google AI project
          and the API method you configure.<br />

          <strong>Chat history:</strong> Browser local storage is local to the
          browser profile and is not a replacement for secure server-side storage.<br />

          <strong>Markdown safety:</strong> If rendering AI-generated Markdown
          as HTML, sanitize generated HTML before displaying untrusted content.<br />

          <strong>Project identity:</strong> This is an independent learning
          project inspired by Gemini. It is not an official Google product.
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <div class="footer-brand">✳ gemini.clone</div>
        <p style="margin-top: 5px;">Made with curiosity and a little bit of AI.</p>
      </div>

      <div class="footer-links">
        <a href="#features">Features</a>
        <a href="#stack">Tech stack</a>
        <a href="#setup">Setup</a>
        <a href="#resources">Resources</a>
      </div>

      <p>Independent project · Built for learning</p>
    </div>
  </footer>
</body>
</html>
