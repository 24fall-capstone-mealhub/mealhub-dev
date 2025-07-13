package com.example.foodRecommend.dto;

import com.example.foodRecommend.entity.UserEntity;
import jakarta.persistence.Column;
import lombok.*;

import jakarta.validation.constraints.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
//    @NotNull(message = "Login ID cannot be null")
//    private String loginId;
//    @NotBlank(message = "Password cannot be empty")
//    @Size(min = 2, message = "Password must be at least 2 characters long")
//    private String password;

    @Min(value = 0, message = "Age cannot be negative")
    private String age;

    @NotNull(message = "Gender cannot be null")
    private String gender;

    // 알레르기 정보는 각 항목별 boolean으로 처리
    private boolean dairy_allergy;
    private boolean eggs_allergy;
    private boolean nuts_allergy;
    private boolean seafood_allergy;
    private boolean soy_allergy;
    private boolean wheat_allergy;
    private boolean pepper_allergy;

    private boolean enabled; // 이메일 인증 상태
    private String verificationToken; // 인증 토큰


    public static UserDTO toUserDTO(UserEntity userEntity){
        return UserDTO.builder()
                .id(userEntity.getId())
//                .loginId(userEntity.getLoginId())
//                .password(userEntity.getPassword())
                .age(userEntity.getAge())
                .gender(userEntity.getGender())
                .build();
    }
}

