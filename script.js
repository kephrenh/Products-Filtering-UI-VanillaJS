import { fetchJSON } from "./functions/api.js";
import { createElement } from "./functions/dom.js";

// Select DOM Elements
const productsWrapper = document.getElementById("products-wrapper");
const checkboxes = document.querySelectorAll(".check");
const filtersContainer = document.getElementById("filters-container");
const searchInput = document.getElementById("search");
const cartCount = document.getElementById("cart-count");

// Init cart item count
let cartItemCount = 0;

// Init product element array
const productElements = [];

// Event listeners for filtering
filtersContainer.addEventListener("change", filterProducts);
searchInput.addEventListener("input", filterProducts);

// Loop over products and create an element
const products = await fetchJSON("./data.json");

/**
 * Description placeholder
 *
 * @param {*} product return an object
 * @returns {HTMLElement} returns an HTML element
 */
function createProductElement(product) {
  const productElement = document.createElement("div");
  productElement.className = "space-y-2 item";
  productElement.innerHTML = `
  <div
    class="bg-gray-100 flex justify-center relative overflow-hidden group cursor-pointer rounded-xl border">
    <img
      src=${product.url}
      alt=${product.name}
      class="w-full h-full object-cover" />
    <button
      class="status bg-black text-white absolute bottom-0 left-0 right-0 text-center py-2 translate-y-full transition group-hover:translate-y-0">
      Add To Cart
    </button>
  </div>
  <p class="text-xl">${product.name}</p>
  <strong>${product.price.toLocaleString()}</strong>
  `;

  productElement.querySelector(".status").addEventListener("click", updateCart);

  return productElement;
}

products.forEach((product) => {
  const productElement = createProductElement(product);
  productElements.push(productElement);
  productsWrapper.append(productElement);
});

// Add or remove item from cart
function updateCart(e) {
  const statusEl = e.target;

  if (statusEl.classList.contains(".added")) {
    // remove from cart
    statusEl.classList.remove(".added");
    statusEl.innerText = "Add To Cart";
    statusEl.classList.add("bg-gray-800");
    statusEl.classList.remove("bg-red-600");

    cartItemCount--;
  } else {
    statusEl.classList.add(".added");
    statusEl.innerText = "Remove From Cart";
    statusEl.classList.remove("bg-gray-800");
    statusEl.classList.add("bg-red-600");

    cartItemCount++;
  }

  // Update cart item count
  cartCount.innerText = cartItemCount.toString();
}

// Filter products by checkboxes and search input
function filterProducts() {
  // Get search term
  const searchTerm = searchInput.value.trim().toLowerCase();
  // Get checked categored
  const checkedCategories = Array.from(checkboxes)
    .filter((check) => check.checked)
    .map((check) => check.id);

  // Loop over products and check for matches
  productElements.forEach((productEl, index) => {
    const product = products[index];

    // Check to see if the product matches the search or the checked categories
    const matchsSearchTerm = product.name.toLowerCase().includes(searchTerm);
    const isInCheckedCategory =
      checkedCategories.length === 0 || checkedCategories.includes(product.category);

    // Show or hide products based on matches
    if (matchsSearchTerm && isInCheckedCategory) {
      productEl.classList.remove("hidden");
    } else {
      productEl.classList.add("hidden");
    }
  });
}
