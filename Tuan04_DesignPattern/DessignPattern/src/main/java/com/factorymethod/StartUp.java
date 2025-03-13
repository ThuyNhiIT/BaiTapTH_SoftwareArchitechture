package com.factorymethod;

public class StartUp  extends  Company{
    private String name;
    private String address;

    public StartUp(String name, String address) {
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
