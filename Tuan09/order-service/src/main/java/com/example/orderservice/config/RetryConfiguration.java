package com.example.orderservice.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.util.function.Predicate;

@Configuration
public class RetryConfiguration {

    @Bean
    public Predicate<Throwable> retryOnIOException() {
        return throwable -> throwable instanceof IOException;
    }

    @Bean
    public Predicate<Throwable> retryOnServerError() {
        return throwable -> throwable instanceof org.springframework.web.client.HttpServerErrorException;
    }

    @Bean
    public Predicate<Throwable> retryOnAnyException() {
        return throwable -> true;
    }
}