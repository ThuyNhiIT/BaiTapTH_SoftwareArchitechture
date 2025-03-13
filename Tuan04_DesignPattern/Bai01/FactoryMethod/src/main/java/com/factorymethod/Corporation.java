package com.factorymethod;

public class Corporation extends  Company{
    private String name;
    private String address;

    public Corporation(String name, String address) {
        this.name = name;
        this.address = address;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public String getAddress() {
        return this.address;
    }
}
