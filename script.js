document.getElementById("goButton").addEventListener('click',generateSystem);

function generateSystem() {
  url = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname,pl_letter,pl_name,pl_masse,pl_rade,pl_eqt,st_teff,pl_ratror,pl_edelink,pl_pelink&order=pl_letter&format=json';
  document.getElementById('results').innerHTML = "<h4>Loading...</h4>";
  fetch(url)
    .then(result => {
      return result.json()
    })
    .then(function(json) {
      habitablePlanets = json.filter(isHabitable);

      randPlanet = habitablePlanets[Math.floor((Math.random() * habitablePlanets.length))];
      var orbitsMyStar = orbitsStar(randPlanet.pl_hostname);
      planetarySystem = json.filter(orbitsMyStar);

      displaySystem(planetarySystem);
      console.log("done");
    });
}

function isHabitable(planet) {
  return planet.pl_eqt < 373 && planet.pl_eqt > 273;
}

function orbitsStar(star) {
  return function (planet) {
    return planet.pl_hostname == star;
  }
}

function displaySystem(planetarySystem) {
  results = "";

  //display the star's info
  let starSize = 5 * Math.log(2 * Math.pow(planetarySystem[0].pl_ratror || 0.04, -1) * (planetarySystem[0].pl_rade || 2.2)); //create a size to display the star. 0.04 is a typical planet to star radius ratio, and 2.2 is a typical planet ratio for when those values are missing
  results += "<h2>" + planetarySystem[0].pl_hostname + "</h2>";
  results += "<div class='planet' style='background-color: " + getStarColor(planetarySystem[0].st_teff || 3000) + "; width: " + starSize + "em; height: " + starSize + "em; border-radius: " + (starSize / 2) + "em;'></div>";
  results += "<div class='star-info'>"
  results += "</div>"

  //display the planets' info
  let beforeHabitable = true;
  planetarySystem.forEach((planet) => {
    let planetSize = 5 * Math.log(2 * planet.pl_rade || 4.4);
    let planetRadius = planet.pl_rade || "Unknown";
    let planetMass = planet.pl_masse || "Unknown";
    let surfaceGravity = (planetMass / (planetRadius * planetRadius)) || "Unknown";
    let planetTemp = planet.pl_eqt || "Unknown";
    if (planetRadius != "Unknown") {
      planetRadius += " Earth Radii";
    }
    if (planetMass != "Unknown") {
      planetMass += " Earth Masses";
    }
    if (surfaceGravity != "Unknown") {
      surfaceGravity = surfaceGravity.toFixed(2);
      surfaceGravity += "g";
    }
    if (planetTemp != "Unknown") {
      planetTemp += "&deg;K";
    }
    let borderColor = "#000";

    //build HTML
    results += "<h3>" + planet.pl_name + "</h3>";
    if (planet.pl_edelink || planet.pl_pelink) {
      borderColor = "#FFF";
      results += "<a target='_blank' href='" + (planet.pl_edelink || planet.pl_pelink) + "'>";
    }
    results += "<div class='planet' style='background-color: " + getPlanetColor(planet.pl_eqt || beforeHabitable * 1000) + "; border-color: " + borderColor + "; width: " + planetSize + "em; height: " + planetSize + "em; border-radius: " + (planetSize / 2) + "em;'></div>";
    if (planet.pl_edelink || planet.pl_pelink) {
      results += "</a>";
    }
    results += "<div class='planet-info'>";
    results += "<p>Radius: " + planetRadius + "</p>";
    results += "<p>Mass: " + planetMass + "</p>";
    results += "<p>Surface Gravity: " + surfaceGravity + "</p>";
    results += "<p>Equilibrium Temprature: " + planetTemp + "</p>";
    results += "</div>";
    if (getPlanetColor(planet.pl_eqt) == "#1F1") {
      beforeHabitable = false;
    }
  });

  //build the end
  results += "<h4>You can click or tap planets with white borders to get more information!</h4>";
  results +=  '<button type="button" class="goButton" id="goButton2">Find a Different System</button>';

  document.getElementById('results').innerHTML = results;
  document.getElementById('goButton2').addEventListener('click', generateSystem);
}

function getStarColor(temp) {
  if (temp < 1000) {
    return "#F00" //red
  }
  else if (temp < 1500) {
    return "#F50" //reddish orange
  }
  else if (temp < 2000) {
    return "#FA0" //Yellowish orange
  }
  else if (temp < 2800) {
    return "#FF0" //Yellow
  }
  else if (temp < 3500) {
    return "#FF5" //Yellowish White
  }
  else if (temp < 4500) {
    return "#FFA" //Warm White
  }
  else if (temp < 5500) {
    return "#FFF" //White
  }
  else {
    return "#DDF" //Bluish White
  }
}

function getPlanetColor(temp) {
  if (temp < 273) {
    return "#11F";
  }
  else if (temp < 373) {
    return "#1F1";
  }
  else {
    return "#F11";
  }
}
