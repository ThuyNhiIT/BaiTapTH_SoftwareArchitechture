package com.theodoicophieu;

import java.util.ArrayList;
import java.util.List;

public class Stock implements Subject{

    private String name;
    private double price;
    private boolean changed;
    private String message;
    private List<Observer> observers = new ArrayList<>();

    public Stock(String name, double price) {
        this.name = name;
        this.price = price;
    }

    @Override
    public void register(Observer obj) {
        if(obj == null) throw new NullPointerException("Null Observer");
        {
            if(!observers.contains(obj)) observers.add(obj);
        }
    }

    @Override
    public void unregister(Observer obj) {
        {
            observers.remove(obj);
        }
    }

    @Override
    public void notifyObservers() {
        List<Observer> observersLocal;
        synchronized (this) {
            if (!changed)
                return;
            observersLocal = new ArrayList<>(this.observers);
            this.changed = false;
        }
        for (Observer observer : observersLocal) {
            observer.update();
        }
    }

    @Override
    public Object getUpdate(Observer obj) {
        return "Stock " + name + " price: " + price;
    }

    public void setPrice(double newPrice) {
        this.price = newPrice;
        this.changed = true;
        notifyObservers();
    }

    public void postMessage(String msg) {
        System.out.println("Message Posted to Topic: " + msg);
        this.message = msg;
        this.changed = true;
        notifyObservers();
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }
}
