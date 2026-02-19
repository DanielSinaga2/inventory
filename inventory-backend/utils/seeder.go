package utils

import (
	"inventory-backend/config"
	"inventory-backend/models"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func SeedAdmin() {
	var user models.User

	err := config.DB.Where("username = ?", "admin").First(&user).Error
	if err == nil {
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)

	admin := models.User{
		Username: "admin",
		Password: string(hash),
		Role:     "admin",
	}

	config.DB.Create(&admin)

	log.Println("Admin created -> admin / admin123")
}
