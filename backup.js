const _InputJudul = document.getElementById("inputBookTitle"); // input judul
const _InputBookAuthor = document.getElementById("inputBookAuthor"); // input penulis
const _InputBookYear = document.getElementById("inputBookYear"); // input tahun
const CheckBoxsBooks = document.getElementById("inputBookIsComplete"); // tombol selesai baca
const ButtonSubmit = document.getElementById("bookSubmit"); // tombol masukkan
const FormInputBuku = document.getElementById("inputBook"); // form input

const Books = [];
const RENDER_EVENT = "render-books";

document.addEventListener("DOMContentLoaded", function () {
  FormInputBuku.addEventListener("submit", function (e) {
    e.preventDefault();
    addBooks();
    console.log(Books);
  });

  function InsertBook(id, judul, author, year, isComplete) {
    return {
      id,
      judul,
      author,
      year,
      isComplete,
    };
  }

  function GenerateID() {
    return +new Date();
  }

  function inputBook(books) {
    const Title = document.createElement("h3");
    Title.innerText = books.judul; //

    const Author = document.createElement("p");
    Author.innerText = books.author;

    const Year = document.createElement("p");
    Year.innerText = books.year;

    const BookContainer = document.createElement("article");
    BookContainer.classList.add("book_item");
    BookContainer.append(Title, Author, Year);

    // action
    const ActionContainer = document.createElement("div");
    ActionContainer.classList.add("action"); //

    const ButtonGreen = document.createElement("button");
    ButtonGreen.classList.add("green");
    ButtonGreen.innerText = "✅ Selesai dibaca ";

    const ButtonRed = document.createElement("button");
    ButtonRed.classList.add("red");
    ButtonRed.innerText = "🗑️Hapus Buku";

    ActionContainer.append(ButtonGreen, ButtonRed);
    BookContainer.append(ActionContainer);

    if (books.isComplete) {
      ButtonGreen.innerText = "🔁Baca Ulang ?? ";
      ButtonGreen.addEventListener("click", function () {
        ChangeStatus(books.id);
      });
    } else {
      ButtonGreen.innerText = "✅ pilih selesai ";
      ButtonGreen.addEventListener("click", function () {
        ChangeStatus(books.id);
      });
    }

    return BookContainer;
  }

  function ChangeStatus(bookId) {
    const IdTarget = findData(bookId);
    if (IdTarget == null) return;

    IdTarget.isComplete = !IdTarget.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function findData(bookId) {
    for (const book of Books) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
  }

  //Add Books
  function addBooks() {
    const ResultJudul = _InputJudul.value;
    const ResultAuthor = _InputBookAuthor.value;
    const ResultYear = _InputBookYear.value;
    const ResultCheckBox = CheckBoxsBooks.checked;

    const IdBooks = GenerateID();
    const BooksData = InsertBook(IdBooks, ResultJudul, ResultAuthor, ResultYear, ResultCheckBox);
    Books.push(BooksData);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  //   fungsi hapus
  function DeleteBooksData() {}

  document.addEventListener(RENDER_EVENT, function () {
    const unCompletedRead = document.getElementById("incompleteBookshelfList");
    unCompletedRead.innerHTML = "";

    const CompletedRead = document.getElementById("completeBookshelfList");
    CompletedRead.innerHTML = "";

    for (const book of Books) {
      const bookElement = inputBook(book);
      if (!book.isComplete) {
        unCompletedRead.append(bookElement);
      } else {
        CompletedRead.append(bookElement);
      }
    }
  });
});
