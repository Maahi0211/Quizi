package com.quizi.server.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateQuizDTO {
    private String title;
    private String description;
    private List<QuestionDTO> questions;
} 