package com.example.foodRecommend.repository;

import com.example.foodRecommend.entity.LoginInfoEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LoginInfoRepository extends JpaRepository<LoginInfoEntity, Long> {
    Optional<LoginInfoEntity> findByLoginId(String loginId);
    Optional<LoginInfoEntity> findById(Long Id);

    boolean existsByUserId(Long userId);
    @Modifying
    @Transactional
    @Query("DELETE FROM LoginInfoEntity l WHERE l.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    boolean existsByLoginId(String loginId);

}
