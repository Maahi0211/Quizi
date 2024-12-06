package com.quizi.server.service;

import com.quizi.server.dto.CreateQuizDTO;
import com.quizi.server.dto.QuizDTO;
import com.quizi.server.model.*;
import com.quizi.server.repo.ParticipationRepo;
import com.quizi.server.repo.QuizRepo;
import com.quizi.server.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
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
    public String createQuiz(CreateQuizDTO quizDTO, String userEmail) {
        User creator = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Creator with email " + userEmail + " not found"));

        Quiz quiz = new Quiz();
        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setCreator(creator);
        quiz.setCreatedDate(LocalDateTime.now());

        if (quizDTO.getQuestions() != null) {
            List<Question> questions = quizDTO.getQuestions().stream().map(questionDTO -> {
                Question question = new Question();
                question.setQuestionText(questionDTO.getQuestionText());
                question.setQuiz(quiz);

                if (questionDTO.getOptions() != null) {
                    List<Option> options = questionDTO.getOptions().stream().map(optionDTO -> {
                        Option option = new Option();
                        option.setOptionText(optionDTO.getOptionText());
                        option.setQuestion(question);
                        
                        // Debug logs
                        System.out.println("Creating option: " + optionDTO.getOptionText());
                        System.out.println("DTO isCorrect value: " + optionDTO.getIsCorrect());
                        
                        // Explicitly set the boolean value
                        option.setIsCorrect(Boolean.TRUE.equals(optionDTO.getIsCorrect()));
                        
                        System.out.println("Entity isCorrect value after setting: " + option.getIsCorrect());
                        
                        return option;
                    }).collect(Collectors.toList());
                    
                    question.setOptions(options);
                }
                
                return question;
            }).collect(Collectors.toList());
            
            quiz.setQuestions(questions);
        }

        Quiz savedQuiz = quizRepo.save(quiz);
        
        // Verify saved values
        savedQuiz.getQuestions().forEach(question -> 
            question.getOptions().forEach(option -> 
                System.out.println("Saved option: " + option.getOptionText() + 
                                 " isCorrect: " + option.getIsCorrect() + 
                                 " raw DB value: " + option.getIsCorrect())
            )
        );

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
    // Submit answers for a quiz with percentage-based scoring
    public Participation submitQuiz(Long quizId, String userEmail, Map<Long, Long> answers) {
        // Fetch user
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch quiz
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Get total number of questions in the quiz
        int totalQuestions = quiz.getQuestions().size();

        if (totalQuestions == 0) {
            throw new RuntimeException("Quiz has no questions.");
        }

        // Calculate the number of correct answers
        long correctAnswers = answers.entrySet().stream()
                .filter(entry -> {
                    Long questionId = entry.getKey();
                    Long selectedOptionId = entry.getValue();

                    // Find the question by ID
                    return quiz.getQuestions().stream()
                            .filter(question -> question.getId().equals(questionId))
                            .flatMap(question -> question.getOptions().stream())
                            .anyMatch(option -> option.isCorrect() && option.getId().equals(selectedOptionId));
                })
                .count();

        // Calculate the percentage score
        double percentageScore = ((double) correctAnswers / totalQuestions) * 100;

        // Round to 2 decimal places
        percentageScore = Math.round(percentageScore * 100.0) / 100.0;

        // Log the result for debugging
        System.out.println("Correct Answers: " + correctAnswers);
        System.out.println("Total Questions: " + totalQuestions);
        System.out.println("Percentage Score: " + percentageScore);

        // Save participation
        Participation participation = new Participation();
        participation.setQuiz(quiz);
        participation.setUser(user);
        participation.setScore(percentageScore); // Store score as percentage

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

    public Map<String, Object> getUserStats(String userEmail) {
        // Fetch the user
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Calculate total quizzes created by the user
        int totalQuizzesCreated = quizRepo.countByCreatorEmail(userEmail);

        // Calculate total quizzes taken by the user
        int totalQuizzesTaken = participationRepo.countByUserId(user.getId());

        // Calculate the average score for quizzes taken
        Double averageScore = participationRepo.findAverageScoreByUserId(user.getId());

        // If no quizzes have been taken, averageScore may be null
        averageScore = (averageScore == null) ? 0.0 : averageScore;

        // Create a map to return the statistics
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalQuizzesCreated", totalQuizzesCreated);
        stats.put("totalQuizzesTaken", totalQuizzesTaken);
        stats.put("averageScore", averageScore);

        return stats;
    }
}
