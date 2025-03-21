package com;

public class LibraryUser implements Observer {
    private String name;

    public LibraryUser(String name) {
        this.name = name;
    }

    public void update(String message) {
        System.out.println("Notification for " + name + ": " + message);
    }
}