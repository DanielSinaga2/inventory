package routes

import (
	"inventory-backend/controllers"
	"inventory-backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App) {

	// Public
	app.Post("/api/login", controllers.Login)

	// Admin only
	admin := app.Group("/api",
		middleware.Protected(),
		middleware.RoleMiddleware("admin"),
	)

	admin.Post("/create-staff", controllers.CreateStaff)
}
