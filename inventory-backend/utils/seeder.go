package utils

import (
	"inventory-backend/config"
	"inventory-backend/models"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func SeedAdmin() {

	var user models.User

	// cek apakah admin sudah ada
	config.DB.Where("role = ?", "admin").First(&user)

	if user.ID != 0 {
		log.Println("Admin already exists")
		return
	}

	// hash password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), 10)

	admin := models.User{
		Username: "admin",
		Password: string(hashedPassword),
		Role:     "admin",
	}

	config.DB.Create(&admin)

	log.Println("Admin user created")
}
