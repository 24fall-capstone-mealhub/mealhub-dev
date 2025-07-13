package com.example.foodRecommend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {
    private Long id;
    private String loginId;
    @Min(value = 0, message = "Age cannot be negative")
    private String age;

    @NotNull(message = "Gender cannot be null")
    private String gender;

    @NotNull(message = "Allergy status cannot be null")
    private Boolean allergy;
}
