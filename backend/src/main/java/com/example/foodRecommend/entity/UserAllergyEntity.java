package com.example.foodRecommend.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "users_allergy")
@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserAllergyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_allergy_user"))
    private UserEntity user;

    private String allergyName;

    public UserAllergyEntity(UserEntity user, String allergyName) {
        this.user = user;
        this.allergyName = allergyName;
    }

    public UserAllergyEntity() {}
}
