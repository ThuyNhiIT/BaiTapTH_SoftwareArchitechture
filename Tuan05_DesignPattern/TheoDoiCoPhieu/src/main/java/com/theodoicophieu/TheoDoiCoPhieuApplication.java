package com.theodoicophieu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TheoDoiCoPhieuApplication {

	public static void main(String[] args) {
		Stock appleStock = new Stock("Apple", 150);
		Stock googleStock = new Stock("Google", 2800);

		Investor investor1 = new Investor("Alice");
		Investor investor2 = new Investor("Bob");
		Investor investor3 = new Investor("Charlie");

		investor1.setSubject(appleStock);
		investor2.setSubject(appleStock);
		investor3.setSubject(googleStock);

		appleStock.register(investor1);
		appleStock.register(investor2);
		googleStock.register(investor3);
		googleStock.register(investor1);

		System.out.println("Updating stock prices...");
		appleStock.setPrice(155);
		googleStock.setPrice(2850);
		appleStock.setPrice(160);

		System.out.println("Posting messages...");
		appleStock.postMessage("Apple stock is rising!");
		googleStock.postMessage("Google stock is stable.");
	}
}
