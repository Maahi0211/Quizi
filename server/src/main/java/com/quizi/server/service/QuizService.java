package com.quizi.server.service;

import com.quizi.server.dto.QuizDTO;
import com.quizi.server.model.*;
import com.quizi.server.repo.ParticipationRepo;
import com.quizi.server.repo.QuizRepo;
import com.quizi.server.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuizRepo quizRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ParticipationRepo participationRepo;

    // Create a new quiz
    public String createQuiz(Quiz quiz, String userEmail) {
        User creator = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Creator with email " + userEmail + " not found"));

        quiz.setCreator(creator);
        quiz.setCreatedDate(LocalDateTime.now());

        // Ensure each question and option is linked to the quiz
        if (quiz.getQuestions() != null) {
            quiz.getQuestions().forEach(question -> {
                question.setQuiz(quiz);
                if (question.getOptions() != null) {
                    question.getOptions().forEach(option -> option.setQuestion(question));
                }
            });
        }

        quizRepo.save(quiz); // Save quiz with cascading to questions and options
        return "Quiz created successfully by " + creator.getUsername();
    }

    // Get all quizzes
    public List<QuizDTO> getAllQuizzes() {
        return quizRepo.findAll().stream().map(this::mapQuizToDTO).collect(Collectors.toList());
    }

    // Delete a quiz by ID
    public String deleteQuiz(Long quizId, String userEmail) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz with ID " + quizId + " not found"));

        if (!quiz.getCreator().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You can only delete quizzes created by you");
        }

        quizRepo.delete(quiz); // Cascade deletes related questions and options
        return "Quiz deleted successfully";
    }

    // Get quizzes by a specific user
    public List<QuizDTO> getQuizzesByUser(String userEmail) {
        List<Quiz> quizzes = quizRepo.findByCreatorEmail(userEmail);
        return quizzes.stream().map(this::mapQuizToDTO).collect(Collectors.toList());
    }

    // Get a specific quiz by ID
    public QuizDTO getQuizById(Long quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz with ID " + quizId + " not found"));

        return mapQuizToDTO(quiz);
    }

    // Submit answers for a quiz
    public Participation submitQuiz(Long quizId, String userEmail, Map<Long, Long> answers) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        int score = answers.entrySet().stream()
                .mapToInt(entry -> {
                    Long questionId = entry.getKey();
                    Long selectedOptionId = entry.getValue();

                    return quiz.getQuestions().stream()
                            .filter(question -> question.getId().equals(questionId))
                            .flatMap(question -> question.getOptions().stream())
                            .filter(option -> option.isCorrect() && option.getId().equals(selectedOptionId))
                            .findAny()
                            .isPresent() ? 1 : 0;
                })
                .sum();

        Participation participation = new Participation();
        participation.setQuiz(quiz);
        participation.setUser(user);
        participation.setScore(score);

        return participationRepo.save(participation);
    }

    // Get all participations for a specific quiz
    public List<Participation> getParticipationsByQuizId(Long quizId) {
        return participationRepo.findByQuizId(quizId);
    }

    // Get all participations for a specific user
    public List<Participation> getParticipationsByUserId(Long userId) {
        return participationRepo.findByUserId(userId);
    }

    // Helper method to map Quiz to QuizDTO
    private QuizDTO mapQuizToDTO(Quiz quiz) {
        return new QuizDTO(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getCreator().getUsername(),
                quiz.getQuestions().stream().map(question ->
                        new QuizDTO.QuestionDTO(
                                question.getId(),
                                question.getQuestionText(),
                                question.getOptions().stream().map(option ->
                                        new QuizDTO.QuestionDTO.OptionDTO(
                                                option.getId(),
                                                option.getOptionText()
                                        )).collect(Collectors.toList())
                        )).collect(Collectors.toList())
        );
    }
}
