package com.example.foodRecommend.repository;

import org.springframework.stereotype.Repository;
import com.example.foodRecommend.entity.FoodIngredientsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface FoodIngredientsRepository extends JpaRepository<FoodIngredientsEntity, Long> {
    List<FoodIngredientsEntity> findByFoodId(Long foodId);
}
