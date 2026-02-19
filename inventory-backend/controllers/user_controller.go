package controllers

import (
	"inventory-backend/config"
	"inventory-backend/models"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type CreateStaffRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func CreateStaff(c *fiber.Ctx) error {
	var body CreateStaffRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid"})
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)

	user := models.User{
		Username: body.Username,
		Password: string(hash),
		Role:     "staff",
	}

	config.DB.Create(&user)

	return c.JSON(user)
}
