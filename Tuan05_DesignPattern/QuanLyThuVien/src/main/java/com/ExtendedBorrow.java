package com;

public class ExtendedBorrow implements Borrowable {
    private Borrowable borrowable;

    public ExtendedBorrow(Borrowable borrowable) {
        this.borrowable = borrowable;
    }

    public void borrowBook() {
        borrowable.borrowBook();
        System.out.println("Extended borrowing period granted");
    }
}
