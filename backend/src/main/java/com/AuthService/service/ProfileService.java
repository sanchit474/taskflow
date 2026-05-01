package com.AuthService.service;

import com.AuthService.io.ProfileRequest;
import com.AuthService.io.ProfileResponse;

public interface ProfileService {
   //for registration
   ProfileResponse createProfile(ProfileRequest request);
   //for login
   ProfileResponse getProfile(String email);
   String getLoggedInUserId(String email);
}
