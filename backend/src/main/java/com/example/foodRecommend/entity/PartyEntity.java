package com.example.foodRecommend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String partyCode; // 고유 참가 코드

    @Column(nullable = false)
    private Long hostId; // 호스트 ID (파티 생성자)
}
