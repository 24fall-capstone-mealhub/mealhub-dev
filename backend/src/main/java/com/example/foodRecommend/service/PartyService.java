package com.example.foodRecommend.service;

import com.example.foodRecommend.dto.PartyStatusDto;
import com.example.foodRecommend.entity.PartyEntity;
import com.example.foodRecommend.entity.PartyMemberEntity;
import com.example.foodRecommend.entity.UserEntity;
import com.example.foodRecommend.repository.PartyMemberRepository;
import com.example.foodRecommend.repository.PartyRepository;
import com.example.foodRecommend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartyService {

    private final PartyRepository partyRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final UserRepository userRepository;

    /**
     * ✅ 파티 생성 (호스트가 생성)
     */
    public String createParty(Long hostId) {
        if (!userRepository.existsById(hostId)) {
            throw new UsernameNotFoundException("User not found");
        }

        String partyCode = generateUniquePartyCode();
//        String partyCode = UUID.randomUUID().toString().substring(0, 8); // 8자리 코드 생성
        PartyEntity party = PartyEntity.builder()
                .partyCode(partyCode)
                .hostId(hostId)
                .build();

        partyRepository.save(party);

        // 호스트도 자동으로 멤버에 추가
        PartyMemberEntity hostMember = PartyMemberEntity.builder()
                .party(party)
                .userId(hostId)
                .build();
        partyMemberRepository.save(hostMember);

        return partyCode;
    }
    /** 파티코드생성 **/
    private String generateUniquePartyCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 8);
        } while (partyRepository.existsByPartyCode(code));
        return code;
    }
    private static final int MAX_PARTY_SIZE = 5;
    /**
     * ✅ 파티 참가
     */
    public void joinParty(Long userId, String partyCode) {

        if (!userRepository.existsById(userId)) {
            throw new UsernameNotFoundException("User not found");
        }

        PartyEntity party = partyRepository.findByPartyCode(partyCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid party code"));

        if (partyMemberRepository.findByPartyAndUserId(party, userId).isPresent()) {
            throw new IllegalStateException("Already joined");
        }
        int currentSize = partyMemberRepository.countByParty(party);
        if (currentSize >= MAX_PARTY_SIZE) {
            throw new IllegalStateException("Party is full");
        }
        if (partyMemberRepository.existsByUserId(userId)) {
            throw new IllegalStateException("User already joined another party");
        }


        PartyMemberEntity member = PartyMemberEntity.builder()
                .party(party)
                .userId(userId)
                .build();
        partyMemberRepository.save(member);
    }
    /** 파티상태조회**/
    public PartyStatusDto getPartyStatus(String code) {
        PartyEntity party = partyRepository.findByPartyCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid party code"));

        List<Long> memberIds = partyMemberRepository.findAllByParty(party)
                .stream()
                .map(PartyMemberEntity::getUserId)
                .toList();

        return new PartyStatusDto(party.getHostId(), memberIds, party.getPartyCode());
    }

    /**
     * ✅ 파티 삭제 (호스트만 가능)
     */
    @Transactional
    public void deleteParty(Long hostId, String partyCode) {
        PartyEntity party = partyRepository.findByPartyCode(partyCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid party code"));

        if (!party.getHostId().equals(hostId)) {
            throw new IllegalStateException("Only host can delete party");
        }

        // 모든 멤버 삭제 후 파티 삭제
        partyMemberRepository.deleteAll(partyMemberRepository.findAllByParty(party));
        partyRepository.delete(party);
    }

    /**
     * ✅ 파티 탈퇴 (멤버)
     */
    @Transactional
    public void leaveParty(Long userId, String partyCode) {
        PartyEntity party = partyRepository.findByPartyCode(partyCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid party code"));

        if (party.getHostId().equals(userId)) {
            throw new IllegalStateException("Host cannot leave, must delete party instead");
        }

        partyMemberRepository.deleteByPartyAndUserId(party, userId);
    }
    public List<Long> getPartyMemberIds(Long userId) {
        // 1. 사용자가 속한 파티를 찾는다
        PartyMemberEntity myMembership = partyMemberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 파티에 속해있지 않습니다."));

        PartyEntity party = myMembership.getParty();

        // 2. 해당 파티의 모든 멤버 조회
        List<PartyMemberEntity> members = partyMemberRepository.findAllByParty(party);

        // 3. userId만 추출
        return members.stream()
                .map(member -> member.getUserId())  // 또는 getUserId()가 있으면 그걸 써도 됨
                //.filter(id -> !id.equals(userId))  // 본인을 제외하고 싶다면 이 줄 활성화
                .collect(Collectors.toList());
    }
    public String getMyPartyCode(Long userId) {
        PartyMemberEntity membership = partyMemberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자는 파티에 속해 있지 않습니다."));
        return membership.getParty().getPartyCode();
    }
}
