"use strict";

// add search button click event
document.getElementById("search-button").addEventListener("click", () => {
  const query = document.getElementById("search-input").value;
  if (query === "") {
    return;
  }
  // open search page with query as query parameter
  window.location.href = `search.html?query=${query}`;
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const gamesPerPage = 10; // Number of games to display per page

  // Function to fetch and display games based on the selected key and page number
  const loadGamesByLetterAndPage = async (key, page) => {
    try {
      const response = await fetch("games.json");
      const data = await response.json();

      const games = data[key]?.sort() || [];
      const totalPages = Math.ceil(games.length / gamesPerPage);
      const startIndex = (page - 1) * gamesPerPage;
      const endIndex = startIndex + gamesPerPage;
      const currentGames = games.slice(startIndex, endIndex);

      container.innerHTML = "";

      if (currentGames.length === 0) {
        container.innerHTML = `<p>No games found for key ${key}.</p>`;
      } else {
        const list = document.createElement("ul");
        list.className = "list-group";

        currentGames.forEach((game) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item";
          listItem.textContent = game.slice(0, -4).replace(/_/g, " ");
          // add data-file attribute to the list item
          listItem.setAttribute("data-file", game);
          list.appendChild(listItem);
        });

        container.appendChild(list);

        // Add pagination
        const paginationContainer = document.createElement("nav");
        // add id to the pagination container
        paginationContainer.setAttribute("id", "pagination-container");
        paginationContainer.setAttribute("aria-label", "Page navigation");
        const paginationList = document.createElement("ul");
        paginationList.className = "pagination justify-content-center";

        for (let i = 1; i <= totalPages; i++) {
          const paginationItem = document.createElement("li");
          paginationItem.className = "page-item";
          const paginationLink = document.createElement("a");
          paginationLink.className = "page-link";
          paginationLink.textContent = i;
          paginationLink.href = "#";
          paginationLink.addEventListener("click", () => {
            loadGamesByLetterAndPage(key, i);
          });
          paginationItem.appendChild(paginationLink);
          paginationList.appendChild(paginationItem);
        }

        paginationContainer.appendChild(paginationList);
        container.appendChild(paginationContainer);
      }

      // Function to handle click event for file buttons
      const handleFileButtonClick = (event) => {
        const clickedFile = event.target.dataset.file;
        // Load the details.html page and pass the clickedFile as a query parameter
        window.location.href = `playGame.html?file=${encodeURIComponent(
          clickedFile
        )}`;
      };

      // Attach click event to file buttons
      const fileButtons = document.querySelectorAll(".list-group-item");
      fileButtons.forEach((button) => {
        button.addEventListener("click", handleFileButtonClick);
      });
    } catch (error) {
      console.error("Error loading games:", error);
    }
  };

  // Function to create buttons dynamically for each key in the dictionary
  const createLetterButtons = async () => {
    try {
      const response = await fetch("games.json");
      const data = await response.json();
      const keys = Object.keys(data).sort();

      const letterButtonsContainer = document.getElementById("letter-buttons");

      for (let key of keys) {
        const letterButton = document.createElement("button");
        letterButton.className = "btn btn-outline-primary letter-button";
        letterButton.textContent = key;
        letterButton.addEventListener("click", () => {
          loadGamesByLetterAndPage(key, 1); // Load first page when a key is selected
        });

        letterButtonsContainer.appendChild(letterButton);

        if (key === "A") {
          letterButton.click(); // Load first page when the first key is created
        }
      }
    } catch (error) {
      console.error("Error loading games:", error);
    }
  };

  // Call the function with the exact keys from the dictionary
  createLetterButtons(); // Add the exact keys from your dictionary here
});
