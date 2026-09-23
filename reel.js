const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const thesis = document.querySelector(".thesis");
const thesisGrid = document.querySelector(".thesis-grid");

document.querySelector(".cue")?.addEventListener("click", () => {
  const target = reduced
    ? document.querySelector(".reel-static")
    : document.getElementById("highlights");
  target?.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
  });
});

if (!reduced && thesis && thesisGrid) {
  let frame = 0;
  const updateThesis = () => {
    const rect = thesis.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    thesisGrid.style.transform = `translate3d(0, ${progress * -36}px, 0)`;
    thesisGrid.style.opacity = String(1 - progress * 0.65);
  };
  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(updateThesis);
  };
  updateThesis();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const section = document.querySelector(".reel");

if (!reduced && section) {
  const track = section.querySelector(".track");
  const words = [...section.querySelectorAll(".word")];
  const lefts = [...section.querySelectorAll(".side-left .panel")];
  const rights = [...section.querySelectorAll(".side-right .panel")];
  const links = [...section.querySelectorAll(".dock .more")];
  const thumb = section.querySelector(".rail span");
  const navLinks = [...document.querySelectorAll(".nav a")];
  const count = words.length;
  let frame = 0;

  const update = () => {
    const rect = section.getBoundingClientRect();
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const scrolled = Math.min(Math.max(-rect.top, 0), travel);
    const progress = (scrolled / travel) * (count - 1);
    const step = words[0]?.offsetHeight || 112;

    if (track) {
      track.style.transform = `translate3d(0, ${-(progress * step + step / 2)}px, 0)`;
    }

    const activeIndex = Math.min(count - 1, Math.max(0, Math.round(progress)));

    for (let index = 0; index < count; index += 1) {
      const delta = index - progress;
      const distance = Math.abs(delta);
      const word = words[index];

      if (word) {
        word.style.opacity = String(Math.exp(-distance * distance * 1.35));
      }

      const fade = Math.max(0, Math.min(1, 1 - distance));
      const panelTransform = `translate3d(0, ${delta * 20}px, 0)`;
      const hidden = fade < 0.45;

      for (const panel of [lefts[index], rights[index]]) {
        if (!panel) continue;
        panel.style.opacity = String(fade);
        panel.style.transform = panelTransform;
        panel.setAttribute("aria-hidden", hidden ? "true" : "false");
      }

      const link = links[index];
      if (link) {
        const interactive = fade > 0.62;
        link.style.opacity = String(fade);
        link.style.pointerEvents = interactive ? "auto" : "none";
        link.tabIndex = interactive ? 0 : -1;
        link.setAttribute("aria-hidden", interactive ? "false" : "true");
        link.style.zIndex = String(Math.round(fade * 10));
      }
    }

    const inView =
      rect.top < window.innerHeight * 0.55 && rect.bottom > window.innerHeight * 0.45;
    const slug = inView ? navLinks[activeIndex]?.dataset.slug : null;
    navLinks.forEach((anchor) => {
      anchor.classList.toggle("is-active", Boolean(slug) && anchor.dataset.slug === slug);
    });

    if (thumb) {
      const along = progress / (count - 1);
      const rail = thumb.parentElement;
      const span = Math.max((rail?.clientHeight ?? 132) - thumb.offsetHeight, 0);
      thumb.style.transform = `translate3d(0, ${along * span}px, 0)`;
    }
  };

  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}
