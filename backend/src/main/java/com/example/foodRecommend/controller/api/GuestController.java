package com.example.foodRecommend.controller.api;

import com.example.foodRecommend.dto.GuestSignInDto;
import com.example.foodRecommend.security.JwtUtil;
import com.example.foodRecommend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.foodRecommend.dto.GuestInfoDto;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/guest")
@RequiredArgsConstructor
public class GuestController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private static final int COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30일

    /**
     * 사용자가 age/gender/allergy 입력 후 호출하는 API
     * guest user 생성 + userId 쿠키 발급
     */
    @PostMapping("/init")
    public ResponseEntity<String> initializeGuest(@RequestBody GuestInfoDto dto, HttpServletResponse response) {
        Long userId = userService.createGuestUser(dto.getAge(), dto.getGender(), dto);

        Cookie cookie = new Cookie("userId", userId.toString());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(60 * 60 * 24 * 30);
        cookie.setAttribute("SameSite", "Strict");

        response.addCookie(cookie);
        return ResponseEntity.ok("Guest initialized with userId=" + userId);
    }


    /**
     * 이후 요청 시 쿠키로 userId 확인
     */
    @GetMapping("/check")
    public ResponseEntity<String> checkGuest(HttpServletRequest request) {
        String userIdStr = getCookieValue(request, "userId");
        if (userIdStr == null) {
            return ResponseEntity.status(400).body("Guest not initialized.");
        }

        Long userId = Long.parseLong(userIdStr);
        return ResponseEntity.ok("Welcome back, userId=" + userId);
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(name)) return cookie.getValue();
        }
        return null;
    }
    @PostMapping("/signin")
    public ResponseEntity<?> guestSignIn(
            @CookieValue(name = "userId") Long userId,
            @RequestBody GuestSignInDto dto,
            HttpServletResponse response) {

        userService.registerGuest(userId, dto);

        // ✅ 1. 쿠키 삭제
        Cookie expiredCookie = new Cookie("userId", null);
        expiredCookie.setMaxAge(0);
        expiredCookie.setPath("/");
        response.addCookie(expiredCookie);

        // ✅ 2. JWT 자동 로그인
        String token = jwtUtil.generateToken(dto.getLoginId());

        // ✅ 3. 토큰 반환
        return ResponseEntity.ok(Map.of(
                "message", "회원가입 및 로그인 성공",
                "userId", userId,
                "token", token
        ));
    }





}