start-app:
	docker compose -f docker-compose.yaml up --detach
stop-app:
	docker compose -f docker-compose.yaml down