package com.example.customerservice.service.impl;


import com.example.customerservice.entity.Customer;
import com.example.customerservice.repository.CustomerRepository;
import com.example.customerservice.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public List<Customer> getAll() {
        List<Customer> kq = customerRepository.findAll();
        System.out.println("A" + kq );
        return kq;

    }

    @Override
    public Customer save(Customer p) {
        return customerRepository.save(p);
    }

    @Override
    public Customer getById(Long id) {
        return customerRepository.findById(id).orElseThrow();
    }

    @Override
    public void delete(Long id) {
        customerRepository.deleteById(id);
    }
}
