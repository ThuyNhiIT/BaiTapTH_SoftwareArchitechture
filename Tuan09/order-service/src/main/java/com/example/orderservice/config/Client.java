package com.example.orderservice.config;

import com.example.orderservice.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", url = "${product-service.url}") // Correct configuration is crucial
public interface Client {

    @GetMapping("/products/{Id}")
    ProductDto getProductById(@PathVariable("Id") Long productId);
}
    