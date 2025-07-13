package com.example.foodRecommend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PartyStatusDto {
    private Long hostId;
    private List<Long> memberIds;
    private String partyCode;
}
