package com.example.foodRecommend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GuestInfoDto {
    private String age;
    private String gender;

    private boolean dairy_allergy;
    private boolean eggs_allergy;
    private boolean nuts_allergy;
    private boolean seafood_allergy;
    private boolean soy_allergy;
    private boolean wheat_allergy;
    private boolean pepper_allergy;
}
