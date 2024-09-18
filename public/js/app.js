// Get all menu buttons
const menuButtons = document.querySelectorAll(".menu-button");

// Loop through each menu button and attach the event listener
menuButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevents the event from bubbling up to the document

    // Close other open dropdowns
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      if (menu !== this.nextElementSibling) {
        menu.style.display = "none";
      }
    });

    // Toggle the visibility of the dropdown menu for the clicked button
    const dropdownMenu = this.nextElementSibling;
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });
});

// Hide dropdown when clicking outside
document.addEventListener("click", function () {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.style.display = "none";
  });
});
