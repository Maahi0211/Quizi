package com.quizi.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private String creatorName; // Creator's username
    private List<QuestionDTO> questions;

    @Data
    @AllArgsConstructor
    public static class QuestionDTO {
        private Long id;
        private String questionText;
        private List<OptionDTO> options;

        @Data
        @AllArgsConstructor
        public static class OptionDTO {
            private Long id;
            private String optionText;
        }
    }
}
