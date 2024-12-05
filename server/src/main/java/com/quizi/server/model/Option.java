package com.quizi.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "`option`")
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String optionText;

    @Column(name = "is_correct", columnDefinition = "BIT(1)")
    private Boolean isCorrect = false;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public Boolean isCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean correct) {
        this.isCorrect = correct;
    }
}