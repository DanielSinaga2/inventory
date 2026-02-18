package main

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Stock int     `json:"stock"`
}

var users = []User{
	{ID: 1, Username: "admin", Password: "123", Role: "admin"},
}

var products = []Product{}
var userID = 2
var productID = 1

var jwtSecret = []byte("secret123")

func main() {
	app := fiber.New()
	app.Use(cors.New())

	app.Post("/login", login)

	app.Get("/products", authMiddleware, getProducts)
	app.Post("/products", authMiddleware, createProduct)
	app.Put("/products/:id", authMiddleware, updateProduct)
	app.Delete("/products/:id", authMiddleware, deleteProduct)

	app.Get("/users", authMiddleware, getUsers)
	app.Post("/users", authMiddleware, createUser)
	app.Put("/users/:id", authMiddleware, updateUser)
	app.Delete("/users/:id", authMiddleware, deleteUser)

	app.Listen(":3000")
}

func login(c *fiber.Ctx) error {
	var body User

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	for _, u := range users {
		if u.Username == body.Username && u.Password == body.Password {
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"id":   u.ID,
				"role": u.Role,
				"exp":  time.Now().Add(time.Hour * 24).Unix(),
			})

			t, _ := token.SignedString(jwtSecret)

			return c.JSON(fiber.Map{
				"token": t,
				"user":  u,
			})
		}
	}

	return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
}

func authMiddleware(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if auth == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}

	tokenString := auth[7:]

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
	}

	return c.Next()
}

/* ================= PRODUCTS ================= */

func getProducts(c *fiber.Ctx) error {
	return c.JSON(products)
}

func createProduct(c *fiber.Ctx) error {
	var p Product
	if err := c.BodyParser(&p); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	p.ID = productID
	productID++
	products = append(products, p)

	return c.JSON(p)
}

func updateProduct(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, _ := strconv.Atoi(idParam)

	for i, p := range products {
		if p.ID == id {
			if err := c.BodyParser(&products[i]); err != nil {
				return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
			}
			products[i].ID = id
			return c.JSON(products[i])
		}
	}

	return c.Status(404).JSON(fiber.Map{"error": "Not found"})
}

func deleteProduct(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, _ := strconv.Atoi(idParam)

	for i, p := range products {
		if p.ID == id {
			products = append(products[:i], products[i+1:]...)
			return c.JSON(fiber.Map{"message": "Deleted"})
		}
	}

	return c.Status(404).JSON(fiber.Map{"error": "Not found"})
}

/* ================= USERS ================= */

func getUsers(c *fiber.Ctx) error {
	return c.JSON(users)
}

func createUser(c *fiber.Ctx) error {
	var u User
	if err := c.BodyParser(&u); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	u.ID = userID
	userID++
	u.Role = "staff"

	users = append(users, u)

	return c.JSON(u)
}

func updateUser(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, _ := strconv.Atoi(idParam)

	for i, u := range users {
		if u.ID == id {
			if err := c.BodyParser(&users[i]); err != nil {
				return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
			}
			users[i].ID = id
			return c.JSON(users[i])
		}
	}

	return c.Status(404).JSON(fiber.Map{"error": "Not found"})
}

func deleteUser(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, _ := strconv.Atoi(idParam)

	for i, u := range users {
		if u.ID == id {
			users = append(users[:i], users[i+1:]...)
			return c.JSON(fiber.Map{"message": "Deleted"})
		}
	}

	return c.Status(404).JSON(fiber.Map{"error": "Not found"})
}
