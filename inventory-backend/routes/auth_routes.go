package routes

import (
	"inventory-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App) {
	app.Post("/register", controllers.Register)
	app.Post("/login", controllers.Login)
}
