package main

import (
	"database/sql"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

var db *sql.DB

// Expense модель
type Expense struct {
	ID       int     `json:"id"`
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	Note     string  `json:"note"`
	Date     string  `json:"date"`
}

// Category модель
type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// Budget модель
type Budget struct {
	Amount float64 `json:"amount"`
}

// Инициализация базы данных
func initDatabase() {
	var err error
	db, err = sql.Open("sqlite", "./expenses.db")
	if err != nil {
		log.Fatalf("Ошибка подключения к базе данных: %v", err)
	}

	// Таблица расходов
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS expenses (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			category TEXT,
			amount REAL,
			note TEXT,
			date TEXT, 
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы расходов: %v", err)
	}

	// Таблица категорий
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS categories (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE
		)
	`)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы категорий: %v", err)
	}

	// Таблица бюджета
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS budget (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			amount REAL
		)
	`)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы бюджета: %v", err)
	}

	// Создание таблицы пользователей
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE,
			password TEXT
		)
	`)
	if err != nil {
		log.Fatalf("Ошибка создания таблицы пользователей: %v", err)
	}
}

// Маршруты расходов
func registerExpenseRoutes(router *gin.Engine) {
	expenseGroup := router.Group("/expenses")
	{
		expenseGroup.POST("", createExpense)
		expenseGroup.GET("", getExpenses)
	}
}

// Создание расхода
func createExpense(c *gin.Context) {
	var expense Expense
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректные данные"})
		return
	}

	// Проверяем, существует ли категория
	var categoryExists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM categories WHERE name = ?)", expense.Category).Scan(&categoryExists)
	if err != nil || !categoryExists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Категория не существует"})
		return
	}

	// Добавляем расход в базу данных
	_, err = db.Exec("INSERT INTO expenses (category, amount, note, date) VALUES (?, ?, ?, ?)",
		expense.Category, expense.Amount, expense.Note, expense.Date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось добавить расход"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Расход добавлен"})
}

// Получение списка расходов
func getExpenses(c *gin.Context) {
	rows, err := db.Query("SELECT id, category, amount, note, date FROM expenses")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить данные расходов"})
		return
	}
	defer rows.Close()

	var expenses []Expense
	for rows.Next() {
		var expense Expense
		if err := rows.Scan(&expense.ID, &expense.Category, &expense.Amount, &expense.Note, &expense.Date); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка обработки данных"})
			return
		}
		expenses = append(expenses, expense)
	}

	c.JSON(http.StatusOK, expenses)
}

// Маршруты категорий
func registerCategoryRoutes(router *gin.Engine) {
	categoryGroup := router.Group("/categories")
	{
		categoryGroup.POST("", createCategory)
		categoryGroup.GET("", getCategories)
		categoryGroup.DELETE("/:id", deleteCategory)
	}
}

// Создание категории
func createCategory(c *gin.Context) {
	var category Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректные данные"})
		return
	}

	_, err := db.Exec("INSERT INTO categories (name) VALUES (?)", category.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось создать категорию"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Категория создана"})
}

// Получение списка категорий
func getCategories(c *gin.Context) {
	rows, err := db.Query("SELECT id, name FROM categories")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить данные категорий"})
		return
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка обработки данных"})
			return
		}
		categories = append(categories, category)
	}

	c.JSON(http.StatusOK, categories)
}

// Удаление категории
func deleteCategory(c *gin.Context) {
	id := c.Param("id")

	_, err := db.Exec("DELETE FROM categories WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось удалить категорию"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Категория удалена"})
}

// Маршруты бюджета
func registerBudgetRoutes(router *gin.Engine) {
	budgetGroup := router.Group("/budget")
	{
		budgetGroup.GET("", getBudget)
		budgetGroup.POST("", setBudget)
	}
}

// Получение текущего бюджета
func getBudget(c *gin.Context) {
	row := db.QueryRow("SELECT amount FROM budget ORDER BY id DESC LIMIT 1")
	var amount float64
	if err := row.Scan(&amount); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusOK, gin.H{"amount": 0})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка получения бюджета"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"amount": amount})
}

// Регистрация
func registerUser(c *gin.Context) {
	var user struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректные данные"})
		return
	}

	// Хешируем пароль
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось создать пользователя"})
		return
	}

	_, err = db.Exec("INSERT INTO users (username, password) VALUES (?, ?)", user.Username, hashedPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Пользователь уже существует"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Пользователь зарегистрирован"})
}

// Авторизация
func loginUser(c *gin.Context) {
	var user struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректные данные"})
		return
	}

	var hashedPassword string
	err := db.QueryRow("SELECT password FROM users WHERE username = ?", user.Username).Scan(&hashedPassword)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверное имя пользователя или пароль"})
		return
	}

	// Сравниваем пароль
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(user.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверное имя пользователя или пароль"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Авторизация успешна", "token": "ok"})
}

// Установка нового бюджета
func setBudget(c *gin.Context) {
	var budget Budget
	if err := c.ShouldBindJSON(&budget); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректные данные"})
		return
	}

	_, err := db.Exec("INSERT INTO budget (amount) VALUES (?)", budget.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось установить бюджет"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Бюджет установлен"})
}

func registerAuthRoutes(router *gin.Engine) {
	authGroup := router.Group("/auth")
	{
		authGroup.POST("/register", registerUser)
		authGroup.POST("/login", loginUser)
	}
}

func main() {
	// Инициализация базы данных
	initDatabase()

	// Создание маршрутизатора
	router := gin.Default()

	// Регистрация маршрутов
	registerExpenseRoutes(router)
	registerCategoryRoutes(router)
	registerBudgetRoutes(router)
	registerAuthRoutes(router)

	// Запуск сервера
	log.Println("Сервер запущен на порту 8080...")
	router.Run(":8080")
}
