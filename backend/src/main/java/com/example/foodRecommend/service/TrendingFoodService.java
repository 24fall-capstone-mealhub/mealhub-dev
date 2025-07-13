package com.example.foodRecommend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.*;

@Service
public class TrendingFoodService {
    public List<Map<String, Object>> getTrendingFoods() {
        String url = "http://trending-api:5000/api/trending-foods";
        RestTemplate restTemplate = new RestTemplate();
        System.out.println("Flask 요청 시작");

        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
        List<Map<String, Object>> rawData = response.getBody();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> item : rawData) {
            Map<String, Object> food = new HashMap<>();
            food.put("name", item.get("name"));
            food.put("score", item.get("score"));
            result.add(food);
        }

        System.out.println("Flask 요청 완료");
        return result;
    }
}
