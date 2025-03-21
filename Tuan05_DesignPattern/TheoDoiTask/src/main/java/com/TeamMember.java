package com;

public class TeamMember implements Observer{
    private String name;
    private Subject task;
    public TeamMember(String name) {
        this.name = name;
    }
    @Override
    public void update() {
        if (task == null) {
            System.out.println("Team Member " + name + " has no task to observe.");
            return;
        }
        System.out.println("Team Member " + name + " received update: " + task.getUpdate(this));
    }

    @Override
    public void setSubject(Subject sub) {
        this.task = sub;
    }
}
