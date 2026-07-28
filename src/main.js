import Lenis from "/public/vendor/lenis.mjs";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitType = window.SplitType;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced && gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ duration: 1.08, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
  if (SplitType) {
    const heroTitle = new SplitType("[data-hero-title]", { types: "lines" });
    heroTimeline.from(heroTitle.lines, { yPercent: 115, opacity: 0, duration: 1.25, stagger: .13 });
  } else {
    heroTimeline.from("[data-hero-title]", { y: 60, opacity: 0, duration: 1.2 });
  }
  heroTimeline
    .from(".hero__date", { y: -20, opacity: 0, duration: .75 }, 0)
    .from(".hero__copy>p", { y: 24, opacity: 0, duration: .8, stagger: .1 }, .45)
    .from(".hero__copy .button", { y: 18, opacity: 0, duration: .75 }, .65)
    .from(".hero__portrait", { xPercent: 10, opacity: 0, duration: 1.45 }, .12)
    .from(".hero__network svg path, .hero__network svg circle", { strokeDasharray: 1800, strokeDashoffset: 1800, opacity: 0, duration: 1.3, stagger: .08 }, .2)
    .from(".hero__network i", { scale: 0, opacity: 0, duration: .5, stagger: .12 }, .65);

  gsap.to(".hero__network", {
    yPercent: 10,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .8 }
  });
  gsap.to(".hero__portrait", {
    yPercent: 7,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .7 }
  });

  const revealHeading = (selector) => {
    gsap.utils.toArray(selector).forEach((heading) => {
      const split = SplitType ? new SplitType(heading, { types: "lines" }) : null;
      gsap.from(split ? split.lines : heading, {
        yPercent: split ? 105 : 0,
        y: split ? 0 : 34,
        opacity: 0,
        duration: 1,
        stagger: .1,
        ease: "power4.out",
        scrollTrigger: { trigger: heading, start: "top 84%", once: true }
      });
    });
  };
  revealHeading(".chapter h2, .final-screen h2, .care h2");

  gsap.from(".solo__era--before", {
    x: -35, opacity: 0, duration: .85, ease: "power3.out",
    scrollTrigger: { trigger: ".solo__headline", start: "top 78%", once: true }
  });
  gsap.from(".solo__era-arrow path", {
    strokeDasharray: 180, strokeDashoffset: 180, duration: .9, ease: "power2.inOut",
    scrollTrigger: { trigger: ".solo__headline", start: "top 72%", once: true }
  });
  gsap.from(".solo__era--after", {
    x: 35, opacity: 0, duration: .85, delay: .18, ease: "power3.out",
    scrollTrigger: { trigger: ".solo__headline", start: "top 72%", once: true }
  });

  gsap.from(".solo__intro", {
    y: 30, opacity: 0, duration: .85, ease: "power3.out",
    scrollTrigger: { trigger: ".solo__story", start: "top 78%", once: true }
  });
  gsap.from(".solo__reason", {
    y: 45, opacity: 0, duration: .9, stagger: .16, ease: "power3.out",
    scrollTrigger: { trigger: ".solo__reasoning", start: "top 78%", once: true }
  });
  gsap.from(".solo__result", {
    clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "power4.inOut",
    scrollTrigger: { trigger: ".solo__result", start: "top 82%", once: true }
  });

  gsap.utils.toArray(".connection__stream article").forEach((item, index) => {
    gsap.from(item, {
      x: 55, opacity: 0, duration: .85, ease: "power3.out",
      scrollTrigger: { trigger: item, start: "top 86%", once: true }
    });
    gsap.to(item, {
      "--progress": 1,
      scrollTrigger: { trigger: item, start: "top 65%", end: "bottom 45%", scrub: true }
    });
  });

  gsap.from(".direction__group--muted", {
    xPercent: -12, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".direction__stage", start: "top 72%", once: true }
  });
  gsap.from(".direction__flow path", {
    strokeDasharray: 400, strokeDashoffset: 400, duration: 1.1, ease: "power2.inOut",
    scrollTrigger: { trigger: ".direction__stage", start: "top 66%", once: true }
  });
  gsap.from(".direction__group--strong p", {
    x: 25, opacity: 0, stagger: .13, duration: .7, ease: "power3.out",
    scrollTrigger: { trigger: ".direction__group--strong", start: "top 70%", once: true }
  });

  gsap.utils.toArray(".changes__rail article").forEach((card, index) => {
    gsap.from(card, {
      y: 70 + index * 12, opacity: 0, duration: 1, delay: index * .06, ease: "power4.out",
      scrollTrigger: { trigger: ".changes__rail", start: "top 78%", once: true }
    });
    gsap.to(card, {
      "--card-line": 1,
      scrollTrigger: { trigger: card, start: "top 70%", end: "bottom 55%", scrub: true }
    });
  });

  gsap.from(".program__list p", {
    x: 45, opacity: 0, duration: .75, stagger: .1, ease: "power3.out",
    scrollTrigger: { trigger: ".program__list", start: "top 78%", once: true }
  });

  gsap.to(".relevance h2", {
    xPercent: -6, ease: "none",
    scrollTrigger: { trigger: ".relevance", start: "top bottom", end: "bottom top", scrub: .7 }
  });
  gsap.from(".relevance__copy>*", {
    y: 35, opacity: 0, duration: .8, stagger: .12, ease: "power3.out",
    scrollTrigger: { trigger: ".relevance__copy", start: "top 80%", once: true }
  });

  gsap.from(".audience__orbit article", {
    scale: .94, opacity: 0, duration: .85, stagger: .12, ease: "power3.out",
    scrollTrigger: { trigger: ".audience__orbit", start: "top 78%", once: true }
  });
  gsap.from(".audience__final", {
    y: 45, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".audience__final", start: "top 84%", once: true }
  });

  gsap.from(".registration__copy>*", {
    y: 38, opacity: 0, duration: .85, stagger: .1, ease: "power3.out",
    scrollTrigger: { trigger: ".registration", start: "top 70%", once: true }
  });
  gsap.from(".registration__question", {
    x: -28, opacity: 0, duration: .75, stagger: .14, ease: "power3.out",
    scrollTrigger: { trigger: ".registration__questions", start: "top 78%", once: true }
  });
  gsap.from(".registration__widget", {
    y: 60, opacity: 0, duration: 1, ease: "power4.out",
    scrollTrigger: { trigger: ".registration", start: "top 68%", once: true }
  });

  gsap.from(".author__photo", {
    clipPath: "inset(0 100% 0 0)", duration: 1.25, ease: "power4.inOut",
    scrollTrigger: { trigger: ".author", start: "top 70%", once: true }
  });
  gsap.from(".author__name", {
    x: 55, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".author", start: "top 68%", once: true }
  });

  gsap.to(".reviews__line span", {
    scale: 2.2, stagger: .18, yoyo: true, repeat: 1, duration: .45, ease: "power2.inOut",
    scrollTrigger: { trigger: ".reviews", start: "top 60%", once: true }
  });
  gsap.from(".final-screen__inner>*", {
    y: 42, opacity: 0, stagger: .11, duration: .85, ease: "power3.out",
    scrollTrigger: { trigger: ".final-screen", start: "top 66%", once: true }
  });
  gsap.from(".care__copy>*", {
    x: -45, opacity: 0, stagger: .1, duration: .85, ease: "power3.out",
    scrollTrigger: { trigger: ".care", start: "top 70%", once: true }
  });
  gsap.from(".care__phone", {
    y: 80, opacity: 0, duration: 1.2, ease: "power4.out",
    scrollTrigger: { trigger: ".care", start: "top 70%", once: true }
  });
}

