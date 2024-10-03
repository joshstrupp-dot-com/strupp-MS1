// Smithsonian API example code
// check API documentation for search here: http://edan.si.edu/openaccess/apidocs/#api-search-search
// Using this data set https://collections.si.edu/search/results.htm?q=Flowers&view=grid&fq=data_source%3A%22Cooper+Hewitt%2C+Smithsonian+Design+Museum%22&fq=online_media_type%3A%22Images%22&media.CC0=true&fq=object_type:%22Embroidery+%28visual+works%29%22

// put your API key here;
const apiKey = "XK7BrLxDdDqLWORrICngROzSp8WySfIvHNVw3L28";

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// constructing the initial search query
// const search =  'mask AND unit_code:"FSG"';
// const search = `New York AND unit_code: "NMAH" AND online_media_type:"Images"`;
// const search = `pharmaceutical AND unit_code: "NMAH" AND online_media_type:"Images"`; NASM
const search = `unit_code: "NASM" AND online_media_type:"Images"`;

const sortBy = "random";

// array that we will write into
let myArray = [];

// string that will hold the stringified JSON data
let jsonString = "";

// search: fetches an array of terms based on term category
function fetchSearchData(searchTerm) {
  let url =
    searchBaseURL +
    "?api_key=" +
    apiKey +
    "&sort=" +
    sortBy +
    "&q=" +
    searchTerm;
  console.log(url);
  window
    .fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      // constructing search queries to get all the rows of data
      // you can change the page size
      let pageSize = 1000;
      // let numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
      // numberofQueries limits API requests. At 1000 per request. So 25 is 25,000
      let numberOfQueries = 2;
      console.log(numberOfQueries);
      let start = 1;
      // let start = 25000; // Start at 25001st result

      // total records in MAMMALS: 555492
      // so start would need to increase by 25000 roughly 22 times to get all records

      for (let i = 0; i < numberOfQueries; i++) {
        // making sure that our last query calls for the exact number of rows
        if (i == numberOfQueries - 1) {
          searchAllURL =
            url +
            `&start=${start + i * pageSize}&rows=${
              data.response.rowCount - (start + i * pageSize)
            }`;
        } else {
          searchAllURL =
            url + `&start=${start + i * pageSize}&rows=${pageSize}`;
        }
        console.log(searchAllURL);
        fetchAllData(searchAllURL);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// fetching all the data listed under our search and pushing them all into our custom array
function fetchAllData(url) {
  window
    .fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      data.response.rows.forEach(function (n) {
        addObject(n);
      });

      // Convert only the newly added objects to JSON and concatenate
      const newJsonString = JSON.stringify(
        myArray.slice(-data.response.rows.length)
      );
      if (jsonString.length > 0) {
        // Remove the closing bracket of the existing JSON string and the opening bracket of the new JSON string
        jsonString = jsonString.slice(0, -1) + "," + newJsonString.slice(1);
      } else {
        jsonString = newJsonString;
      }

      console.log(myArray);
    })
    .catch((error) => {
      console.log(error);
    });
}
function addObject(objectData) {
  const descriptiveNonRepeating = objectData.content.descriptiveNonRepeating;
  const freetext = objectData.content.freetext;
  const indexedStructured = objectData.content.indexedStructured;

  // Extract title
  const title = descriptiveNonRepeating.title.content;

  // Extract record link if available
  const recordLink = descriptiveNonRepeating.record_link || "";

  // Extract OnlineMedia:Media if available
  let media = [];
  if (
    descriptiveNonRepeating.online_media &&
    descriptiveNonRepeating.online_media.media
  ) {
    media = descriptiveNonRepeating.online_media.media.map(
      (item) => item.content
    );
  }

  // Extract freetext information
  const freetextData = {};
  const freetextKeys = [
    "creditLine",
    "date",
    "name",
    "notes",
    "physicalDescription",
    "place",
  ];
  freetextKeys.forEach((key) => {
    if (freetext[key]) {
      freetextData[key] = freetext[key].map((item) => item.content);
    }
  });

  // Extract indexedStructured information
  const indexedStructuredData = {};
  const indexedStructuredKeys = ["date", "object_type", "topic"];
  indexedStructuredKeys.forEach((key) => {
    if (indexedStructured[key]) {
      indexedStructuredData[key] = indexedStructured[key];
    }
  });

  myArray.push({
    id: objectData.id,
    title: title,
    recordLink: recordLink,
    media: media,
    freetext: freetextData,
    indexedStructured: indexedStructuredData,
  });
}

// NASM
// from descriptiveNonRepeating include (if not empty): OnlineMedia:Media, record_link, title
// from freetext include (if not empty): creditLine, date, name, notes, physicalDescription, place
// from indexedStructured include (if not empty): date, object_type, topic

// function addObject(objectData) {
//   let currentPlace = "";
//   if (objectData.content.indexedStructured.place) {
//     currentPlace = objectData.content.indexedStructured.place[0];
//   }

//   const dataSource = objectData.content.descriptiveNonRepeating.data_source;
//   const title = objectData.content.descriptiveNonRepeating.title.content;

