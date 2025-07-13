package com.example.foodRecommend.controller;


import com.example.foodRecommend.dto.UserDTO;
import com.example.foodRecommend.entity.UserEntity;
import com.example.foodRecommend.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @GetMapping("/signin")
    public String signinForm(){
        return "signin";
    }
    @GetMapping("/login")
    public String loginForm(){
        return "login";
    }
}
