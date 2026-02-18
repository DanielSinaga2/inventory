package middleware

import "github.com/gofiber/fiber/v2"

func RoleMiddleware(requiredRole string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		role := c.Locals("role")

		if role != requiredRole {
			return c.Status(403).JSON(fiber.Map{
				"message": "Forbidden - insufficient role",
			})
		}

		return c.Next()
	}
}
