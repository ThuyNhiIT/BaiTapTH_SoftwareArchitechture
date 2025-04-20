package com.example.orderservice.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductDto {
    private Long id;

    private String name;
    private Double price;
    private String description;
    private Integer stock;
}
