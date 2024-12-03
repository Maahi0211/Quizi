package com.quizi.server.repo;

import com.quizi.server.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepo extends JpaRepository<Question, Long> {
    // Find all questions for a specific quiz
    List<Question> findByQuizId(Long quizId);
}
