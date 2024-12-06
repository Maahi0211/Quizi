package com.quizi.server.service;

import com.quizi.server.dto.ParticipationResponse;
import com.quizi.server.dto.QuizSubmitDTO;
import com.quizi.server.model.*;
import com.quizi.server.repo.ParticipationRepo;
import com.quizi.server.repo.QuizRepo;
import com.quizi.server.repo.OptionRepo;
import com.quizi.server.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ParticipationService {

    @Autowired
    private ParticipationRepo participationRepo;

    @Autowired
    private QuizRepo quizRepo;

    @Autowired
    private OptionRepo optionRepo;

    @Autowired
    private UserRepo userRepo;


    /**
     * User participates in a quiz and gets a score.
     *
     * @param quizId    The ID of the quiz the user is participating in.
     * @param optionIds A list of selected option IDs by the user.
     * @param userId    The ID of the user participating in the quiz.
     * @return Participation record with score and quiz details.
     */
    public Participation participateQuiz(Long quizId, List<Long> optionIds, Long userId) {
        // Fetch quiz
        Quiz quiz = quizRepo.findById(quizId).orElseThrow(() ->
                new RuntimeException("Quiz with ID " + quizId + " not found")
        );

        // Fetch user
        User user = userRepo.findById(userId).orElseThrow(() ->
                new RuntimeException("User with ID " + userId + " not found")
        );

        // Validate options and calculate score
        int score = (int) optionIds.stream()
                .map(optionId -> optionRepo.findById(optionId).orElseThrow(() ->
                        new RuntimeException("Option with ID " + optionId + " not found")
                ))
                .filter(Option::isCorrect) // Only consider correct options
                .count(); // Count the correct answers

        // Save participation record
        Participation participation = new Participation();
        participation.setUser(user);
        participation.setQuiz(quiz);
        participation.setScore(score);
        participation.setSubmittedAt(LocalDateTime.now()); // Add submission timestamp
        return participationRepo.save(participation);
    }

    /**
     * Fetch all participations of a user.
     *
     * @param userId The ID of the user.
     * @return A list of participation records for the user.
     */
    public List<Participation> getUserParticipations(Long userId) {
        // Ensure the user exists before fetching participations
        userRepo.findById(userId).orElseThrow(() ->
                new RuntimeException("User with ID " + userId + " not found")
        );
        return participationRepo.findByUserId(userId);
    }

    public ParticipationResponse submitQuiz(QuizSubmitDTO quizSubmitDTO, String userEmail) {
        // Fetch the user by email
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User with email " + userEmail + " not found"));

        // Fetch the quiz by ID
        Quiz quiz = quizRepo.findById(quizSubmitDTO.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz with ID " + quizSubmitDTO.getQuizId() + " not found"));

        int score = 0;

        // Debug logging
        System.out.println("Processing quiz submission for quiz: " + quiz.getTitle());
        System.out.println("Submitted answers: " + quizSubmitDTO.getAnswers());

        // Iterate through the submitted answers to calculate the score
        for (Map.Entry<Long, Long> entry : quizSubmitDTO.getAnswers().entrySet()) {
            Long questionId = entry.getKey();
            Long selectedOptionId = entry.getValue();

            // Find the question in the quiz
            Optional<Question> questionOpt = quiz.getQuestions().stream()
                    .filter(q -> q.getId().equals(questionId))
                    .findFirst();

            if (questionOpt.isPresent()) {
                Question question = questionOpt.get();
                System.out.println("Processing question: " + question.getQuestionText());
                
                // Get the selected option
                Optional<Option> selectedOption = question.getOptions().stream()
                    .filter(opt -> opt.getId().equals(selectedOptionId))
                    .findFirst();

                if (selectedOption.isPresent()) {
                    Option option = selectedOption.get();
                    System.out.println("Selected option: " + option.getOptionText() + ", isCorrect: " + option.isCorrect());
                    
                    if (option.isCorrect()) {
                        score++;
                        System.out.println("Correct answer! Current score: " + score);
                    }
                }
            }
        }

        System.out.println("Final score: " + score);

        // Create and save the participation record
        Participation participation = new Participation();
        participation.setUser(user);
        participation.setQuiz(quiz);
        participation.setScore(score);
        participation.setSubmittedAt(LocalDateTime.now());

        Participation savedParticipation = participationRepo.save(participation);

        return new ParticipationResponse(
                savedParticipation.getId(),
                quiz.getId(),
                user.getId(),
                (int) savedParticipation.getScore(),
                quiz.getTitle(),
                user.getEmail(),
                savedParticipation.getSubmittedAt().toString()
        );
    }

}
