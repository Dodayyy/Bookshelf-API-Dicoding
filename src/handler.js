const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name == null) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      .code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  };

  books.push(newBook);

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    .code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const filteredBooks = books.filter((book) => {
    const conditions = [name ? book.name.toLowerCase().includes(name.toLowerCase()) : true, reading === undefined || book.reading === (reading === '1'), finished === undefined || book.finished === (finished === '1')];
    return conditions.every(Boolean);
  });

  return {
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  };
};
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((b) => b.id === bookId);

  if (book) {
    return {
      status: 'success',
      data: {
        book
      }
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      .code(400);
  }

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      })
      .code(404);
  }

  Object.assign(book, { name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt: new Date().toISOString() });

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    .code(200);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      })
      .code(404);
  }

  books.splice(index, 1);

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    .code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};
