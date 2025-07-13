package com.example.foodRecommend.dto;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodRecommendRequestDTO {
    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Food ID cannot be null")
    private Long foodId;
}