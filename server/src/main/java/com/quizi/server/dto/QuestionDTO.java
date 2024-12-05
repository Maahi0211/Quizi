package com.quizi.server.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionDTO {
    private String questionText;
    private List<OptionDTO> options;
} 