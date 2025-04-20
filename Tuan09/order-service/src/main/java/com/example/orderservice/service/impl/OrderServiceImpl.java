package com.example.orderservice.service.impl;

import com.example.orderservice.config.Client;
import com.example.orderservice.dto.OrderItemDto;
import com.example.orderservice.dto.OrderRequestDto;
import com.example.orderservice.dto.ProductDto;
import com.example.orderservice.entity.Order;
import com.example.orderservice.entity.OrderItem;
import com.example.orderservice.repository.OrderRepository;
import com.example.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final Client productServiceClient;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, Client productServiceClient) {
        this.orderRepository = orderRepository;
        this.productServiceClient = productServiceClient;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    @Override
    @Transactional
    public Order createOrder(OrderRequestDto orderRequestDto) {
        Order order = new Order();
        order.setCustomerId(orderRequestDto.getCustomerId());

        List<OrderItem> orderItems = orderRequestDto.getOrderItems().stream()
                .map(orderItemDto -> {
                    // Gọi product-service để lấy thông tin sản phẩm (nếu cần)
                    ProductDto product = productServiceClient.getProductById(orderItemDto.getProductId());
                    if (product == null) {
                        throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + orderItemDto.getProductId());
                    }

                    OrderItem orderItem = new OrderItem();
                    orderItem.setProductId(orderItemDto.getProductId());
                    orderItem.setQuantity(orderItemDto.getQuantity());
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }
}
