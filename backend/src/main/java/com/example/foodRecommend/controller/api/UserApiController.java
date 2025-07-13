package com.example.foodRecommend.controller.api;

import com.example.foodRecommend.dto.LoginRequestDto;
import com.example.foodRecommend.dto.SignInDto;
import com.example.foodRecommend.dto.UserDTO;
import com.example.foodRecommend.security.CustomUserDetails;
import com.example.foodRecommend.security.JwtUtil;
import com.example.foodRecommend.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserApiController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/user/signin")
    public ResponseEntity<?> registerUser(@RequestBody SignInDto signInDto) {
        // 1. 회원가입
        Long userId = userService.registerUser(signInDto);

        // 2. JWT 자동 로그인 처리
        String loginId = signInDto.getLoginId();
        String password = signInDto.getPassword();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginId, password)
        );

        String token = jwtUtil.generateToken(loginId); // 또는 authentication 사용해도 됨

        // 3. 응답 반환 (토큰 포함)
        return ResponseEntity.ok(Map.of(
                "message", "회원가입 및 로그인 성공",
                "userId", userId,
                "token", token
        ));
    }

    /**loginfo에서만 삭제 **/
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(Authentication authentication) {
        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        userService.deleteLoginInfoByUserId(userId);  // ✅ 메서드명 수정
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("로그인 정보 삭제 성공");
    }
//    @DeleteMapping("/delete")
//    public ResponseEntity<String> deleteUser(Authentication authentication) {
//        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getId();  // ✅ 수정
//        userService.deleteUserById(userId);
//        SecurityContextHolder.clearContext();
//        return ResponseEntity.ok("회원 탈퇴 성공");
//    }
//    @DeleteMapping("/delete")
//    public ResponseEntity<String> deleteUser(Authentication authentication) {
//        Long userId = Long.parseLong(authentication.getName());  // ✅ 로그인된 사용자 ID
//        userService.deleteUserById(userId);
//        SecurityContextHolder.clearContext();  // ✅ 탈퇴 후 세션 무효화
//        return ResponseEntity.ok("회원 탈퇴 성공");
//    }

    @PostMapping("/user/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto loginRequestDto) {
        System.out.println("=======login========");
        try {
            String jwt = userService.loginAndGenerateToken(loginRequestDto);
            return ResponseEntity.ok(jwt); // ✅ JWT 반환
        } catch (Exception e) {
            return ResponseEntity.status(401).body("로그인 실패: " + e.getMessage());
        }
    }
//    @PostMapping("/user/login")
//    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
//        System.out.println("=======login========");
//        try {
//            String jwt = userService.loginAndGenerateToken(userDTO);
//            return ResponseEntity.ok(jwt); // ✅ JWT 반환
//        } catch (Exception e) {
//            return ResponseEntity.status(401).body("로그인 실패: " + e.getMessage());
//        }
//    }

    @PostMapping("/user/logout")
    public ResponseEntity<String> logout() {
        SecurityContextHolder.clearContext();  // ✅ SecurityContext 초기화
        return ResponseEntity.ok("로그아웃 성공");
    }

    /**
     * ✅ 현재 로그인한 사용자 정보 요청
     */
    @GetMapping("/user/info")
    public ResponseEntity<UserDTO> getUserInfo(Authentication authentication) {
        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        UserDTO userDTO = userService.getUserById(userId);
//        String userLoginId = (authentication.getName());  // ✅ CustomUserDetails.getUsername()이 id 반환
//        UserDTO userDTO = userService.getUserByLoginId(userLoginId);       // ✅ id로 사용자 조회
        return ResponseEntity.ok(userDTO);
    }

    /**
     * ✅ 사용자 정보 수정 API
     */
    @PutMapping("/user/update")
    public ResponseEntity<UserDTO> updateUser(Authentication authentication, @RequestBody UserDTO userDTO) {
        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        UserDTO updatedUser = userService.updateUser(userId, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

//    @PutMapping("/user/update/{userId}")
//    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
//        UserDTO updatedUser = userService.updateUser(userId, userDTO);
//        return ResponseEntity.ok(updatedUser);
//    }
}

