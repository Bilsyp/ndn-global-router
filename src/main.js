import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.motion/dist/leaflet.motion.js";
let map = L.map("map").setView([-6.2349, 106.9896], 5);
let selectedValues = [];

function initMap() {
  // Inisialisasi peta
  L.Polygon;
  L.Polyline;
  L.FeatureGroup;
  L.Util;
  const data = [
    {
      router: "Indonesia",
      coordinates: [-6.89259, 107.61056],
      nfdStatus: "https://testbed-ndn-rg.stei.itb.ac.id/",
      code: "id",
    },
    {
      router: "India",
      coordinates: [17.44598, 78.35136],
      nfdStatus: "https://ndntestbed.iiit.ac.in/",
      code: "in",
    },
    {
      router: "Japan",
      coordinates: [34.68714, 135.5016],
      nfdStatus: "https://ndn.ist.osaka-u.ac.jp/",
      code: "jp",
    },
    {
      router: "Portugal",
      coordinates: [40.63106, -8.65846],
      nfdStatus: "http://selficn.av.it.pt/",
      code: "pt",
    },
    {
      router: "Portugal-2",
      coordinates: [41.55054, -8.42654],
      nfdStatus: "http://netlab.gcom.di.uminho.pt/",
      code: "pt",
    },
    {
      router: "Switzerland",
      coordinates: [47.5488, 7.58781],
      nfdStatus: "http://selficn.av.it.pt/",
      code: "gr",
    },
    {
      router: "Brazil",
      coordinates: [-12.9935, -38.5211],
      nfdStatus: "https://ufba.testbed.named-data.net/",
      code: "br",
    },
    {
      router: "North America",
      coordinates: [38.64788, -90.3022],
      nfdStatus: "https://wundngw.arl.wustl.edu/",
      code: "us",
    },
    {
      router: "North America-2",
      coordinates: [34.06715, -118.44595],
      nfdStatus: "http://suns.cs.ucla.edu/",
      code: "us",
    },
    {
      router: "Italy",
      coordinates: [45.49756, 9.16767],
      nfdStatus: "https://afa.testbed.named-data.net/",
      code: "it",
    },
  ];

  // Tambahkan layer peta dari OpenStreetMap
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Iterasi melalui data dan tambahkan marker untuk setiap item
  const router = document.getElementById("router");
  const simulation = document.getElementById("simulation");
  const route = document.getElementById("route");
  const restart = document.getElementById("restart");

  data.forEach((item) => {
    const options = document.createElement("option");
    options.textContent = item.router;
    options.value = item.coordinates;
    router.appendChild(options);

    var greenIcon = L.icon({
      iconUrl: "/wifi.png",
      iconSize: [50, 50],
    });

    // Tambahkan marker ke peta
    const marker = L.marker([item.coordinates[0], item.coordinates[1]], {
      icon: greenIcon,
    }).addTo(map);

    // Tambahkan popup dengan informasi router dan tautan nfdStatus
    marker.bindPopup(
      `
      <div>
      <img src="https://flagcdn.com/256x192/${item.code}.png" width="50" height="40" alt="${item.router}">
      <br/>
      <b>${item.router}</b><br><a href="${item.nfdStatus}" target="_blank">NFD Status</a>
      
      </div>`
    );
  });
  router.addEventListener("change", (e) => {
    // Mendapatkan nilai koordinat terpilih
    const selectedCoordinates = e.target.value;
    // Menambahkan nilai terpilih ke dalam array jika belum ada

    // Membersihkan elemen route sebelum menambahkan yang baru
    route.innerHTML = "";
    selectedValues.push([selectedCoordinates]);
    // Menambahkan nilai terpilih ke dalam elemen route
    selectedValues.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      route.appendChild(li);
    });
  });

  simulation.addEventListener("click", Lines);
  restart.addEventListener("click", () => {
    window.location.reload();
  });

  // zoom the map to the polygon
  map.on("click", onMapClick);
}
function Lines() {
  let coordinatesArray = selectedValues.map((latlng) =>
    latlng[0].split(",").map(Number)
  );
  let latlngs = coordinatesArray;
  L.motion
    .polyline(
      [latlngs],
      {
        color: "#1E3888",
      },
      {
        auto: true,
        duration: 30000,
        easing: L.Motion.Ease.easeInOutQuart,
      },
      {
        // showMarker: true,
        removeOnEnd: true,
        showMarker: true,
        icon: L.icon({
          iconUrl: "/email.png",
          iconSize: [50, 50],
        }),
      }
    )
    .motionSpeed(100)
    .addTo(map);
}
function onMapClick(e) {
  const findRouter = document.getElementById("findRouter");
  let popup = L.popup()
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
  const inputString = e.latlng.toString();
  const regex = /-?\d+\.\d+/g;
  const result = inputString.match(regex).map(Number);

  map.setView(result, 5);
  fetch(`https://ndn-fch.named-data.net/?lat=${result[0]}&lon=${result[1]}`)
    .then((res) => res.text())
    .then((response) => {
      findRouter.textContent =
        response == "" || response == undefined ? "Loading" : response;
    });
}

async function getMyIpGeolocation() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      city: data.city,
      region: data.region,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    };
  } catch (error) {
    console.error("Error fetching IP geolocation:", error.message);
    return null;
  }
}

// Example usage:

function start() {
  getMyIpGeolocation()
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", initMap);
