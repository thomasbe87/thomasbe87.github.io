console.clear();

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  // Animation principale
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
        markers: false
      }
    })
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

  const animateBlockquote = (blockquote) => {
    gsap.from(blockquote, {
      scale: 1.3,
      opacity: 0,
      transformOrigin: "center center",
      ease: "power1.inOut",
      willChange: "transform, opacity",
      scrollTrigger: {
        trigger: blockquote,
        start: "top 80%",
        end: "top 40%",
        scrub: true,
        markers: false
      }
    });
  };

  document.querySelectorAll("blockquote").forEach(animateBlockquote);
});


var countries = [
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


var width = 500,
    height = 500;

var centroid = d3.geo.path()
    .projection(function(d) { return d; })
    .centroid;

var projection = d3.geo.orthographic()
    .scale((height-30) / 2.0)
    .translate([width / 2, height / 2])
    .clipAngle(90);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule()
    .extent([[-180, -90], [180 - .1, 90 - .1]]);

var svg = d3.select("#world-map")
    .attr("width", width)
    .attr("height", height);

svg.append("circle")
    .attr("class", "globe-border")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale() + 0) 
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

var rotate = d3_geo_greatArcInterpolator();

d3.json("https://s3-us-west-2.amazonaws.com/s.cdpn.io/95802/world-110m.json", function(error, world) {
  if (error) throw error;
  
  var allCountries = topojson.object(world, world.objects.countries).geometries;
  var highlightedGeometries = allCountries.filter(function(d) {
    return countries.some(country => country.code === d.id.toString());
  });
  
  var i = -1,
      n = countries.length;

  projection.clipAngle(180);
  
  var backLine = svg.append("path")
      .datum(graticule)
      .attr("class", "back-line")
      .attr("d", path);
  
  var backCountry = svg.selectAll(".back-country")
      .data(allCountries)
    .enter().insert("path", ".back-line")
      .attr("class", "back-country")
      .attr("d", path)
      .attr("fill", "#d8d8d8");
  
  projection.clipAngle(90);
  
  var line = svg.append("path")
      .datum(graticule)
      .attr("class", "line")
      .attr("d", path);
  
  var country = svg.selectAll(".country")
      .data(allCountries)
    .enter().insert("path", ".line")
      .attr("class", "country")
      .attr("d", path);
  
  var title = svg.append("text")
      .attr("x", width / 2)
      .attr("y", height * 2.5 / 5) 
      .attr("text-anchor", "middle")
      .attr("font-size", "70px")
      .attr("fill", "#333");
  
  step();
    
  function step() {
    if (++i >= n) i = 0;
    
    country.transition()
        .style("fill", function(d) { 
            return countries.some(country => country.code === d.id.toString()) ? 
                (d.id.toString() === countries[i].code ? "#b71b54" : "#f4edcb") : 
                "#f4edcb";
        });
    
                // Mise à jour du nom du pays
                var currentCountryId = countries[i].code;
                var currentCountryName = countries[i].name;
                var currentCountryExpat = countries[i].expat;
                document.getElementById('country-name').textContent = currentCountryName;
                document.getElementById('country-expat').textContent = currentCountryExpat;
                
    
    d3.transition()
        .delay(120)
        .duration(1300)
        .tween("rotate", function() {
            var point = centroid(highlightedGeometries.find(d => d.id.toString() === currentCountryId));
            rotate.source(projection.rotate()).target([-point[0], -point[1]]).distance();
            return function(t) {
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
});

var d3_radians = Math.PI / 180;

function d3_geo_greatArcInterpolator() {
  var x0, y0, cy0, sy0, kx0, ky0,
      x1, y1, cy1, sy1, kx1, ky1,
      d,
      k;

  function interpolate(t) {
    var B = Math.sin(t *= d) * k,
        A = Math.sin(d - t) * k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      Math.atan2(y, x) / d3_radians,
      Math.atan2(z, Math.sqrt(x * x + y * y)) / d3_radians
    ];
  }

  interpolate.distance = function() {
    if (d == null) k = 1 / Math.sin(d = Math.acos(Math.max(-1, Math.min(1, sy0 * sy1 + cy0 * cy1 * Math.cos(x1 - x0)))));
    return d;
  };

  interpolate.source = function(_) {
    var cx0 = Math.cos(x0 = _[0] * d3_radians),
        sx0 = Math.sin(x0);
    cy0 = Math.cos(y0 = _[1] * d3_radians);
    sy0 = Math.sin(y0);
    kx0 = cy0 * cx0;
    ky0 = cy0 * sx0;
    d = null;
    return interpolate;
  };

  interpolate.target = function(_) {
    var cx1 = Math.cos(x1 = _[0] * d3_radians),
        sx1 = Math.sin(x1);
    cy1 = Math.cos(y1 = _[1] * d3_radians);
    sy1 = Math.sin(y1);
    kx1 = cy1 * cx1;
    ky1 = cy1 * sx1;
    d = null;
    return interpolate;
  };

  return interpolate;
}
