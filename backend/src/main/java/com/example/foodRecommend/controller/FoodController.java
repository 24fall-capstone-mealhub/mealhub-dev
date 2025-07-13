package com.example.foodRecommend.controller;

import com.example.foodRecommend.dto.FoodRecommendRequestDTO;
import com.example.foodRecommend.service.FoodService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/food")
@RequiredArgsConstructor
public class FoodController {
    private final FoodService foodService;
    @PostMapping("/recommend")
    public ResponseEntity<?> recommendFood(@Valid @RequestBody FoodRecommendRequestDTO requestDTO) {
        try {
            var recommendedFood = foodService.recommendFood(requestDTO);
            return ResponseEntity.ok(recommendedFood);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
    }
}
