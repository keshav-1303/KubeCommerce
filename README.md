# KubeCommerce
A modular, scalable e-commerce backend built using microservices architecture.

## Table of Contents

1. [About the Project](#about-the-project)
2. [Features](#features)
3. [Directory Structure](#directory-structure)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Service Breakdown](#service-breakdown)
   - [Authentication Service](#authentication-service)
   - [Product Service](#product-service)
   - [Database Service](#database-service)
   - [Cache Service](#cache-service)
7. [Docker Compose](#docker-compose)
8. [Kubernetes Deployment](#kubernetes-deployment)
9. [API Endpoints](#api-endpoints)
10. [Usage](#usage)
11. [Contributing](#contributing)
12. [License](#license)

---

## About the Project

`KubeCommerce` is a microservices-based e-commerce backend application designed with modularity and scalability in mind. Each service handles a distinct responsibility—user authentication, product management, data storage, and caching. Services communicate over HTTP and are containerized with Docker. Redis is used for caching frequently accessed product data, while MongoDB serves as the main database for both user and product information.

## Features

- **Modular architecture:** Each service encapsulates a single responsibility.
- **Scalability:** Horizontal Pod Autoscaling (HPA) is configured for critical services.
- **Containerization:** Docker for local development; Kubernetes for production orchestration.
- **Caching:** Redis cache reduces database load and speeds up responses.
- **Security:** JWT-based authentication and role-based access control (user, admin, employee).

## Directory Structure

```
ecommerce/
├── docker-compose.yml        # Orchestration of all services
├── .gitignore                # Exclude unnecessary files
├── authentication/           # Auth microservice
│   ├── db.js
│   ├── index.js
│   ├── userModel.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── product/                  # Product microservice
│   ├── db.js
│   ├── index.js
│   ├── productModel.js
│   ├── redis.js              # Redis caching logic
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── volumes/
│   └── mongo-data/           # MongoDB data persistence
└── k8s/                      # Kubernetes manifests
    ├── namespace.yaml
    ├── auth-service.yaml
    ├── auth-hpa.yaml
    ├── product-service.yaml
    ├── product-hpa.yaml
    ├── mongodb.yaml
    ├── redis.yaml
    └── ingress.yaml
```

## Prerequisites

- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) configured for your cluster
- [Minikube](https://minikube.sigs.k8s.io/docs/) or any Kubernetes cluster

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/kubecommerce.git
   cd kubecommerce
   ```

2. **Environment variables**
   - Copy `.env.example` to each service folder (`authentication/`, `product/`) and set your secrets (e.g., `JWT_SECRET`, database URIs).

3. **Start with Docker Compose** (for local development)
   ```bash
   docker-compose up --build
   ```
   - Auth service on `http://localhost:3000`
   - Product service on `http://localhost:3001`

## Service Breakdown

### Authentication Service

- **Path:** `./authentication`
- **Port:** `3000`
- **Purpose:** Handles user registration, login, JWT authentication, and role verification.
- **Tech:** Express.js, MongoDB, bcrypt, JWT
- **Endpoints:** `POST /register`, `POST /login`, `POST /verify`, `POST /verifyRole`

### Product Service

- **Path:** `./product`
- **Port:** `3001`
- **Purpose:** CRUD operations for products with Redis caching.
- **Tech:** Express.js, MongoDB, Redis, Axios
- **Endpoints:** `GET /products`, `POST /product`, `PUT /update/:id`, `DELETE /delete/:id`
- **Middleware:** Role verification via auth-service

### Database Service

- **Image:** `mongo`
- **Port:** `27017`
- **Purpose:** Centralized MongoDB instance for all services
- **Persistence:** Docker volume `mongo-data`

### Cache Service

- **Image:** `redis`
- **Port:** `6379`
- **Purpose:** Caches paginated product queries for 60 seconds

## Docker Compose

The `docker-compose.yml` file orchestrates all four services:

```yaml
version: '3.8'
services:
  auth-service:
    build: ./authentication
    ports:
      - '3000:3000'
    env_file: ./authentication/.env
    volumes:
      - ./authentication:/app
    depends_on:
      - db-service

  product-service:
    build: ./product
    ports:
      - '3001:3001'
    env_file: ./product/.env
    volumes:
      - ./product:/app
    depends_on:
      - db-service
      - cache-service

  db-service:
    image: mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

  cache-service:
    image: redis
    ports:
      - '6379:6379'

volumes:
  mongo-data:
```  

## Kubernetes Deployment

Apply all manifests under `k8s/`:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -n ecommerce -f k8s/
```

The setup includes:
- **Namespace**: `ecommerce`
- **Deployments & Services**: Auth, Product, MongoDB, Redis
- **HPAs**: auth-hpa.yaml, product-hpa.yaml
- **Ingress**: Routes `/auth` and `/products` paths

## API Endpoints

| Service       | Method | Endpoint                | Description                                    |
|---------------|--------|-------------------------|------------------------------------------------|
| Auth          | POST   | `/register`             | Register a new user                            |
| Auth          | POST   | `/login`                | User login, returns JWT                        |
| Auth          | POST   | `/verify`               | Verify JWT and return user info                |
| Auth          | POST   | `/verifyRole`           | Verify user role for protected routes          |
| Product       | GET    | `/products?page=&limit=`| Get paginated products (cached)                |
| Product       | POST   | `/product`              | Create a new product (admin/employee only)     |
| Product       | PUT    | `/update/:id`           | Update product by ID (admin/employee only)     |
| Product       | DELETE | `/delete/:id`           | Delete product by ID (admin/employee only)     |

## Usage

1. **Authenticate:** Obtain JWT via `/login`.
2. **Access Products:** Include `Authorization: Bearer <token>` header.
3. **Interact:** Use the above endpoints to manage products.

## Role based permissions (for admin/employee/user)
<table style="width:100%; text-align:center; border-collapse: collapse;">
  <tr>
    <th style="width:20%; border: 1px solid #444;">Action</th>
    <th style="width:20%; border: 1px solid #444;">User</th>
    <th style="width:20%; border: 1px solid #444;">Employee</th>
    <th style="width:20%; border: 1px solid #444;">Admin</th>
  </tr>
  <tr>
    <td style="border: 1px solid #444;">View products</td>
    <td>✅</td><td>✅</td><td>✅</td>
  </tr>
  <tr>
    <td style="border: 1px solid #444;">Buy products</td>
    <td>✅</td><td>❌</td><td>❌</td>
  </tr>
  <tr>
    <td style="border: 1px solid #444;">Add products</td>
    <td>❌</td><td>✅</td><td>✅</td>
  </tr>
  <tr>
    <td style="border: 1px solid #444;">Edit products</td>
    <td>❌</td><td>✅</td><td>✅</td>
  </tr>
  <tr>
    <td style="border: 1px solid #444;">Delete products</td>
    <td>❌</td><td>❌</td><td>✅</td>
  </tr>
  <tr>
    <td style="border: 1px solid #444;">Manage users/roles</td>
    <td>❌</td><td>❌</td><td>✅</td>
  </tr>
</table>



## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


