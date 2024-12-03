package com.quizi.server.controller;

import com.quizi.server.dto.ParticipationResponse;
import com.quizi.server.dto.QuizDTO;
import com.quizi.server.dto.QuizSubmitDTO;
import com.quizi.server.model.Quiz;
import com.quizi.server.model.Participation;
import com.quizi.server.service.QuizService;
import com.quizi.server.service.ParticipationService;
import com.quizi.server.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ParticipationService participationService;

    // Create a new quiz
    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestBody Quiz quiz, @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid Authorization header");
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
            String userEmail = jwtUtil.extractUsername(token);
            String response = quizService.createQuiz(quiz, userEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired JWT token");
        }
    }

    // Get all quizzes
    @GetMapping("/all")
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        List<QuizDTO> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    // Get participation details (score, quiz info)
    @GetMapping("/participation/{userId}")
    public ResponseEntity<List<Participation>> getUserParticipations(@PathVariable Long userId) {
        List<Participation> participations = participationService.getUserParticipations(userId);
        return ResponseEntity.ok(participations);
    }

    @DeleteMapping("/delete/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long quizId, @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid Authorization header");
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
            String userEmail = jwtUtil.extractUsername(token);
            String response = quizService.deleteQuiz(quizId, userEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired JWT token");
        }
    }

    @GetMapping("/my-quizzes")
    public ResponseEntity<List<QuizDTO>> getQuizzesByUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(null); // Return null with a bad request response
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
            String userEmail = jwtUtil.extractUsername(token);
            List<QuizDTO> quizzes = quizService.getQuizzesByUser(userEmail);
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null); // Unauthorized response
        }
    }

    // Endpoint to get a specific quiz by ID
    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long quizId) {
        QuizDTO quizDTO = quizService.getQuizById(quizId);
        return ResponseEntity.ok(quizDTO);
    }


    // Endpoint to submit quiz answers
    // Submit quiz answers
    @PostMapping("/submit")
    public ResponseEntity<ParticipationResponse> submitQuiz(
            @RequestBody QuizSubmitDTO quizSubmitDTO,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Returning ResponseEntity<ParticipationResponse> with a proper error response
            return ResponseEntity.status(400).body(new ParticipationResponse(null, null, null, 0, "Authorization header is missing or invalid", null, null));
        }

        String token = authHeader.substring(7); // Extract JWT token

        try {
            // Extract user email from the token
            String userEmail = jwtUtil.extractUsername(token);

            // Submit the quiz and get the participation response
            ParticipationResponse response = participationService.submitQuiz(quizSubmitDTO, userEmail);

            // Return success response with ParticipationResponse
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Return error response in case of invalid token format
            return ResponseEntity.status(400).body(new ParticipationResponse(null, null, null, 0, "Invalid JWT token format", null, null));
        } catch (ExpiredJwtException e) {
            // Return error response in case of expired token
            return ResponseEntity.status(401).body(new ParticipationResponse(null, null, null, 0, "JWT token has expired", null, null));
        } catch (Exception e) {
            // Return error response for other unexpected errors
            return ResponseEntity.status(500).body(new ParticipationResponse(null, null, null, 0, "An error occurred while processing the request", null, null));
        }
    }

    // Endpoint to get participations for a specific quiz
    @GetMapping("/participations/quiz/{quizId}")
    public ResponseEntity<List<Participation>> getParticipationsByQuizId(@PathVariable Long quizId) {
        List<Participation> participations = quizService.getParticipationsByQuizId(quizId);
        return ResponseEntity.ok(participations);
    }

    // Endpoint to get participations for a specific user
    @GetMapping("/participations/user/{userId}")
    public ResponseEntity<List<Participation>> getParticipationsByUserId(@PathVariable Long userId) {
        List<Participation> participations = quizService.getParticipationsByUserId(userId);
        return ResponseEntity.ok(participations);
    }
}
