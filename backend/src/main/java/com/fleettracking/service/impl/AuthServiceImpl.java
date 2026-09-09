package com.fleettracking.service.impl;

import com.fleettracking.dto.request.LoginRequest;
import com.fleettracking.dto.request.RegisterRequest;
import com.fleettracking.dto.response.AuthResponse;
import com.fleettracking.dto.response.RegisterResponse;
import com.fleettracking.entity.Role;
import com.fleettracking.entity.User;
import com.fleettracking.enums.RoleType;
import com.fleettracking.exception.ResourceNotFoundException;
import com.fleettracking.repository.RoleRepository;
import com.fleettracking.repository.UserRepository;
import com.fleettracking.security.JwtTokenProvider;
import com.fleettracking.security.UserPrincipal;
import com.fleettracking.service.AuthService;
import jakarta.transaction.Transactional;
import java.util.Optional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByMobile(request.getMobile())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid mobile or OTP"));

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);
        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(null)
                .role(user.getRole().getName().name())
                .expiresIn((int) (jwtTokenProvider.getExpirationMs() / 1000))
                .build();
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new IllegalArgumentException("Mobile number already exists");
        }

        Role role = roleRepository.findByName(RoleType.valueOf(request.getRole()))
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = User.builder()
                .mobile(request.getMobile())
                .passwordHash(null)
                .role(role)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        return RegisterResponse.builder()
                .userId(user.getId())
                .mobile(user.getMobile())
                .role(role.getName().name())
                .build();
    }
}
