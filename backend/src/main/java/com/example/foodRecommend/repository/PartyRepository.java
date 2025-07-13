package com.example.foodRecommend.repository;

import com.example.foodRecommend.entity.PartyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartyRepository extends JpaRepository<PartyEntity, Long> {
    Optional<PartyEntity> findByPartyCode(String partyCode);
    // Optional<PartyEntity> findByUsers_Id(Long userId);
// 또는 Optional<PartyEntity> findByUserId(Long userId); 형태로 구현

    boolean existsByPartyCode(String partyCode);
}
