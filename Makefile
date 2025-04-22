.PHONY: frontend dev up down rebuild clean

prod:
	docker compose down --volumes
	docker system prune -f
	docker compose down --volumes --remove-orphans
	docker network rm needlee-ui_default || true
	docker compose build
	docker compose up -d

frontend:
	cd frontend && npm install && npm run build

dev:
	cd frontend && npm run dev

up: frontend
	docker compose up --build -d

down:
	docker compose down

rebuild: down frontend
	docker compose up --build -d

clean:
	docker compose down --volumes
	docker system prune -f

nuke:
	docker compose down --volumes --remove-orphans
	docker network rm needlee-ui_default || true