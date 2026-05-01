package com.AuthService.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
            "/",
            "/dashboard",
            "/dashboard/**",
            "/projects",
            "/projects/**",
            "/team",
            "/login",
            "/register",
            "/email-verify",
            "/reset-password"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}