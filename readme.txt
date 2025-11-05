Requirements:
  1. Docker – https://www.docker.com/products/docker-desktop/
  2. Makefile – preinstalled on Linux/MacOS (optional on Windows)
  3. REST Client – e.g., Postman: https://www.postman.com/

Instructions:
- To start the app:
    -  If you have Makefile installed, run:
        make start-app
    - Otherwise, run:
        docker compose -f docker-compose.yaml up --detach

- After starting, the backend application exposes HTTP port 3001.

- Connection string for database can be found in docker-compose.yaml file.

- To stop the application:
  -  If you have Makefile installed, run:
      make stop-app
  - Otherwise, run:
      docker compose -f docker-compose.yaml down
