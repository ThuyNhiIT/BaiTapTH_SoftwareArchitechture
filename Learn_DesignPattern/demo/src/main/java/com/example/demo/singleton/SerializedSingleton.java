package com.example.demo.singleton;

public class SerializedSingleton {
    private static final long serialVersionUID = -7604766932017737115L;
    private SerializedSingleton(){}
    private static class SingletonHelper{
        private static final SerializedSingleton instance = new
                SerializedSingleton();
    }
    public static SerializedSingleton getInstance(){
        return SingletonHelper.instance;
    }
}