const titleInput = document.querySelector(".title-input");
const detailsInput = document.querySelector(".note-details");
const addButton = document.querySelector(".add-btn");
const listEl = document.querySelector(".list-box");
const categorySelect = document.querySelector(".category-select"); 
const searchInput = document.querySelector(".search-input");

function saveNotesToLocalStorage(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function getNotesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function getCategoryColor(category) {
  switch (category) {
    case "easy":
      return "green"
    case "medium":
      return "yellow"; 
    case "hard":
      return "red"; 
    default:
      return "green"; 
  }
}

function renderNote(noteObj) {
  const { id, title, details, category } = noteObj;

  const noteItem = document.createElement("li");
  noteItem.classList = "note";
  noteItem.setAttribute("data-id", id);

  const noteTitle = document.createElement("h3");
  noteTitle.classList = "note-title";
  noteTitle.textContent = title;

  const noteDetails = document.createElement("p");
  noteDetails.textContent = details;

  const noteCategory = document.createElement("span");
  
  noteCategory.style.backgroundColor = getCategoryColor(category); 
  noteCategory.textContent = ` ${category}`;
   noteCategory.classList = 'note-category'

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList = "delete-btn";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList = "edit-btn";

  noteItem.appendChild(noteTitle);
  noteItem.appendChild(noteDetails);
  noteItem.appendChild(deleteBtn);
  noteItem.appendChild(editBtn);
  noteItem.appendChild(noteCategory);

  listEl.appendChild(noteItem);

  deleteBtn.addEventListener("click", function () {
    alert("Are you sure you want to delete this note?");
    const id = parseInt(noteItem.getAttribute("data-id"));
    let notes = getNotesFromLocalStorage();
    notes = notes.filter(n => n.id !== id);
    saveNotesToLocalStorage(notes);
    noteItem.remove();
  });

  editBtn.addEventListener("click", function () {
    const newTitle = prompt("Enter a new title:", noteTitle.textContent);
    const newDetails = prompt("Enter new details:", noteDetails.textContent);
    const newCategory = prompt("Enter new category (easy, medium, hard):", category);

    if (newTitle && newDetails && newCategory) {
      noteTitle.textContent = newTitle;
      noteDetails.textContent = newDetails;
      noteCategory.textContent = `Category: ${newCategory}`;
      noteCategory.style.backgroundColor = getCategoryColor(newCategory); 

      let notes = getNotesFromLocalStorage();
      const index = notes.findIndex(n => n.id === id);
      if (index !== -1) {
        notes[index].title = newTitle;
        notes[index].details = newDetails;
        notes[index].category = newCategory;
        saveNotesToLocalStorage(notes);
      }
    }
  });
}

addButton.onclick = function () {
  const title = titleInput.value.trim();
  const details = detailsInput.value.trim();
  const category = categorySelect.value; 
  if (!title) {
    alert("Please enter a title name");
    return;
  }
  if (!details) {
    alert("Please enter details");
    return;
  }

  const noteObj = {
    id: Date.now(),
    title: title,
    details: details,
    category: category 
  };

  const notes = getNotesFromLocalStorage();
  notes.push(noteObj);
  saveNotesToLocalStorage(notes);

  renderNote(noteObj);

  titleInput.value = "";
  detailsInput.value = "";
  categorySelect.value = "easy"; 
};

window.onload = function () {
  const notes = getNotesFromLocalStorage();
  notes.forEach(note => renderNote(note));
};

titleInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addButton.click();
  }
});

detailsInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addButton.click();
  }
});

const filterSelect = document.querySelector(".filter-select"); 

filterSelect.addEventListener("change", function () {
  const selectedCategory = filterSelect.value;
  const notes = getNotesFromLocalStorage();
  listEl.innerHTML = ""; 

  let filteredNotes = notes;

  if (selectedCategory !== "all") {
    filteredNotes = notes.filter(note => note.category === selectedCategory); 
  }

  filteredNotes.forEach(note => renderNote(note));
});



searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const notes = getNotesFromLocalStorage();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm)
  );

  listEl.innerHTML = ""; 
  filteredNotes.forEach(note => renderNote(note));
});