package com.quizi.server.repo;

import com.quizi.server.model.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepo extends JpaRepository<Participation, Long> {
    // Find all participations for a specific quiz
    List<Participation> findByQuizId(Long quizId);

    // Find all participations by a specific user
    List<Participation> findByUserId(Long userId);

    int countByUserId(Long userId);

    @Query("SELECT AVG(p.score) FROM Participation p WHERE p.user.id = :userId")
    Double findAverageScoreByUserId(@Param("userId") Long userId);
}
