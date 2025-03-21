package com;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        Library library = Library.getInstance();

        // Factory Pattern - Thêm sách
        Book book1 = BookFactory.createBook("physical", "Harry Potter", "J.K. Rowling", "Fantasy");
        Book book2 = BookFactory.createBook("ebook", "The Great Gatsby", "F. Scott Fitzgerald", "Classic");
        library.addBook(book1);
        library.addBook(book2);

        // Observer Pattern - Đăng ký người dùng
        LibraryUser user1 = new LibraryUser("Alice");
        library.registerObserver(user1);
        library.notifyObservers("A new book is available!");

        // Strategy Pattern - Tìm kiếm sách
        BookSearcher searcher = new BookSearcher();
        searcher.setStrategy(new SearchByTitle());
        List<Book> foundBooks = searcher.search(library.getBooks(), "Harry Potter");
        foundBooks.forEach(Book::display);

        // Decorator Pattern - Mượn sách với tính năng mở rộng
        Borrowable borrow = new ExtendedBorrow(new BasicBorrow());
        borrow.borrowBook();
    }
}