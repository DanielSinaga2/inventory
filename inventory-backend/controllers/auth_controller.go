package controllers

import (
	"time"

	"inventory-backend/config"
	"inventory-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("secret")

func Register(c *fiber.Ctx) error {
	type Input struct {
		Email    string
		Password string
	}

	var input Input
	c.BodyParser(&input)

	hash, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 14)

	user := models.User{
		ID:       uuid.New(),
		Email:    input.Email,
		Password: string(hash),
		Role:     "admin",
	}

	config.DB.Create(&user)

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	type Input struct {
		Email    string
		Password string
	}

	var input Input
	c.BodyParser(&input)

	var user models.User
	config.DB.Where("email = ?", input.Email).First(&user)

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid"})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	t, _ := token.SignedString(jwtSecret)

	return c.JSON(fiber.Map{"token": t})
}
