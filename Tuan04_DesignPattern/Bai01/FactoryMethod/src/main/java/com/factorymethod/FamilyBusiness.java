package com.factorymethod;

public class FamilyBusiness extends Company {
    private String name;
    private String address;

    public FamilyBusiness(String name, String address) {
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
