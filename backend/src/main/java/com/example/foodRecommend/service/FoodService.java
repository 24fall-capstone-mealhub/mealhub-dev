package com.example.foodRecommend.service;

import com.example.foodRecommend.dto.FoodRecommendRequestDTO;
import com.example.foodRecommend.entity.FoodEntity;
import com.example.foodRecommend.repository.FoodRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodService {
    private final FoodRepository foodRepository;

    public FoodEntity recommendFood(FoodRecommendRequestDTO requestDTO) {
        Long id = requestDTO.getFoodId();
        return foodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 ID의 음식이 없습니다: " + id));
    }
}
