package com;

public class Main {
    public static void main(String[] args) {

        Task task1 = new Task("Develop Feature A", "Pending");
        Task task2 = new Task("Fix Bug #123", "In Progress");

        TeamMember member1 = new TeamMember("Alice");
        TeamMember member2 = new TeamMember("Bob");
        TeamMember member3 = new TeamMember("Charlie");

        member1.setSubject(task1);
        member2.setSubject(task1);
        member3.setSubject(task2);

        task1.register(member1);
        task1.register(member2);
        task2.register(member3);
        task2.register(member1);

        System.out.println("Updating task statuses...");
        task1.setStatus("In Progress");
        task2.setStatus("Completed");
        task1.setStatus("Completed");
    }
}