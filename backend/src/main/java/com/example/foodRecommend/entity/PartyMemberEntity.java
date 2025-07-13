package com.example.foodRecommend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartyMemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "party_id", nullable = false)
    private PartyEntity party; // 참가한 파티

    @Column(nullable = false)
    private Long userId; // 참가한 사용자 ID
}
