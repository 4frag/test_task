FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock .env ./

RUN poetry install --no-dev

COPY cat_app/ ./cat_app/

# RUN ["poetry", "run", "python", "cat_app/manage.py", "runserver", "0.0.0.0:8000"]