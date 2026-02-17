package main

import (
	"inventory-backend/config"
	"inventory-backend/models"
	"inventory-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	app.Use(cors.New())

	config.ConnectDB()

	config.DB.AutoMigrate(
		&models.Product{},
		&models.Invoice{},
		&models.InvoiceItem{},
		&models.User{},
	)

	routes.AuthRoutes(app)
	routes.ProductRoutes(app)
	routes.InvoiceRoutes(app)

	app.Listen(":3000")
}
