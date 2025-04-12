package com.example.productservice.service;

import com.example.productservice.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
    public List<Product> getAll();
    public Product save(Product p);

    public Product getById(Long id);

    public void delete(Long id);


}
