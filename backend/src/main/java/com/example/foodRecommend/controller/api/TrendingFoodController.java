package com.example.foodRecommend.controller.api;

import com.example.foodRecommend.service.TrendingFoodService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
public class TrendingFoodController {
    private final TrendingFoodService trendingFoodService;

    public TrendingFoodController(TrendingFoodService trendingFoodService) {
        this.trendingFoodService = trendingFoodService;
    }

    @GetMapping("/api/trending-foods")
    public List<Map<String, Object>> getTrendingFoods() {
        return trendingFoodService.getTrendingFoods();
    }
}
