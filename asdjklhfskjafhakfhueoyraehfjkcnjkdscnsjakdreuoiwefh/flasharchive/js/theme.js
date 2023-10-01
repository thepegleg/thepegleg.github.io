"use strict";

// Function to toggle the theme
const toggleTheme = () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
};

// Function to set the theme
const setTheme = (theme) => {
  // Set the theme for the whole document
  document.documentElement.setAttribute("data-bs-theme", theme);
  // Save the theme to local storage
  localStorage.setItem("theme", theme);

  // Update the button text and style
  const button = document.getElementById("themeswitch");
  button.innerHTML = theme === "light" ? "Dark" : "Light";
  button.classList.toggle("btn-outline-light", theme === "dark");
  button.classList.toggle("btn-outline-secondary", theme === "light");
};

// Function to initialize the theme
const initializeTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme) {
    setTheme(theme);
  } else {
    setTheme("dark");
  }
};

// Add click event listener to the button
document.getElementById("themeswitch").addEventListener("click", toggleTheme);

// Call the initializeTheme function when the DOM is ready
document.addEventListener("DOMContentLoaded", initializeTheme);
