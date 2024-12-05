package com.quizi.server.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class OptionDTO {
    private String optionText;
    
    @JsonProperty("isCorrect")
    private Boolean isCorrect = false;
} 