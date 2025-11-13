document.addEventListener("DOMContentLoaded", () => {
  stampYear();
  initGooeyText();
  initProjectModal();
  initSecretTrigger();
});

function stampYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initGooeyText() {
  const container = document.getElementById("gooey-text");
  if (!container) return;

  const rawTexts = container.dataset.texts;
  let texts = [];

  try {
    texts = JSON.parse(rawTexts);
  } catch {
    texts = rawTexts ? rawTexts.split(",") : [];
  }

  if (texts.length < 2) return;

  const morphTime = parseFloat(container.dataset.morphTime) || 1;
  const cooldownTime = parseFloat(container.dataset.cooldown) || 0.25;
  const [text1, text2] = container.querySelectorAll(".gooey-text-layer");

  if (!text1 || !text2) return;

  let textIndex = texts.length - 1;
  let time = new Date();
  let morph = 0;
  let cooldown = cooldownTime;

  text1.textContent = texts[textIndex % texts.length];
  text2.textContent = texts[(textIndex + 1) % texts.length];

  function setMorph(fraction) {
    const safeFraction = Math.min(Math.max(fraction, 0), 1);
    const inverse = 1 - safeFraction;

    if (text2) {
      const blur = Math.min(8 / safeFraction - 8, 100);
      text2.style.filter = `blur(${isFinite(blur) ? blur : 100}px)`;
      text2.style.opacity = `${Math.pow(safeFraction, 0.4) * 100}%`;
    }

    if (text1) {
      const blur = Math.min(8 / inverse - 8, 100);
      text1.style.filter = `blur(${isFinite(blur) ? blur : 100}px)`;
      text1.style.opacity = `${Math.pow(inverse, 0.4) * 100}%`;
    }
  }

  function doMorph() {
    morph -= cooldown;
    cooldown = 0;
    let fraction = morph / morphTime;

    if (fraction > 1) {
      cooldown = cooldownTime;
      fraction = 1;
    }

    setMorph(fraction);
  }

  function doCooldown() {
    morph = 0;
    if (text1 && text2) {
      text2.style.filter = "";
      text2.style.opacity = "100%";
      text1.style.filter = "";
      text1.style.opacity = "0%";
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    const newTime = new Date();
    const dt = (newTime.getTime() - time.getTime()) / 1000;
    time = newTime;

    const shouldIncrementIndex = cooldown > 0;
    cooldown -= dt;

    if (cooldown <= 0) {
      if (shouldIncrementIndex) {
        textIndex = (textIndex + 1) % texts.length;
        text1.textContent = texts[textIndex % texts.length];
        text2.textContent = texts[(textIndex + 1) % texts.length];
      }
      doMorph();
    } else {
      doCooldown();
    }
  }

  animate();
}

function initProjectModal() {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalLink = document.getElementById("modalLearnMore");
  const closeTargets = modal.querySelectorAll("[data-close]");
  const cards = document.querySelectorAll(".project-card");

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const openModal = card => {
    modalTitle.textContent = card.dataset.title || "Project Capsule";
    modalDescription.textContent = card.dataset.description || "";

    if (card.dataset.image) {
      modalImage.src = card.dataset.image;
      modalImage.alt = `${card.dataset.title || "Project"} preview`;
    } else {
      modalImage.removeAttribute("src");
      modalImage.alt = "";
    }

    if (card.dataset.link) {
      modalLink.href = card.dataset.link;
      modalLink.style.display = "inline-flex";
    } else {
      modalLink.removeAttribute("href");
      modalLink.style.display = "none";
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  closeTargets.forEach(target => target.addEventListener("click", closeModal));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  cards.forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("a") && event.target.closest(".project-cta") === null) {
        return;
      }
      openModal(card);
    });
  });
}

function initSecretTrigger() {
  const secretBtn = document.getElementById("secretBtn");
  const secretAudio = document.getElementById("secretAudio");
  if (!secretBtn || !secretAudio) return;

  const label = secretBtn.querySelector("span") || secretBtn;
  const icon = secretBtn.querySelector("i");
  let isActive = false;

  const setState = playing => {
    isActive = playing;
    document.body.classList.toggle("secret-mode", playing);
    secretBtn.classList.toggle("active", playing);
    label.textContent = playing ? "Secret mode engaged" : "Pulse the secret track";
    if (icon) {
      icon.classList.toggle("fa-wave-square", !playing);
      icon.classList.toggle("fa-circle-stop", playing);
    }
  };

  secretBtn.addEventListener("click", async () => {
    try {
      if (isActive) {
        secretAudio.pause();
        secretAudio.currentTime = 0;
        setState(false);
      } else {
        await secretAudio.play();
        setState(true);
      }
    } catch (error) {
      console.error("Secret audio failed:", error);
    }
  });

  secretAudio.addEventListener("ended", () => setState(false));
}
