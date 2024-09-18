function generateSmithsonianQuery(
  api_key,
  rows = 100,
  sort = "relevancy",
  search_term = null,
  params = {}
) {
  /**
   * Generates a Smithsonian API query URL based on provided query parameters, with an additional
   * search_term parameter for broader searches.
   *
   * @param {string} api_key - Your API key for the Smithsonian API.
   * @param {number} rows - The number of results to return. Default is 100.
   * @param {string} sort - Sorting of results ('relevancy', 'id', 'newest', 'updated', 'random').
   * @param {string} search_term - A broad search term not tied to any specific field.
   * @param {object} params - Other arbitrary keyword arguments representing query parameters like unit_code, place, etc.
   *
   * @returns {string} - A Smithsonian API query URL.
   */

  const baseUrl = "https://api.si.edu/openaccess/api/v1.0/search?q=";

  // Building the query string from params
  let queryParts = [];
  for (const key in params) {
    // Check if the value contains spaces, and wrap it in quotes if necessary
    if (params[key].includes(" ")) {
      queryParts.push(`${key}:"${params[key]}"`);
    } else {
      queryParts.push(`${key}:${params[key]}`);
    }
  }

  // Adding the broad search term if provided (without quotes)
  if (search_term) {
    queryParts.push(search_term); // Add search term without any specific field binding
  }

  // Joining query parameters with '+AND+'
  const queryString = queryParts.join("+AND+");

  // Constructing the final URL
  const queryUrl = `${baseUrl}${queryString}&api_key=${api_key}&rows=${rows}&sort=${sort}`;

  return queryUrl;
}
// Example usage:
const api_key = "tpgd1EoS6jOq3yaTETG1TAL774fulGgxKWhgqHdw";
const params = {
  // unit_code: "HMSG", // Unit code for museum
  // "object_type": "Books", // Type of object
  // date: "196*", // Date in normalized form
  // "language": "English",     // Language from the vocabulary list
  // "topic": "Outer space",       // Topic of the object
  // "place": "United States of America",  // Geographic place
  online_media_type: "Image*",
};

// You can now add a broad search term like "fuel"
const queryUrl = generateSmithsonianQuery(api_key, 150, "random", "", params);
console.log(queryUrl);

fetch(queryUrl)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

// PRIORITY UNITS
// # // HMSG: Hirshhorn Museum and Sculpture Garden
// # // NASM: National Air and Space Museum
// # // NMAH: Smithsonian National Museum of American History
// # // NMNH*
// # // NMNHANTHRO: NMNH - Anthropology Dept.
// # // NMNHBIRDS: NMNH - Vertebrate Zoology - Birds Division
// # // NMNHBOTANY: NMNH - Botany Dept.
// # // NMNHEDUCATION: NMNH - Education & Outreach
// # // NMNHENTO: NMNH - Entomology Dept.
// # // NMNHFISHES: NMNH - Vertebrate Zoology - Fishes Division
// # // NMNHHERPS: NMNH - Vertebrate Zoology - Herpetology Division
// # // NMNHINV: NMNH - Invertebrate Zoology Dept.
// # // NMNHMAMMALS: NMNH - Vertebrate Zoology - Mammals Division
// # // NMNHMINSCI: NMNH - Mineral Sciences Dept.
// # // NMNHPALEO: NMNH - Paleobiology Dept.

// SECONDARY UNITS

// # // ACAH: Archives Center, National Museum of American History
// # // ACM: Anacostia Community Museum
// # // CFCHFOLKLIFE: Smithsonian Center for Folklife and Cultural Heritage
// # // CHNDM: Cooper-Hewitt, National Design Museum
// # // FBR: Smithsonian Field Book Project
// # // FSA: Freer Gallery of Art and Arthur M. Sackler Gallery Archives
// # // FSG: Freer Gallery of Art and Arthur M. Sackler Gallery
// # // HAC: Smithsonian Gardens
// # // HSFA: Human Studies Film Archives
// # // NMAAHC: National Museum of African American History and Culture
// # // NMAfA: Smithsonian National Museum of African Art
// # // NMAI: National Museum of the American Indian
// # // NPG: National Portrait Gallery
// # // NPM: National Postal Museum
// # // SAAM: Smithsonian American Art Museum
// # // SI: Smithsonian Institution, Digitization Program Office
// # // SIA: Smithsonian Institution Archives
// # // SIL: Smithsonian Libraries

// # // NAA: National Anthropological Archives

// Shop by Center Shape
// Menu Image IconPrincess
// Menu Image IconRound
// Menu Image IconOval
// Menu Image IconPear
// Menu Image IconEmerald
// Menu Image IconMarquise
// Menu Image IconCushion
// Menu Image IconRadiant
// Menu Image IconHeart
