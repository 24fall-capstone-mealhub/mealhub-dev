package com.example.foodRecommend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "login_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Column(nullable = false, unique = true)
    private String loginId;

    @Column(nullable = false)
    private String password;
}
