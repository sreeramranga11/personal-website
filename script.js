document.addEventListener("DOMContentLoaded", () => {
    // Function to animate text letter by letter with configurable speed/delay
    function typeWriterEffect(el, defaultSpeed = 25, defaultDelay = 0) {
      const speed = el.getAttribute("data-speed")
        ? parseInt(el.getAttribute("data-speed"))
        : defaultSpeed;
      const delay = el.getAttribute("data-delay")
        ? parseInt(el.getAttribute("data-delay"))
        : defaultDelay;
      const fullText = el.textContent;
      el.textContent = "";
      let i = 0;
      setTimeout(function addChar() {
        if (i < fullText.length) {
          el.textContent += fullText.charAt(i);
          i++;
          setTimeout(addChar, speed);
        }
      }, delay);
    }
  
    // Animate text for all elements with .animate-text
    const elementsToAnimate = document.querySelectorAll(".animate-text");
    elementsToAnimate.forEach(el => typeWriterEffect(el));
  
    // Secret toggle functionality
    const secretBtn = document.getElementById("secretBtn");
    const profileWrapper = document.querySelector(".profile-image-wrapper");
    const secretAudio = document.getElementById("secretAudio");
    const globalOverlay = document.getElementById("globalOverlay");
  
    secretBtn.addEventListener("click", () => {
      // Get the inner image element from the wrapper
      const profileImage = profileWrapper.querySelector(".profile-image");
      if (secretBtn.textContent.trim().toLowerCase() === "see my secret") {
        secretBtn.textContent = "hide my secret";
        profileImage.src = "image.png";
        secretAudio.play();
  
        // Calculate the center and radius for the hole based on the wrapper's position
        const rect = profileWrapper.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Radius slightly larger than half the diagonal of the wrapper (adjust as needed)
        const radius = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2) + 20;
  
        // Set the overlay's background using a radial gradient:
        // Everything inside the circle (radius) is transparent; outside becomes dark.
        globalOverlay.style.background = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${radius}px, rgba(0, 0, 0, 0.8) ${radius + 1}px)`;
        globalOverlay.classList.add("active");
      } else {
        secretBtn.textContent = "see my secret";
        profileImage.src = "picture.jpg";
        secretAudio.pause();
        secretAudio.currentTime = 0;
        globalOverlay.classList.remove("active");
        globalOverlay.style.background = "";
      }
    });
  
    // (Optional) Existing fade-in functionality for list items...
    const fadeInElements = document.querySelectorAll(".fade-in");
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
    fadeInElements.forEach(el => observer.observe(el));
  });
  