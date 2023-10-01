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
  // Function to get the value of a specific query parameter from the URL
  const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  // Get the file name from the query parameter
  const file = getQueryParam("file");

  // Load the game using Ruffle
  window.RufflePlayer = window.RufflePlayer || {};
  window.addEventListener("load", (event) => {
    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();
    const container = document.getElementById("game-container");
    container.appendChild(player);
    player.load("../games/" + file);
  });

  // Add title to game-title h1
  const gameTitle = document.getElementById("game-title");
  gameTitle.innerHTML = file.replace(".swf", "").replace(/_/g, " ");
});
