console.clear();

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: true,
        markers: false
      }
    })
    .to("img", {
      scale: 1.5,
      z: 450,
      transformOrigin: "center center",
      ease: "power1.inOut",
      willChange: "transform"
    })
    .from("h1", {
      scale: 2,
      opacity: 0,
      transformOrigin: "center center",
      ease: "power1.inOut",
      willChange: "transform, opacity"
    });
});
