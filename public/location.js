function findCounty(element) {
  if (!"geolocation" in navigator) return handleError({ code: "geolocation" });

  const oldText = element.innerText;
  element.innerText = "Locating...";
  element.classList.add("pulse");

  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    try {
      const block = await fetchBlock(coords.latitude, coords.longitude);

      if (block.County) {
        highlightCountyLink(block.County.FIPS);
      } else {
        throw new Error();
      }
    } catch (error) {
      handleError({ code: "county" });
    }

    element.innerText = oldText;
    element.classList.remove("pulse");
  }, handleError);
}

async function fetchBlock(latitude, longitude) {
  const baseURL = "https://geo.fcc.gov/api/census/block/find?";
  const params = `latitude=${latitude}&longitude=${longitude}&format=json`;
  return fetch(baseURL + params).then((res) => res.json());
}

function highlightCountyLink(FIPS) {
  const link = document.getElementById(FIPS);

  if (!link) return handleError({ code: "link" });

  link.focus();
  link.classList.add("current-location", "pulse");
  link.scrollIntoView({ behavior: "smooth" });
}

function handleError(error) {
  let message = error.message;

  switch (error.code) {
    case 1:
      message = "Access denied. Refresh and allow access to your location.";
      break;

    case 2:
      message = "Position unavailable. Find a stronger internet connection.";
      break;

    case "county":
      message = "Unable to locate your county";
      break;

    case "link":
      message = "No link found for your county";
      break;

    case "geolocation":
      message = "Geolocation is not supported";
      break;

    default:
      message = "Unable to access location";
      break;
  }

  alert(message);
}
