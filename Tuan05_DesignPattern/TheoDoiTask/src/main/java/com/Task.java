package com;

import java.util.ArrayList;
import java.util.List;

public class Task implements Subject{

    private String name;
    private String status;
    private boolean changed;
    private List<Observer> observers = new ArrayList<>();

    public Task(String name, String status) {
        this.name = name;
        this.status = status;
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
        return "Task " + name + " status: " + status;
    }

    public void setStatus(String newStatus) {
        this.status = newStatus;
        this.changed = true;
        notifyObservers();
    }
}
