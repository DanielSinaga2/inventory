package models

import (
	"time"

	"github.com/google/uuid"
)

type Invoice struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey"`
	Total         float64
	Discount      float64
	PaymentMethod string
	CreatedAt     time.Time
	Items         []InvoiceItem `gorm:"foreignKey:InvoiceID"`
}

type InvoiceItem struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	InvoiceID uuid.UUID
	ProductID uuid.UUID
	Product   Product
	Qty       int
	Price     float64
	Subtotal  float64
}