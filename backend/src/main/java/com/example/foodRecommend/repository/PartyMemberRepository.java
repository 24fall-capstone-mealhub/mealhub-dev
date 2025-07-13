package com.example.foodRecommend.repository;

import com.example.foodRecommend.entity.PartyMemberEntity;
import com.example.foodRecommend.entity.PartyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PartyMemberRepository extends JpaRepository<PartyMemberEntity, Long> {
    Optional<PartyMemberEntity> findByPartyAndUserId(PartyEntity party, Long userId);
    List<PartyMemberEntity> findAllByParty(PartyEntity party);
    void deleteByPartyAndUserId(PartyEntity party, Long userId);
    int countByParty(PartyEntity party);
    boolean existsByUserId(Long userId);

    @Query("SELECT pm FROM PartyMemberEntity pm WHERE pm.userId = :userId")
    Optional<PartyMemberEntity> findByUserId(@Param("userId") Long userId);
}
