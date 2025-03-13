package com.factorymethod;

public class CompanyFactory {
    public static Company getCompany(String type, String name, String address) {
        if("StartUp".equalsIgnoreCase(type))
            return new StartUp(name, address);
        else if("FamilyBusiness".equalsIgnoreCase(type))
            return new FamilyBusiness(name, address);
        else if("Corporation".equalsIgnoreCase(type))
            return new Corporation(name, address);
        return null;
    }
}
