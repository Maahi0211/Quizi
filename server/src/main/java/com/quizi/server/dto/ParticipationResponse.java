package com.quizi.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipationResponse {

    private Long id;
    private Long quizId;
    private Long userId;
    private int score;
    private String quizTitle;
    private String userEmail;
    private String submittedAt;

    // Optionally, if you want to format the submittedAt field before returning it, you can use a custom setter.
}
