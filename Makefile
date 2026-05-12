.PHONY: install migrate run run-dev test build collectstatic shell lint format clean

# ── Python / Django ──────────────────────────────────────────────────────────

install:
	pip install -r requirements/development.txt
	npm install

migrate:
	python manage.py makemigrations
	python manage.py migrate

run:
	python manage.py runserver 0.0.0.0:8000

run-dev: build-dev run

shell:
	python manage.py shell

collectstatic:
	python manage.py collectstatic --noinput

# ── Frontend / Webpack ────────────────────────────────────────────────────────

build:
	npm run build

build-dev:
	npm run build:dev

watch:
	npm run watch

# ── Testing ───────────────────────────────────────────────────────────────────

test:
	python -m pytest lms/ cms/ --cov=lms --cov=cms --cov-report=term-missing

test-js:
	npm test

test-all: test test-js

# ── Code Quality ──────────────────────────────────────────────────────────────

lint:
	flake8 lms/ cms/ common/
	isort --check-only lms/ cms/ common/

format:
	black lms/ cms/ common/
	isort lms/ cms/ common/

# ── Utilities ─────────────────────────────────────────────────────────────────

superuser:
	python manage.py createsuperuser

clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name '*.egg-info' -exec rm -rf {} + 2>/dev/null || true
	rm -rf .coverage htmlcov/ .pytest_cache/
	rm -rf lms/static/js/dist/ lms/static/css/dist/

docker-up:
	docker compose up -d

docker-down:
	docker compose down
