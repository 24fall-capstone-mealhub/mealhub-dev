package com.example.foodRecommend.entity;

import com.example.foodRecommend.dto.UserDTO;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
//    @Column(name = "login_id",unique = true, nullable = false)
//    private String loginId;
//    @Column(nullable = false)
//    private String password;

    @Column(nullable = false)
    private String age;
    @Column(nullable = false)
    private String gender;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private LoginInfoEntity loginInfo;


    public static UserEntity toUserEntity(UserDTO userDTO) {
        return UserEntity.builder()
//                .loginId(userDTO.getLoginId())
//                .password(userDTO.getPassword()) // ✅ 비밀번호 암호화
                .age(userDTO.getAge())
                .gender(userDTO.getGender())
                .build();
    }

    public static UserEntity toUpdateUserEntity(UserDTO userDTO){
        UserEntity userEntity=new UserEntity();
        userEntity.setId(userDTO.getId());
//        userEntity.setLoginId(userDTO.getLoginId());
//        userEntity.setPassword(userDTO.getPassword());
        userEntity.setAge(userDTO.getAge());
        userEntity.setGender(userDTO.getGender());

        return userEntity;
    }
}