//   // Extract image URL if available
//   let imageUrl = "";
//   if (
//     objectData.content.descriptiveNonRepeating.online_media &&
//     objectData.content.descriptiveNonRepeating.online_media.media
//   ) {
//     imageUrl =
//       objectData.content.descriptiveNonRepeating.online_media.media[0].content;
//   }

//   // Extract date if available
//   let date = "";
//   if (
//     objectData.content.freetext.date &&
//     objectData.content.freetext.date.length > 0
//   ) {
//     date = objectData.content.freetext.date[0].content; // Get the first date
//   }

//   // Extract all freetext information
//   const freetext = {};
//   for (const key in objectData.content.freetext) {
//     freetext[key] = objectData.content.freetext[key].map(
//       (item) => item.content
//     );
//   }

//   myArray.push({
//     id: objectData.id,
//     title: title,
//     link: objectData.content.descriptiveNonRepeating.record_link,
//     place: currentPlace,
//     dataSource: dataSource,
//     imageUrl: imageUrl,
//     date: date,
//     freetext: freetext,
//     descriptiveNonRepeating: objectData.content.descriptiveNonRepeating,
//     indexedStructured: objectData.content.indexedStructured,
//   });
// }

fetchSearchData(search);

// // create your own array with just the data you need
// function addObject(objectData) {
//   let currentPlace = "";
//   if (objectData.content.indexedStructured.place) {
//     currentPlace = objectData.content.indexedStructured.place[0];
//   }

//   if (
//     objectData.content &&
//     objectData.content.freetext &&
//     objectData.content.freetext.physicalDescription
//   ) {
//     const dataSource = objectData.content.descriptiveNonRepeating.data_source;
//     const title = objectData.content.descriptiveNonRepeating.title.content;

//     // Extract physical descriptions
//     const physicalDescriptions =
//       objectData.content.freetext.physicalDescription.map(
//         (desc) => desc.content
//       );

//     // Extract image URL if available
//     let imageUrl = "";
//     if (
//       objectData.content.descriptiveNonRepeating.online_media &&
//       objectData.content.descriptiveNonRepeating.online_media.media
//     ) {
//       imageUrl =
//         objectData.content.descriptiveNonRepeating.online_media.media[0]
//           .content;
//     }

//     // Extract date if available
//     let date = "";
//     if (
//       objectData.content.freetext.date &&
//       objectData.content.freetext.date.length > 0
//     ) {
//       date = objectData.content.freetext.date[0].content; // Get the first date
//     }

//     myArray.push({
//       id: objectData.id,
//       title: title,
//       link: objectData.content.descriptiveNonRepeating.record_link,
//       place: currentPlace,
//       dataSource: dataSource,
//       physicalDescriptions: physicalDescriptions,
//       imageUrl: imageUrl,
//       date: date,
//     });
//   } else {
//     myArray.push({
//       id: objectData.id,
//       title: objectData.title,
//       link: objectData.content.descriptiveNonRepeating.record_link,
//       place: currentPlace,
//     });
//   }
// }

//---------------------------DONE------------------------------
// NMNHBIRDS: NMNH - Vertebrate Zoology - Birds Division
// NMNHMAMMALS: NMNH - Vertebrate Zoology - Mammals Division
// NMNHINV: NMNH - Invertebrate Zoology Dept.
// NMNHFISHES: NMNH - Vertebrate Zoology - Fishes Division
// NMNHANTHRO: NMNH - Anthropology Dept.
// NMNHBOTANY: NMNH - Botany Dept.
// NMNHENTO: NMNH - Entomology Dept.
// NMNHMINSCI: NMNH - Mineral Sciences Dept.

// NMNHHERPS: NMNH - Vertebrate Zoology - Herpetology Division

// NADA -------------- NMNHPALEO: NMNH - Paleobiology Dept.

//---------------------------TO DO------------------------------
// ACAH: Archives Center, National Museum of American History
// ACM: Anacostia Community Museum
// CFCHFOLKLIFE: Smithsonian Center for Folklife and Cultural Heritage
// CHNDM: Cooper-Hewitt, National Design Museum
// FBR: Smithsonian Field Book Project
// FSA: Freer Gallery of Art and Arthur M. Sackler Gallery Archives
// FSG: Freer Gallery of Art and Arthur M. Sackler Gallery
// HAC: Smithsonian Gardens
// HMSG: Hirshhorn Museum and Sculpture Garden
// HSFA: Human Studies Film Archives
// NAA: National Anthropological Archives
// NASM: National Air and Space Museum
// NMAAHC: National Museum of African American History and Culture
// NMAfA: Smithsonian National Museum of African Art
// NMAH: Smithsonian National Museum of American History
// NMAI: National Museum of the American Indian

// NMNHEDUCATION: NMNH - Education & Outreach

// NPG: National Portrait Gallery
// NPM: National Postal Museum
// SAAM: Smithsonian American Art Museum
// SI: Smithsonian Institution, Digitization Program Office
// SIA: Smithsonian Institution Archives
// SIL: Smithsonian Libraries
