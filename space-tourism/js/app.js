// utilitare mici
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const app = $("#app");
const body = document.body;

let DATA = null;

// ---- routing ----
function currentRoute() {
  const h = location.hash.replace(/^#\/?/, "").toLowerCase();
  return h || "home";
}
function setActiveNav(route) {
  $$("#mainnav a").forEach((a) =>
    a.classList.toggle("active", a.dataset.route === route)
  );
}
function setBackground(route) {
  body.classList.remove(
    "bg-home",
    "bg-destination",
    "bg-crew",
    "bg-technology"
  );
  body.classList.add(
    {
      home: "bg-home",
      destination: "bg-destination",
      crew: "bg-crew",
      technology: "bg-technology",
    }[route] || "bg-home"
  );
}

// ---- views ----
function renderHome() {
  app.innerHTML = `
    <section class="home grid">
      <div class="home-text">
        <p class="eyebrow">SO, YOU WANT TO TRAVEL TO</p>
        <h1 class="headline">SPACE</h1>
        <p class="lead">Let's face it; if you want to go to space, you might as well genuinely go to outer space and not hover kind of on the edge of it. Well sit back, and relax because we'll give you a truly out of this world experience!</p>
      </div>
      <div class="home-cta">
        <a class="explore" href="#/destination" aria-label="Explore destinations">EXPLORE</a>
      </div>
    </section>
  `;
}

function renderDestination(i = 0) {
  const list = DATA.destinations;
  const item = list[i];

  app.innerHTML = `
    <section class="page page-destination">
      <h2 class="kicker"><b>01</b> PICK YOUR DESTINATION</h2>

      <div class="grid destination-grid">
        <picture class="destination-image">
          <source type="image/webp" srcset="${item.images.webp}">
          <img src="${item.images.png}" alt="${item.name}">
        </picture>

        <div class="destination-content">
          <div class="tabs" role="tablist" aria-label="Destinations">
            ${list
              .map(
                (d, idx) => `
              <button role="tab"
                class="tab ${idx === i ? "is-active" : ""}"
                aria-selected="${idx === i}"
                data-type="dest-tab" data-index="${idx}">
                ${d.name}
              </button>
            `
              )
              .join("")}
          </div>

          <h3 class="destination-name">${item.name}</h3>
          <p class="destination-desc">${item.description}</p>

          <div class="stats">
            <div>
              <p class="label">AVG. DISTANCE</p>
              <p class="value">${item.distance}</p>
            </div>
            <div>
              <p class="label">EST. TRAVEL TIME</p>
              <p class="value">${item.travel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCrew(i = 0) {
  const list = DATA.crew;
  const item = list[i];

  app.innerHTML = `
    <section class="page page-crew">
      <h2 class="kicker"><b>02</b> MEET YOUR CREW</h2>

      <div class="grid crew-grid">
        <div class="crew-text">
          <p class="crew-role">${item.role}</p>
          <h3 class="crew-name">${item.name}</h3>
          <p class="crew-bio">${item.bio}</p>

          <div class="dots" role="tablist" aria-label="Crew">
            ${list
              .map(
                (_, idx) => `
              <button role="tab" aria-label="Crew ${idx + 1}"
                class="dot ${idx === i ? "is-active" : ""}"
                aria-selected="${idx === i}"
                data-type="crew-dot" data-index="${idx}"></button>
            `
              )
              .join("")}
          </div>
        </div>

        <picture class="crew-image">
          <source type="image/webp" srcset="${item.images.webp}">
          <img src="${item.images.png}" alt="${item.name}">
        </picture>
      </div>
    </section>
  `;
}

function renderTechnology(i = 0) {
  const list = DATA.technology;
  const item = list[i];

  app.innerHTML = `
    <section class="page page-technology">
      <h2 class="kicker"><b>03</b> SPACE LAUNCH 101</h2>

      <div class="grid tech-grid">
        <div class="tech-nums" role="tablist" aria-label="Technologies">
          ${list
            .map(
              (_, idx) => `
            <button role="tab"
              class="num ${idx === i ? "is-active" : ""}"
              aria-selected="${idx === i}"
              data-type="tech-num" data-index="${idx}">
              ${idx + 1}
            </button>
          `
            )
            .join("")}
        </div>

        <div class="tech-text">
          <p class="sub">THE TERMINOLOGY…</p>
          <h3 class="tech-name">${item.name}</h3>
          <p class="tech-desc">${item.description}</p>
        </div>

        <picture class="tech-image">
          <source media="(min-width:1024px)" srcset="${item.images.portrait}">
          <img src="${item.images.landscape}" alt="${item.name}">
        </picture>
      </div>
    </section>
  `;
}

// delegare pentru taburi
app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-type]");
  if (!el) return;
  const idx = +el.dataset.index;
  if (el.dataset.type === "dest-tab") renderDestination(idx);
  if (el.dataset.type === "crew-dot") renderCrew(idx);
  if (el.dataset.type === "tech-num") renderTechnology(idx);
});

// nav + router
function renderRoute(route) {
  setActiveNav(route);
  setBackground(route);

  if (route === "home") return renderHome();
  if (route === "destination") return renderDestination(0);
  if (route === "crew") return renderCrew(0);
  if (route === "technology") return renderTechnology(0);

  app.innerHTML = `<section class="page"><h2>Not found</h2></section>`;
}
function onRouteChange() {
  renderRoute(currentRoute());
  app.focus({ preventScroll: true });
}

// init
async function init() {
  try {
    const res = await fetch("./data/data.json", { cache: "no-store" });
    DATA = await res.json();
  } catch (err) {
    console.error("Eroare data.json", err);
    app.innerHTML = `<p style="padding:2rem">Nu am putut încărca <code>./data/data.json</code>. Verifică calea.</p>`;
    return;
  }

  // burger
  const burger = $(".hamburger");
  const nav = $("#mainnav");
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });

  window.addEventListener("hashchange", onRouteChange);
  onRouteChange();
}
document.addEventListener("DOMContentLoaded", init);
