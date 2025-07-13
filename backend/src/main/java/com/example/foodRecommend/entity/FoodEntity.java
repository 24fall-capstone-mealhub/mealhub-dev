package com.example.foodRecommend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "food")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String categoryBig;
    @Column(nullable = false)
    private String categoryMed;
    @Column(nullable = false)
    private String categorySmall;

    @Column(nullable = false)
    private float calories;
    @OneToMany(mappedBy = "food", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FoodIngredientsEntity> ingredients = new ArrayList<>();


}
