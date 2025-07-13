package com.example.foodRecommend.service;

import com.example.foodRecommend.dto.*;
import com.example.foodRecommend.entity.UserAllergyEntity;
import com.example.foodRecommend.entity.UserEntity;
import com.example.foodRecommend.entity.LoginInfoEntity;
import com.example.foodRecommend.repository.UserAllergyRepository;
import com.example.foodRecommend.repository.LoginInfoRepository;
import com.example.foodRecommend.repository.UserRepository;
import com.example.foodRecommend.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final LoginInfoRepository loginInfoRepository;
    private final UserAllergyRepository userAllergyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public Long registerUser(SignInDto dto) {
        System.out.println("=========register access=========");

        if (loginInfoRepository.findByLoginId(dto.getLoginId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 Login ID입니다.");
        }

        // 1. User 저장
        UserEntity user = UserEntity.builder()
                .age(dto.getAge())
                .gender(dto.getGender())
                .build();
        userRepository.save(user);

        // 2. 로그인 정보 저장
        LoginInfoEntity loginInfo = LoginInfoEntity.builder()
                .user(user)
                .loginId(dto.getLoginId())
                .password(passwordEncoder.encode(dto.getPassword()))
                .build();
        loginInfoRepository.save(loginInfo);

        // 3. 알레르기 true인 것만 user_allergy에 저장
        Map<String, Boolean> allergyMap = Map.of(
                "dairy", dto.isDairy_allergy(),
                "eggs", dto.isEggs_allergy(),
                "nuts", dto.isNuts_allergy(),
                "seafood", dto.isSeafood_allergy(),
                "soy", dto.isSoy_allergy(),
                "wheat", dto.isWheat_allergy(),
                "pepper", dto.isPepper_allergy()
        );

        List<UserAllergyEntity> userAllergies = allergyMap.entrySet().stream()
                .filter(Map.Entry::getValue)
                .map((Map.Entry<String, Boolean> entry) -> new UserAllergyEntity(user, entry.getKey()))
                .collect(Collectors.toList());


        userAllergyRepository.saveAll(userAllergies);

        return user.getId();
    }


    public String loginAndGenerateToken(LoginRequestDto loginRequestDto) {
        // 로그인 ID와 비밀번호 기반 인증 시도
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getLoginId(),
                        loginRequestDto.getPassword()
                )
        );

        // 인증 성공 후 사용자 정보 획득
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // JWT 토큰 생성 (userDetails.getUsername()은 loginId를 반환하도록 구현되어 있어야 함)
        return jwtUtil.generateToken(userDetails.getUsername());
    }


    /**
     * ✅ 사용자의 개인정보 수정 (비밀번호는 별도 처리)
     */
    @Transactional
    public UserDTO updateUser(Long userId, UserDTO userDTO) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!userDTO.getAge().equals("0")) userEntity.setAge(userDTO.getAge());
        if (userDTO.getGender() != null) userEntity.setGender(userDTO.getGender());

        // 기존 알레르기 삭제
        userAllergyRepository.deleteByUserId(userId);

        // 새 알레르기 저장
        Map<String, Boolean> allergyMap = Map.of(
                "dairy", userDTO.isDairy_allergy(),
                "eggs", userDTO.isEggs_allergy(),
                "nuts", userDTO.isNuts_allergy(),
                "seafood", userDTO.isSeafood_allergy(),
                "soy", userDTO.isSoy_allergy(),
                "wheat", userDTO.isWheat_allergy(),
                "pepper", userDTO.isPepper_allergy()
        );

        List<UserAllergyEntity> newAllergies = allergyMap.entrySet().stream()
                .filter(Map.Entry::getValue)
                .map(entry -> new UserAllergyEntity(userEntity, entry.getKey()))
                .collect(Collectors.toList());

        userAllergyRepository.saveAll(newAllergies);

        return getUserDtoWithAllergy(userId); // 알레르기 포함된 DTO 반환
    }

    public UserDTO getUserDtoWithAllergy(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        List<UserAllergyEntity> allergyEntities = userAllergyRepository.findByUserId(userId);
        Set<String> allergyNames = allergyEntities.stream()
                .map(UserAllergyEntity::getAllergyName)
                .collect(Collectors.toSet());

        UserDTO dto = UserDTO.toUserDTO(user); // 기본 정보만 세팅

        // 알레르기 boolean 세팅
        dto.setDairy_allergy(allergyNames.contains("dairy"));
        dto.setEggs_allergy(allergyNames.contains("eggs"));
        dto.setNuts_allergy(allergyNames.contains("nuts"));
        dto.setSeafood_allergy(allergyNames.contains("seafood"));
        dto.setSoy_allergy(allergyNames.contains("soy"));
        dto.setWheat_allergy(allergyNames.contains("wheat"));
        dto.setPepper_allergy(allergyNames.contains("pepper"));

        return dto;
    }

    public UserDTO getUserById(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return UserDTO.toUserDTO(user);
    }
//    public UserDTO getUserByLoginId(String userLoginId){
//        UserEntity user = userRepository.findByLoginId(userLoginId)
//                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
//        return UserDTO.toUserDTO(user);
//    }
    @Transactional
    public void deleteUserById(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        userRepository.deleteById(userId);
    }
    @Transactional
    public void deleteLoginInfoByUserId(Long userId) {
        loginInfoRepository.deleteByUserId(userId);
    }
    /** guest method**/
    public Long createGuestUser(String age, String gender, GuestInfoDto dto) {
        UserEntity guest = UserEntity.builder()
                .age(age)
                .gender(gender)
                .build();
        userRepository.save(guest);

        Map<String, Boolean> allergyMap = Map.of(
                "dairy", dto.isDairy_allergy(),
                "eggs", dto.isEggs_allergy(),
                "nuts", dto.isNuts_allergy(),
                "seafood", dto.isSeafood_allergy(),
                "soy", dto.isSoy_allergy(),
                "wheat", dto.isWheat_allergy(),
                "pepper", dto.isPepper_allergy()
        );

        List<UserAllergyEntity> allergies = allergyMap.entrySet().stream()
                .filter(Map.Entry::getValue)
                .map(entry -> new UserAllergyEntity(guest, entry.getKey()))
                .collect(Collectors.toList());

        userAllergyRepository.saveAll(allergies);

        return guest.getId();
    }

    @Transactional
    public void registerGuest(Long userId, GuestSignInDto dto) {
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        if (loginInfoRepository.existsByLoginId(dto.getLoginId())) {
            throw new IllegalArgumentException("이미 사용 중인 로그인 ID입니다.");
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자입니다."));

        // ✅ 이미 userId에 해당하는 login_info가 존재한다면 예외
        if (loginInfoRepository.existsByUserId(userId)) {
            throw new IllegalStateException("이미 회원가입된 사용자입니다.");
        }

        LoginInfoEntity loginInfo = new LoginInfoEntity();
        loginInfo.setLoginId(dto.getLoginId());
        loginInfo.setPassword(passwordEncoder.encode(dto.getPassword()));
        loginInfo.setUser(user);

        loginInfoRepository.save(loginInfo);
    }

}