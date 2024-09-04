document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const incompleteBookshelf = document.getElementById('incomplete-bookshelf');
    const completeBookshelf = document.getElementById('complete-bookshelf');
    const searchInput = document.getElementById('search');
    const editModal = document.getElementById('edit-modal');
    const editTitle = document.getElementById('edit-title');
    const editAuthor = document.getElementById('edit-author');
    const editYear = document.getElementById('edit-year');
    const saveButton = document.getElementById('save-button');
    const incompleteNoBooks = document.getElementById('incomplete-no-books');
    const completeNoBooks = document.getElementById('complete-no-books');

    const booksKey = 'BOOKSHELF_APPS';
    let books = JSON.parse(localStorage.getItem(booksKey)) || [];
    let currentEditBookId = null;

    const saveBooks = () => {
        localStorage.setItem(booksKey, JSON.stringify(books));
    };

    const createBookElement = (book) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <div>
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p>${book.year}</p>
            </div>
        `;

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            currentEditBookId = book.id;
            editTitle.value = book.title;
            editAuthor.value = book.author;
            editYear.value = book.year;
            editModal.style.display = 'flex';
        });

        const moveButton = document.createElement('button');
        moveButton.classList.add('move-button');
        moveButton.textContent = book.isComplete ? 'Belum Selesai' : 'Selesai';
        moveButton.addEventListener('click', () => {
            book.isComplete = !book.isComplete;
            renderBooks();
            saveBooks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.addEventListener('click', () => {
            books = books.filter(b => b.id !== book.id);
            renderBooks();
            saveBooks();
        });

        const buttonsContainer = document.createElement('div');
        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(moveButton);
        buttonsContainer.appendChild(deleteButton);

        bookElement.appendChild(buttonsContainer);

        return bookElement;
    };

    const renderBooks = () => {
        incompleteBookshelf.innerHTML = '';
        completeBookshelf.innerHTML = '';

        const searchQuery = searchInput.value.toLowerCase();

        const incompleteBooks = books.filter(book => !book.isComplete && book.title.toLowerCase().includes(searchQuery));
        const completeBooks = books.filter(book => book.isComplete && book.title.toLowerCase().includes(searchQuery));

        incompleteNoBooks.style.display = incompleteBooks.length === 0 ? 'block' : 'none';
        completeNoBooks.style.display = completeBooks.length === 0 ? 'block' : 'none';

        incompleteBooks.forEach(book => {
            const bookElement = createBookElement(book);
            incompleteBookshelf.appendChild(bookElement);
        });

        completeBooks.forEach(book => {
            const bookElement = createBookElement(book);
            completeBookshelf.appendChild(bookElement);
        });
    };

    bookForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = parseInt(document.getElementById('year').value, 10);

        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete: false
        };

        books.push(newBook);
        renderBooks();
        saveBooks();

        bookForm.reset();
    });

    saveButton.addEventListener('click', () => {
        const updatedTitle = editTitle.value;
        const updatedAuthor = editAuthor.value;
        const updatedYear = parseInt(editYear.value, 10);

        books = books.map(book => {
            if (book.id === currentEditBookId) {
                return {
                    ...book,
                    title: updatedTitle,
                    author: updatedAuthor,
                    year: updatedYear
                };
            }
            return book;
        });

        renderBooks();
        saveBooks();
        editModal.style.display = 'none';
    });

    searchInput.addEventListener('input', renderBooks);

    editModal.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    renderBooks();
});