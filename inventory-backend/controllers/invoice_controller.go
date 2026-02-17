package controllers

import (
	"inventory-backend/config"
	"inventory-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func CreateInvoice(c *fiber.Ctx) error {
	type ItemInput struct {
		ProductID uuid.UUID
		Qty       int
	}

	type Input struct {
		Items         []ItemInput
		Discount      float64
		PaymentMethod string
	}

	var input Input
	c.BodyParser(&input)

	tx := config.DB.Begin()

	var total float64

	invoice := models.Invoice{
		ID:            uuid.New(),
		Discount:      input.Discount,
		PaymentMethod: input.PaymentMethod,
	}

	tx.Create(&invoice)

	for _, item := range input.Items {
		var product models.Product
		tx.First(&product, "id = ?", item.ProductID)

		if product.Stock < item.Qty {
			tx.Rollback()
			return c.Status(400).JSON(fiber.Map{"error": "Stock not enough"})
		}

		subtotal := float64(item.Qty) * product.Price
		total += subtotal

		invoiceItem := models.InvoiceItem{
			ID:        uuid.New(),
			InvoiceID: invoice.ID,
			ProductID: product.ID,
			Qty:       item.Qty,
			Price:     product.Price,
			Subtotal:  subtotal,
		}

		tx.Create(&invoiceItem)

		product.Stock -= item.Qty
		tx.Save(&product)
	}

	invoice.Total = total - input.Discount
	tx.Save(&invoice)

	tx.Commit()

	return c.JSON(invoice)
}

func GetInvoices(c *fiber.Ctx) error {
	var invoices []models.Invoice
	config.DB.Preload("Items.Product").Find(&invoices)
	return c.JSON(invoices)
}
