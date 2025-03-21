package com;

import java.util.List;

public class SearchByGenre implements SearchStrategy {
    public List<Book> search(List<Book> books, String keyword) {
        return books.stream().filter(b -> b.getGenre().equalsIgnoreCase(keyword)).toList();
    }
}
