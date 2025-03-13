package com.factorymethod;

public class TestFactory {
    public static void main(String[] args) {
        Company StartUp = CompanyFactory.getCompany("StartUp","Flium.AI", "Bình Thạnh");
        System.out.println("StartUp" + StartUp);
        Company FamilyBusiness = CompanyFactory.getCompany("FamilyBusiness","Nội thất Ngân Ánh", "Củ Chi");
        System.out.println("FamilyBusiness" + FamilyBusiness);
        Company Corporation = CompanyFactory.getCompany("Corporation","ABC", "Gò Vấp");
        System.out.println("Corporation" + Corporation);
    }

}
