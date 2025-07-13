package com.example.foodRecommend.security;

import com.example.foodRecommend.entity.UserEntity;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class CustomUserDetails implements UserDetails {

    private final UserEntity user;
    private final String loginId;
    private final String password;

    public CustomUserDetails(UserEntity user, String loginId, String password) {
        this.user = user;
        this.loginId = loginId;
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return password; // ✅ 실제 암호화된 비밀번호
    }

    @Override
    public String getUsername() {
        return loginId; // ✅ loginId 반환
    }

    public Long getId() {
        return user.getId();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
