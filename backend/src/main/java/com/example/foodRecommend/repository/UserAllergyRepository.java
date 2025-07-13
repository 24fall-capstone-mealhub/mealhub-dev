package com.example.foodRecommend.repository;

import com.example.foodRecommend.entity.UserAllergyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserAllergyRepository extends JpaRepository<UserAllergyEntity, Long> {
    List<UserAllergyEntity> findByUserId(Long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM UserAllergyEntity u WHERE u.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);


}