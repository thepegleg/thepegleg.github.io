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

// get search query from URL
const getQueryParam = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

const searchQuery = getQueryParam("query");

const loadGames = async (query, noquery = false) => {
  try {
    const response = await fetch("games.json");
    const data = await response.json();

    const container = document.getElementById("container");

    if (noquery) {
      document.getElementById("search-input").value = "";
      // add no query message
      const noQueryMessage = document.createElement("p");
      noQueryMessage.className = "text-center";
      noQueryMessage.textContent = "No query provided.";
      container.appendChild(noQueryMessage);
      return;
    }

    // Create a list group
    const listGroup = document.createElement("ul");
    listGroup.className = "list-group";

    // Create a list group item
    const listGroupItem = document.createElement("li");
    listGroupItem.className = "list-group-item";

    // Filter the data based on the search query
    const relavantGames = [];
    const otherGames = [];
    for (let key in data) {
      for (let file of data[key]) {
        if (file.toLowerCase().includes(query.toLowerCase())) {
          relavantGames.push(file);
        } else if (
          query
            .toLowerCase()
            .split(" ")
            .every((term) => file.toLowerCase().includes(term))
        ) {
          otherGames.push(file);
        }
      }
    }

    if (relavantGames.length === 0 && otherGames.length === 0) {
      listGroupItem.textContent = "No games found.";
      listGroup.appendChild(listGroupItem);
      container.appendChild(listGroup);
      return;
    }

    function compareGamesByClosenessToQuery(query, gameA, gameB) {
      const aTerms = gameA.toLowerCase().split(" ");
      const bTerms = gameB.toLowerCase().split(" ");
      const aMatchCount = aTerms.filter((term) => query.includes(term)).length;
      const bMatchCount = bTerms.filter((term) => query.includes(term)).length;

      // If exact word matches count is different, prioritize the one with more matches
      if (aMatchCount !== bMatchCount) {
        return bMatchCount - aMatchCount;
      }

      // If exact word matches count is the same, prioritize the one with words closer to the beginning of the query
      for (let i = 0; i < query.length; i++) {
        const aIndex = gameA.toLowerCase().indexOf(query.toLowerCase(), i);
        const bIndex = gameB.toLowerCase().indexOf(query.toLowerCase(), i);

        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
      }

      // If exact word matches and their positions are the same, use lexicographic order as a tiebreaker
      return gameA.localeCompare(gameB);
    }

    relavantGames.sort((a, b) => compareGamesByClosenessToQuery(query, a, b));
    otherGames.sort((a, b) => compareGamesByClosenessToQuery(query, a, b));

    // Add the games to the list group
    relavantGames.forEach((game) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = game.slice(0, -4).replace(/_/g, " ");
      // add data-file attribute to the list item
      listItem.setAttribute("data-file", game);
      listGroup.appendChild(listItem);
    });

    otherGames.forEach((game) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = game.slice(0, -4).replace(/_/g, " ");
      // add data-file attribute to the list item
      listItem.setAttribute("data-file", game);
      listGroup.appendChild(listItem);
    });

    container.appendChild(listGroup);

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
    console.error(error);
  }
};

loadGames(searchQuery, searchQuery === null);
// Add the search query to the search input
const searchInput = document.getElementById("search-input");
searchInput.value = searchQuery;
