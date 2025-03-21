package com;

public class BookFactory {
    public static Book createBook(String type, String title, String author, String genre) {
        return switch (type.toLowerCase()) {
            case "physical" -> new PhysicalBook(title, author, genre);
            case "ebook" -> new EBook(title, author, genre);
            case "audiobook" -> new AudioBook(title, author, genre);
            default -> throw new IllegalArgumentException("Unknown book type");
        };
    }
}