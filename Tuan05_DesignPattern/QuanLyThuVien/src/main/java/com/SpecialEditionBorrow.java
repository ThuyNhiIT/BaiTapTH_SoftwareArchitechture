package com;

public class SpecialEditionBorrow implements Borrowable {
    private Borrowable borrowable;

    public SpecialEditionBorrow(Borrowable borrowable) {
        this.borrowable = borrowable;
    }

    public void borrowBook() {
        borrowable.borrowBook();
        System.out.println("Special edition book requested");
    }
}