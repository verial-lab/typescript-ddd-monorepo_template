# UI E2E Example

A comprehensive example demonstrating the event bus implementation with a profile management system and React UI.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Architecture](#architecture)
  - [Event Flow](#event-flow)
- [Key Components](#key-components)
  - [Profile Management](#profile-management)
  - [Authentication](#authentication)
  - [Event Inspector](#event-inspector)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project showcases a full end-to-end implementation of our event bus architecture using the profile domain. It demonstrates:

- Domain-Driven Design principles
- Event-driven architecture
- Clean separation of concerns
- React UI with components from our component library
- Authentication flow
- Real-time event visualization

## Features

- 🔐 User authentication (login/logout)
- 👤 Profile management (create, read, update, delete)
- 📊 Event visualization and monitoring
- 📡 Real-time UI updates in response to events
- 🧪 Comprehensive testing suite

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Application

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

The application will be available at http://localhost:3000

## Architecture

This example follows a clean architecture approach with distinct layers:

- **Domain Layer**: Core business logic and domain models
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Technical implementations (repositories, event bus)
- **UI Layer**: React components and pages

### Event Flow

The application demonstrates an event-driven architecture where:

1. UI interactions trigger commands
2. Commands are processed by use cases
3. Use cases update the domain model
4. Domain changes publish events to the event bus
5. Event subscribers handle events
6. UI components react to events

See the [Event Inspector](#event-inspector) section for details on visualizing this flow.

## Key Components

### Profile Management

The application allows users to manage their profile information:

- Create a new profile
- View profile details
- Update profile information
- Delete profile

### Authentication

A simple authentication system is provided with:

- Login with pre-configured user
- User session management
- Logout functionality

### Event Inspector

A special component that visualizes the event flow in real-time:

- Shows events as they happen
- Displays event payloads
- Visualizes connections between publishers and subscribers
- Provides timing information

## Development

### Project Structure

For detailed information about the project structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

### Testing

The project includes comprehensive tests:

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e
```

## Contributing

Please follow the project's coding standards and contribution guidelines when working on this example.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 