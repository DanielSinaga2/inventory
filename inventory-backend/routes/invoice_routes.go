package routes

import (
	"inventory-backend/controllers"
	"inventory-backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func InvoiceRoutes(app *fiber.App) {
	api := app.Group("/api", middleware.Protected())

	api.Post("/invoices", controllers.CreateInvoice)
	api.Get("/invoices", controllers.GetInvoices)
}
