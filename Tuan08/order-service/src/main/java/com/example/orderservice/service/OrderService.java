package com.example.orderservice.service;

import com.example.orderservice.entity.Order;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OrderService {
    public List<Order> getAllOrders();
    public Order getOrder(Long orderId);
    public Order createOrder(Order order);
    public Order updateOrder(Order order);
}
