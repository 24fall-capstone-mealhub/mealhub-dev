package com.example.foodRecommend.controller.api;

import com.example.foodRecommend.dto.PartyCodeRequestDto;
import com.example.foodRecommend.dto.PartyJoinRequestDto;
import com.example.foodRecommend.security.CustomUserDetails;
import com.example.foodRecommend.service.PartyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/party")
@RequiredArgsConstructor
public class PartyController {

    private final PartyService partyService;

    @PostMapping("/create")
    public ResponseEntity<String> createParty(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();
        String partyCode = partyService.createParty(userId);
        return ResponseEntity.ok("Party created with code: " + partyCode);
    }
    @PostMapping("/join")
    public ResponseEntity<String> joinParty(
            Authentication authentication,
            @RequestBody PartyJoinRequestDto request) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();
        String code = request.getCode();

        partyService.joinParty(userId, code);
        return ResponseEntity.ok("Joined party: " + code);
    }
//    @PostMapping("/join")
//    public ResponseEntity<String> joinParty(Authentication authentication, @RequestParam String code) {
//
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//        Long userId = userDetails.getUser().getId();
//        partyService.joinParty(userId, code);
//        return ResponseEntity.ok("Joined party: " + code);
//    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteParty(
            Authentication authentication,
            @RequestBody PartyCodeRequestDto request) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();
        partyService.deleteParty(userId, request.getCode());
        return ResponseEntity.ok("Party deleted");
    }

    @PostMapping("/leave")
    public ResponseEntity<String> leaveParty(
            Authentication authentication,
            @RequestBody PartyCodeRequestDto request) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();
        partyService.leaveParty(userId, request.getCode());
        return ResponseEntity.ok("Left party");
    }
    @GetMapping("/status")
    public ResponseEntity<?> getPartyStatus(@RequestParam String code) {
        return ResponseEntity.ok(partyService.getPartyStatus(code));
    }
    @GetMapping("/party/list")
    public ResponseEntity<List<Long>> getPartyMembers(@RequestParam Long userId) {
        List<Long> memberIds = partyService.getPartyMemberIds(userId);
        return ResponseEntity.ok(memberIds);
    }
    @GetMapping("/myparty")
    public ResponseEntity<String> getMyPartyCode(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();
        String code = partyService.getMyPartyCode(userId);
        return ResponseEntity.ok(code);
    }
}
