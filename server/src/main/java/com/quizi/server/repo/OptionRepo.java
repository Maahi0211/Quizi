package com.quizi.server.repo;

import com.quizi.server.model.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepo extends JpaRepository<Option, Long> {
    // Find all options for a specific question
    List<Option> findByQuestionId(Long questionId);
}