package com.AuthService.service;

import com.AuthService.io.ProfileResponse;
import com.AuthService.io.SignupRequest;

public interface AuthService {

    ProfileResponse signup(SignupRequest request);
}
