package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("secret")

func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		tokenString := strings.Replace(auth, "Bearer ", "", 1)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		return c.Next()
	}
}