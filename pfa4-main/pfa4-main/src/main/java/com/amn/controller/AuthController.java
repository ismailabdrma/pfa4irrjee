package com.amn.controller;

import com.amn.dto.AuthRequest;
import com.amn.dto.AuthResponse;
import com.amn.dto.RegisterRequest;
import com.amn.entity.Doctor;
import com.amn.entity.OTP;
import com.amn.entity.Pharmacist;
import com.amn.entity.User;
import com.amn.entity.enums.AccountStatus;
import com.amn.entity.enums.OTPStatus;
import com.amn.entity.enums.Role;
import com.amn.repository.DoctorRepository;
import com.amn.repository.OTPRepository;
import com.amn.repository.PharmacistRepository;
import com.amn.repository.UserRepository;
import com.amn.security.JwtService;
import com.amn.service.AuthService;
import com.amn.service.OTPService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final OTPRepository otpRepository;
    private final OTPService otpService;
    private final AuthService authService;
    private final DoctorRepository doctorRepository;
    private final  PharmacistRepository pharmacistRepository;

    /**
     * ✅ REGISTER endpoint (delegated to AuthService)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    /**
     * ✅ LOGIN endpoint (remains here)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // If ADMIN, generate token directly
        if (user.getRole() == Role.ADMIN) {
            String token = jwtService.generateToken(Map.of("role", user.getRole().name()), user.getEmail());
            return ResponseEntity.ok(new AuthResponse(token, "ADMIN"));
        }

        // Check status only in DOCTOR and PHARMACIST entities
        if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorRepository.findById(user.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

            if (doctor.getStatus() != AccountStatus.APPROVED) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your account is not approved yet.");
            }
        }

        if (user.getRole() == Role.PHARMACIST) {
            Pharmacist pharmacist = pharmacistRepository.findById(user.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pharmacist not found"));

            if (pharmacist.getStatus() != AccountStatus.APPROVED) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your account is not approved yet.");
            }
        }

        // For all other roles, send OTP for verification
        otpService.sendOtpToUser(user);
        return ResponseEntity.ok(Map.of(
                "message", "OTP sent to your email. Please verify.",
                "role", user.getRole().name()
        ));
    }



    /**
     * ✅ VERIFY OTP endpoint (remains here)
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestParam String email, @RequestParam String otpCode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        OTP otp = otpRepository.findTopByUserIdOrderByExpirationDesc(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP not found"));

        if (!otp.getCode().equals(otpCode) || otp.getExpiration().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired OTP");
        }

        otp.setStatus(OTPStatus.VERIFIED);
        otpRepository.save(otp);

        String token = jwtService.generateToken(Map.of("role", user.getRole().name()), user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
    }
}
