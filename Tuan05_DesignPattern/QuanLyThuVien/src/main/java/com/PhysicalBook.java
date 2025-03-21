package com;

public class PhysicalBook extends Book {
    public PhysicalBook(String title, String author, String genre) {
        super(title, author, genre);
    }
    public void display() { System.out.println("Physical Book: " + title); }
}