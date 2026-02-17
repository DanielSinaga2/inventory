package models

import "github.com/google/uuid"

type Product struct {
	ID    uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name  string
	Price float64
	Stock int
}
