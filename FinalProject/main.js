//   Search Input
const locations = [
    "Imphal", "Tamenglong", "Tamei", "Kakching", "Bishnupur",
    "Ukhrul", "Senapati", "Churchandpur", "Nungba","Tengnoupal"
  ];
  const buses = [
    {
      id: 1,
      from: "tamenglong",
      to: "imphal",
      name: "GAISUAKNGAM",
      time: "06:00 AM",
      seats: Array(35).fill(false) // false = available
    },
    {
      id: 2,
      from: "imphal",
      to: "tamenglong",
      name: "Suaihiamgan",
      time: "06:00 PM",
      seats: Array(30).fill(true).map((v, i) => i % 4 === 0) // some booked
    },
    {
      id: 3,
      from: "imphal",
      to: "nungba",
      name: "Nungba Travels",
      time: "8:30 AM",
      seats: Array(20).fill(false)
    }
  ];


  function setupAutocomplete(inputId, suggestionBoxId) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionBoxId);

    input.addEventListener('input', () => {
      const value = input.value.toLowerCase();
      suggestions.innerHTML = '';
      if (!value) {
        suggestions.classList.add('hidden');
        return;
      }

      const matches = locations.filter(loc => loc.toLowerCase().includes(value));
      if (matches.length === 0) {
        suggestions.classList.add('hidden');
        return;
      }

      matches.forEach(loc => {
        const li = document.createElement('li');
        li.textContent = loc;
        li.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer';
        li.addEventListener('click', () => {
          input.value = loc;
          suggestions.classList.add('hidden');
        });
        suggestions.appendChild(li);
      });

      suggestions.classList.remove('hidden');
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!suggestions.contains(e.target) && e.target !== input) {
        suggestions.classList.add('hidden');
      }
    });
  }

  setupAutocomplete("from", "fromSuggestions");
  setupAutocomplete("to", "toSuggestions");
  const form = document.querySelector("form");
  const errorMsg = document.getElementById("errorMsg");
  const busResults = document.getElementById("busResults");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const from = document.getElementById("from").value.trim().toLowerCase();
    const to = document.getElementById("to").value.trim().toLowerCase();

    if (from && to && from === to) {
      errorMsg.classList.remove("hidden");
      errorMsg.classList.remove("shake");
      void errorMsg.offsetWidth;
      errorMsg.classList.add("shake");
      return;
    } else {
      errorMsg.classList.add("hidden");
      errorMsg.classList.remove("shake");
    }
    // // Pre-fill booking form inputs
    // document.getElementById("fromInput").value = from;
    // document.getElementById("toInput").value = to;

    // Filter matching buses
    const matched = buses.filter(bus => bus.from === from && bus.to === to);
    renderBuses(matched);
  });

  const bookings = [];
  function renderBuses(busList) {
    busResults.innerHTML = "";
  
    if (busList.length === 0) {
      busResults.innerHTML = `<p class="text-center text-gray-500">No buses available for this route.</p>`;
      return;
    }
  
    busList.forEach(bus => {
      const busDiv = document.createElement("div");
      busDiv.className = "border rounded-xl p-4 bg-white shadow";
  
      const seatsContainer = document.createElement("div");
      seatsContainer.className = "grid grid-cols-5 gap-2 mt-3";
  
      bus.seats.forEach((booked, i) => {
        const seat = document.createElement("div");
        seat.className = `text-sm text-center py-2 rounded cursor-pointer select-none ${
          booked ? "bg-red-400 text-white cursor-not-allowed" : "bg-green-200 text-black hover:bg-green-300"
        }`;
        seat.textContent = `Seat ${i + 1}`;
  
        seatsContainer.appendChild(seat);
      });
  
      busDiv.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800">${bus.name}</h3>
        <p class="text-sm text-gray-500">Departure: ${bus.time}</p>
      `;
      busDiv.appendChild(seatsContainer);
      busResults.appendChild(busDiv);
    });
  }