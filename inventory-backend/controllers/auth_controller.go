package controllers

import (
	"inventory-backend/database"
	"inventory-backend/config"
	"inventory-backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("secret")

func Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var input LoginInput
	var user models.User

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// 🔥 PASTIKAN PAKAI USERNAME
	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// cek password (kalau belum pakai bcrypt)
	if user.Password != input.Password {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	t, _ := token.SignedString([]byte("secret"))

	return c.JSON(fiber.Map{
		"token": t,
		"user":  user,
	})
}


func CreateStaff(c *fiber.Ctx) error {

	type Input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var input Input

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 10)

	staff := models.User{
		Username: input.Username,
		Password: string(hashedPassword),
		Role:     "staff",
	}

	if err := config.DB.Create(&staff).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "User already exists"})
	}

	return c.JSON(fiber.Map{
		"message": "Staff created successfully",
	})
}
