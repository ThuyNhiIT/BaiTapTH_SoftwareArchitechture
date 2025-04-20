package com.example.orderservice.dto;


import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OrderRequestDto {
    private Long customerId;
    private List<OrderItemDto> orderItems;

    public Long getCustomerId() {
        return customerId;
    }

    public List<OrderItemDto> getOrderItems() {
        return orderItems;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setOrderItems(List<OrderItemDto> orderItems) {
        this.orderItems = orderItems;
    }
}
