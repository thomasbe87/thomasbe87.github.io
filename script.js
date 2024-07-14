// Nettoyage de la console
console.clear();

// Enregistrement du plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Attente du chargement complet du DOM
document.addEventListener("DOMContentLoaded", () => {
  // Animation principale
  const mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      end: "+=150%",
      pin: true,
      scrub: true,
      markers: false
    }
  });

  mainTimeline
    .to(".img-move", {
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

  // Animation des blockquotes
  const animateBlockquote = (blockquote) => {
    console.log("Animating blockquote:", blockquote);
    gsap.fromTo(blockquote, 
      { scale: 1.3, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: blockquote,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
          markers: true, // À désactiver en production
          onEnter: () => console.log("Entering blockquote animation"),
          onLeave: () => console.log("Leaving blockquote animation")
        }
      }
    );
  };

  const blockquotes = document.querySelectorAll("blockquote");
  console.log("Found blockquotes:", blockquotes.length);
  blockquotes.forEach(animateBlockquote);

  // Données des pays
  const countries = [
    { code: '250', name: '1. France', expat: 145118 },
    { code: '528', name: '2. Pays-Bas', expat: 42036 },
    { code: '826', name: '3. Royaume-Uni', expat: 34887 },
    { code: '724', name: '4. Espagne', expat: 34208 },
    { code: '276', name: '5. Allemagne', expat: 29972 },
    { code: '840', name: '6. États-Unis', expat: 29956 },
    { code: '756', name: '7. Suisse', expat: 25003 },
    { code: '442', name: '8. Luxembourg', expat: 24868 },
    { code: '124', name: '9. Canada', expat: 17036 },
    { code: '376', name: '10. Israël', expat: 9468 },
    { code: '380', name: '11. Italie', expat: 8093 },
    { code: '710', name: '12. Afrique du Sud', expat: 7537 },
    { code: '36', name: '13. Australie', expat: 6710 },
    { code: '792', name: '14. Turquie', expat: 6504 },
    { code: '32', name: '15. Argentine', expat: 5532 },
    { code: '620', name: '16. Portugal', expat: 5133 },
    { code: '504', name: '17. Maroc', expat: 4846 },
    { code: '76', name: '18. Brésil', expat: 3986 },
    { code: '784', name: '19. Émirats arabes unis', expat: 3754 },
    { code: '764', name: '20. Thaïlande', expat: 3347 },
  ];

  // Configuration de la carte
  const width = 500,
        height = 500;

  const centroid = d3.geo.path()
    .projection(d => d)
    .centroid;

  const projection = d3.geo.orthographic()
    .scale((height - 30) / 2.0)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  const path = d3.geo.path()
    .projection(projection);

  const graticule = d3.geo.graticule()
    .extent([[-180, -90], [180 - .1, 90 - .1]]);

  const svg = d3.select("#world-map")
    .attr("width", width)
    .attr("height", height);

  // Ajout des éléments SVG
  svg.append("circle")
    .attr("class", "globe-border")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("fill", "none")
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0);

  svg.append("circle")
    .attr("class", "globe-background")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("fill", "#a4d1e8");

  svg.append("circle")
    .attr("class", "world-outline")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", "1px");

  const rotate = d3_geo_greatArcInterpolator();

  // Chargement et traitement des données géographiques
  d3.json("https://s3-us-west-2.amazonaws.com/s.cdpn.io/95802/world-110m.json", (error, world) => {
    if (error) throw error;
    
    const allCountries = topojson.object(world, world.objects.countries).geometries;
    const highlightedGeometries = allCountries.filter(d => 
      countries.some(country => country.code === d.id.toString())
    );
    
    let i = -1;
    const n = countries.length;

    projection.clipAngle(180);
    
    const backLine = svg.append("path")
      .datum(graticule)
      .attr("class", "back-line")
      .attr("d", path);
    
    const backCountry = svg.selectAll(".back-country")
      .data(allCountries)
      .enter().insert("path", ".back-line")
      .attr("class", "back-country")
      .attr("d", path)
      .attr("fill", "#d8d8d8");
    
    projection.clipAngle(90);
    
    const line = svg.append("path")
      .datum(graticule)
      .attr("class", "line")
      .attr("d", path);
    
    const country = svg.selectAll(".country")
      .data(allCountries)
      .enter().insert("path", ".line")
      .attr("class", "country")
      .attr("d", path);
    
    const title = svg.append("text")
      .attr("x", width / 2)
      .attr("y", height * 2.5 / 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "70px")
      .attr("fill", "#333");
    
    function step() {
      if (++i >= n) i = 0;
      
      country.transition()
        .style("fill", d => 
          countries.some(country => country.code === d.id.toString()) 
            ? (d.id.toString() === countries[i].code ? "#b71b54" : "#f4edcb") 
            : "#f4edcb"
        );
      
      const currentCountry = countries[i];
      document.getElementById('country-name').textContent = currentCountry.name;
      document.getElementById('country-expat').textContent = currentCountry.expat;
      
      d3.transition()
        .delay(120)
        .duration(1300)
        .tween("rotate", () => {
          const point = centroid(highlightedGeometries.find(d => d.id.toString() === currentCountry.code));
          rotate.source(projection.rotate()).target([-point[0], -point[1]]).distance();
          return t => {
            projection.rotate(rotate(t)).clipAngle(180);
            backCountry.attr("d", path);
            backLine.attr("d", path);
            projection.rotate(rotate(t)).clipAngle(90);
            country.attr("d", path);
            line.attr("d", path);
          };
        })
        .transition()
        .each("end", step);
    }

    step();
  });
});

// Fonction utilitaire pour l'interpolation des grands arcs
function d3_geo_greatArcInterpolator() {
  let x0, y0, cy0, sy0, kx0, ky0,
      x1, y1, cy1, sy1, kx1, ky1,
      d, k;

  function interpolate(t) {
    const B = Math.sin(t *= d) * k,
          A = Math.sin(d - t) * k,
          x = A * kx0 + B * kx1,
          y = A * ky0 + B * ky1,
          z = A * sy0 + B * sy1;
    return [
      Math.atan2(y, x) / Math.PI * 180,
      Math.atan2(z, Math.sqrt(x * x + y * y)) / Math.PI * 180
    ];
  }

  interpolate.distance = function() {
    if (d == null) k = 1 / Math.sin(d = Math.acos(Math.max(-1, Math.min(1, sy0 * sy1 + cy0 * cy1 * Math.cos(x1 - x0)))));
    return d;
  };

  interpolate.source = function(_) {
    const cx0 = Math.cos(x0 = _ [0] * Math.PI / 180),
          sx0 = Math.sin(x0);
    cy0 = Math.cos(y0 = _ [1] * Math.PI / 180);
    sy0 = Math.sin(y0);
    kx0 = cy0 * cx0;
    ky0 = cy0 * sx0;
    d = null;
    return interpolate;
  };

  interpolate.target = function(_) {
    const cx1 = Math.cos(x1 = _ [0] * Math.PI / 180),
          sx1 = Math.sin(x1);
    cy1 = Math.cos(y1 = _ [1] * Math.PI / 180);
    sy1 = Math.sin(y1);
    kx1 = cy1 * cx1;
    ky1 = cy1 * sx1;
    d = null;
    return interpolate;
  };

  return interpolate;
}
