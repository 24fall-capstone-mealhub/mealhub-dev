package com.example.foodRecommend.security;


import com.example.foodRecommend.entity.LoginInfoEntity;
import com.example.foodRecommend.entity.UserEntity;
import com.example.foodRecommend.repository.LoginInfoRepository;
import com.example.foodRecommend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final LoginInfoRepository loginInfoRepository;

    // loginId 기준
//    @Override
//    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
//        UserEntity user = userRepository.findByLoginId(loginId)
//                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
//        return new CustomUserDetails(user);
//    }
@Override
public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
    LoginInfoEntity loginInfo = loginInfoRepository.findByLoginId(loginId)
            .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 사용자"));

    return new CustomUserDetails(loginInfo.getUser(), loginId, loginInfo.getPassword());
}

}
