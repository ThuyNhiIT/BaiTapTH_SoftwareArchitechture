package com.example.orderservice.service;

import com.example.orderservice.dto.OrderRequestDto;
import com.example.orderservice.entity.Order;

import java.util.List;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrder(Long orderId);
    Order createOrder(OrderRequestDto orderRequestDto);
    Order updateOrder(Order order);
}