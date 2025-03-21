package com;

import java.util.List;

public class SearchByTitle implements SearchStrategy {
    public List<Book> search(List<Book> books, String keyword) {
        return books.stream().filter(b -> b.getTitle().equalsIgnoreCase(keyword)).toList();
    }
}
