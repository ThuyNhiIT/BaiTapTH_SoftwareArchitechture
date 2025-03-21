package com;

public class AudioBook extends Book {
    public AudioBook(String title, String author, String genre) {
        super(title, author, genre);
    }
    public void display() { System.out.println("Audio Book: " + title); }
}
