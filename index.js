//pemanggilan elemen HTML
const _InputJudul = document.getElementById("inputBookTitle"); // input judul
const _InputBookAuthor = document.getElementById("inputBookAuthor"); // input penulis
const _InputBookYear = document.getElementById("inputBookYear"); // input tahun
const CheckBoxsBooks = document.getElementById("inputBookIsComplete"); // tombol selesai baca
const ButtonSubmit = document.getElementById("bookSubmit"); // tombol masukkan
const FormInputBuku = document.getElementById("inputBook"); // form input
const SearchInput = document.getElementById("searchBookTitle"); // kolom input cari buku
const ButtonSearch = document.getElementById("searchSubmit"); // button cari buku
const FormSearchBook = document.getElementById("searchBook"); // form cari buku

const Books = [];
const RENDER_EVENT = "render-books";
const SAVE_DATA = "save-data";
const STORAGE_KEY = "books-data";

document.addEventListener("DOMContentLoaded", function () {
  FormInputBuku.addEventListener("submit", function (e) {
    e.preventDefault();
    addBooks();
  });

  // ButtonSearch.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   findBook();
  // });

  // function findBook() {
  //   const Filter = Books.filter((item) => {
  //     return item.judul.include(SearchInput);
  //   });
  //   console.log(Filter);
  // }

  // format penyimpanan data yg berupa objek
  function InsertBook(id, judul, author, year, isComplete) {
    return {
      id,
      judul,
      author,
      year,
      isComplete,
    };
  }

  //utk generate ID
  function GenerateID() {
    return +new Date();
  }

  //function utk ubah state / status isComplete
  function ChangeStatus(bookId) {
    const IdTarget = findData(bookId);
    if (IdTarget == null) return;

    IdTarget.isComplete = !IdTarget.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    SaveChange();
  }

  // function utk mencari data buku sesuai ID
  function findData(bookId) {
    for (const book of Books) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
  }

  // function utk cari Index dari data buku
  function findBookIndex(bookId) {
    for (const index in Books) {
      if (Books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  // function hapus buku
  function DeleteDataBooks(bookId) {
    const IdTarget = findBookIndex(bookId);

    if (IdTarget === -1) return;

    Books.splice(IdTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    SaveChange();
  }

  //Buat elemen dalam HTML
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
      ButtonRed.addEventListener("click", function () {
        DeleteDataBooks(books.id);
      });
    } else {
      ButtonGreen.innerText = "✅ pilih selesai ";
      ButtonGreen.addEventListener("click", function () {
        ChangeStatus(books.id);
      });
      ButtonRed.addEventListener("click", function () {
        DeleteDataBooks(books.id);
      });
    }

    return BookContainer;
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
    SaveChange();
  }

  // function cek browser support localstorage
  function CheckLocaleStorage() {
    if (typeof Storage === "undefined") {
      alert("browser ini tidak support local storage");
      return false;
    }
    return true;
  }

  //function utk saveData ke Local storage
  function SaveChange() {
    if (CheckLocaleStorage()) {
      const parsing = JSON.stringify(Books);
      localStorage.setItem(STORAGE_KEY, parsing);
      document.dispatchEvent(new Event(SAVE_DATA));
    }
  }

  // function get data dari local storage
  function GetdatafromLocalStorage() {
    const LocalSData = localStorage.getItem(STORAGE_KEY);
    let Data = JSON.parse(LocalSData);

    if (Data !== null) {
      for (const book of Data) {
        Books.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(SAVE_DATA, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

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
  if (CheckLocaleStorage()) {
    GetdatafromLocalStorage();
  }
  // console.log(Books);
});
