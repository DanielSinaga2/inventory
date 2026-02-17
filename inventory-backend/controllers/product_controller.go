package controllers

import (
	"inventory-backend/config"
	"inventory-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func GetProducts(c *fiber.Ctx) error {
	var products []models.Product
	config.DB.Find(&products)
	return c.JSON(products)
}

func CreateProduct(c *fiber.Ctx) error {
	var product models.Product
	c.BodyParser(&product)

	product.ID = uuid.New()

	config.DB.Create(&product)
	return c.JSON(product)
}

func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")

	var product models.Product
	config.DB.First(&product, "id = ?", id)

	c.BodyParser(&product)

	config.DB.Save(&product)

	return c.JSON(product)
}

func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	config.DB.Delete(&models.Product{}, "id = ?", id)

	return c.JSON(fiber.Map{"message": "deleted"})
}
