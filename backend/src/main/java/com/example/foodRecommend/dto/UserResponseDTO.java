package com.example.foodRecommend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String loginId;
    private String age;
    @NotNull(message = "Gender cannot be null")
    private String gender;
    private Boolean allergy;

}