const reviewsSlider = document.querySelector("[data-slider]");
if (reviewsSlider) {
  const track = reviewsSlider.querySelector("[data-slider-track]");
  const slides = [...track.children];
  const previousButton = reviewsSlider.querySelector("[data-slider-prev]");
  const nextButton = reviewsSlider.querySelector("[data-slider-next]");
  const progress = reviewsSlider.querySelector("[data-slider-progress]");
  const count = reviewsSlider.querySelector("[data-slider-count]");
  let currentSlide = 0;
  let touchStartX = 0;

  const renderSlider = () => {
    track.style.transform = `translate3d(${-currentSlide * 100}%, 0, 0)`;
    progress.style.transform = `scaleX(${(currentSlide + 1) / slides.length})`;
    count.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };

  const goToSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    renderSlider();
  };

  previousButton.addEventListener("click", () => goToSlide(currentSlide - 1));
  nextButton.addEventListener("click", () => goToSlide(currentSlide + 1));
  reviewsSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goToSlide(currentSlide - 1);
    if (event.key === "ArrowRight") goToSlide(currentSlide + 1);
  });
  reviewsSlider.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  reviewsSlider.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) >= 48) goToSlide(currentSlide + (distance < 0 ? 1 : -1));
  }, { passive: true });

  renderSlider();
}
