package com.example.foodRecommend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.foodRecommend.entity.FoodEntity;
import java.util.Optional;

public interface FoodRepository extends JpaRepository<FoodEntity, Long> {
    Optional<FoodEntity> findById(Long id);
}
