package com.quizi.server.repo;

import com.quizi.server.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepo extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCreatorId(Long creatorId);
    List<Quiz> findByCreatorEmail(String email);
    int countByCreatorEmail(String email);
}

