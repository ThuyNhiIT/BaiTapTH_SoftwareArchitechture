package com.theodoicophieu;

public class Investor implements  Observer{
    private String name;
    private Subject stock;

    public Investor(String name) {
        this.name = name;
    }


    @Override
    public void update() {
        if (stock == null) {
            System.out.println("Investor " + name + " has no stock to observe.");
            return;
        }
        System.out.println("Investor " + name + " received update: " + stock.getUpdate(this));
    }

    @Override
    public void setSubject(Subject sub) {
        this.stock = sub;
    }
}
