package com.example.foodRecommend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestSignInDto {
    private String loginId;
    private String password;
    private String confirmPassword;
}