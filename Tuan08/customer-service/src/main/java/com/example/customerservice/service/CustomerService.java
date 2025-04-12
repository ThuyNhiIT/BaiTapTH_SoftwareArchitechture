package com.example.customerservice.service;

import com.example.customerservice.entity.Customer;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CustomerService {

    public List<Customer> getAll();
    public Customer save(Customer p);

    public Customer getById(Long id);

    public void delete(Long id);
}
