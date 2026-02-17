package routes

import (
	"inventory-backend/controllers"
	"inventory-backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func ProductRoutes(app *fiber.App) {
	api := app.Group("/api", middleware.Protected())

	api.Get("/products", controllers.GetProducts)
	api.Post("/products", controllers.CreateProduct)
	api.Put("/products/:id", controllers.UpdateProduct)
	api.Delete("/products/:id", controllers.DeleteProduct)
}
