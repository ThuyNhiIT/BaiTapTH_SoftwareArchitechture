package com;

public class EBook extends Book {
    public EBook(String title, String author, String genre) {
        super(title, author, genre);
    }
    public void display() { System.out.println("E-Book: " + title); }
}
