package com.example.foodRecommend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodIngredientsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ingredients;  // 재료 이름 (단수형으로 쓰는 것을 권장)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", nullable = false)
    private FoodEntity food;
}