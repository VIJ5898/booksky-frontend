const addPopupButton = document.getElementById("add-popup-button");
const popupOverlay = document.querySelector(".popup-overlay");
const popupBox = document.querySelector(".popup-box");
const cancelPopupButton = document.getElementById("cancel-popup");
const addBookButton = document.getElementById("add-book");

const titleInput = document.getElementById("book-title-input");
const authorInput = document.getElementById("book-author-input");
const descriptionInput = document.getElementById("book-description-input");
const container = document.querySelector(".container");

// 🌐 Live backend URL
const API_URL = "https://booksky-api.onrender.com/api/books";

// Show popup
addPopupButton.addEventListener("click", () => {
  popupOverlay.style.display = "block";
  popupBox.style.display = "block";
});

// Hide popup
cancelPopupButton.addEventListener("click", (e) => {
  e.preventDefault();
  popupOverlay.style.display = "none";
  popupBox.style.display = "none";
});

// Add a new book
addBookButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !author || !description) {
    alert("Please fill in all fields.");
    return;
  }

  addBookButton.innerText = "Adding...";
  addBookButton.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, description }),
    });

    const newBook = await response.json();
    console.log("Book added:", newBook);

    appendBookToUI(newBook);

    // Reset form and UI
    titleInput.value = "";
    authorInput.value = "";
    descriptionInput.value = "";
    popupOverlay.style.display = "none";
    popupBox.style.display = "none";
  } catch (err) {
    console.error("Error adding book:", err);
    alert("Failed to add book. Try again.");
  }

  addBookButton.innerText = "Add";
  addBookButton.disabled = false;
});

// Delete book
async function deleteBook(id, bookDiv) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    bookDiv.remove();
  } catch (err) {
    console.error("Error deleting book:", err);
    alert("Failed to delete book.");
  }
}

// Render a book card
function appendBookToUI(book) {
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book-container");

  bookDiv.innerHTML = `
    <h2>${book.title}</h2>
    <h5>${book.author}</h5>
    <p>${book.description}</p>
    <button>Delete</button>
  `;

  const deleteBtn = bookDiv.querySelector("button");
  deleteBtn.addEventListener("click", () => deleteBook(book._id, bookDiv));

  container.appendChild(bookDiv);
}

// Load books from backend
window.onload = async () => {
  try {
    const res = await fetch(API_URL);
    const books = await res.json();
    console.log("Books loaded:", books);
    books.forEach(book => appendBookToUI(book));
  } catch (err) {
    console.error("Error loading books:", err);
    alert("Failed to load books.");
  }
};
