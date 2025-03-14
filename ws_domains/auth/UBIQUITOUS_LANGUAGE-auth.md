# Ubiquitous Language - Auth Domain

This document captures the ubiquitous language used in the authentication and authorization domain.

## Table of Contents

- [Ubiquitous Language - Auth Domain](#ubiquitous-language---auth-domain)
  - [Table of Contents](#table-of-contents)
  - [Terms](#terms)
    - [User Identity](#user-identity)
    - [Credentials](#credentials)
    - [Session](#session)
    - [Permission](#permission)
    - [Role](#role)
  - [Event Names](#event-names)
    - [UserRegistered](#userregistered)
    - [UserAuthenticated](#userauthenticated)
    - [SessionExpired](#sessionexpired)
  - [Commands](#commands)
    - [RegisterUser](#registeruser)
    - [AuthenticateUser](#authenticateuser)
    - [AssignRole](#assignrole)
  - [Queries](#queries)
    - [GetUserPermissions](#getuserpermissions)
    - [ValidateSession](#validatesession)
  - [Value Objects](#value-objects)
    - [Password](#password)
    - [Token](#token)
  - [Notes](#notes)

## Terms

### User Identity

- **Definition**: The unique representation of a user in the system
- **Context**: Core concept used for authentication and session management
- **Examples**: Email/password combination, OAuth identity
- **Related Terms**: Credentials, Session
- **Code References**: `UserIdentity.ts`

### Credentials

- **Definition**: Information used to authenticate a user
- **Context**: Used during login and authentication processes
- **Examples**: Password hash, API keys, OAuth tokens
- **Related Terms**: User Identity
- **Code References**: `Credentials.ts`

### Session

- **Definition**: A period of authenticated user activity
- **Context**: Maintained after successful authentication
- **Examples**: Web session, API session
- **Related Terms**: User Identity, Token
- **Code References**: `Session.ts`

### Permission

- **Definition**: A specific action that can be authorized
- **Context**: Used for fine-grained access control
- **Examples**: "create:user", "read:profile", "update:settings"
- **Related Terms**: Role, Policy
- **Code References**: `Permission.ts`

### Role

- **Definition**: A named collection of permissions
- **Context**: Used for grouping related permissions
- **Examples**: Admin, User, Guest
- **Related Terms**: Permission, Policy
- **Code References**: `Role.ts`

## Event Names

### UserRegistered

- **Description**: A new user has completed registration
- **Trigger**: Successful user registration process
- **Data**: userId, email, registrationMethod
- **Consumers**: Email service, Profile service
- **Business Impact**: New user account creation

### UserAuthenticated

- **Description**: A user has successfully authenticated
- **Trigger**: Successful login
- **Data**: userId, timestamp, authMethod
- **Consumers**: Session management, Audit logging
- **Business Impact**: User access tracking

### SessionExpired

- **Description**: A user's session has ended
- **Trigger**: Timeout or explicit logout
- **Data**: sessionId, userId, expirationReason
- **Consumers**: Session cleanup, Security monitoring
- **Business Impact**: Security boundary enforcement

## Commands

### RegisterUser

- **Purpose**: Create a new user account
- **Preconditions**: Email not already registered
- **Parameters**: email, password, profile data
- **Outcome**: New user created or validation error
- **Side Effects**: UserRegistered event emitted

### AuthenticateUser

- **Purpose**: Verify user credentials and create session
- **Preconditions**: User exists
- **Parameters**: email, password
- **Outcome**: Session token or authentication error
- **Side Effects**: UserAuthenticated event emitted

### AssignRole

- **Purpose**: Grant a role to a user
- **Preconditions**: Role exists, user exists
- **Parameters**: userId, roleId
- **Outcome**: Role assigned or error
- **Side Effects**: UserRoleAssigned event emitted

## Queries

### GetUserPermissions

- **Purpose**: Retrieve all permissions for a user
- **Parameters**: userId
- **Returns**: List of Permission objects
- **Use Cases**: Access control checks

### ValidateSession

- **Purpose**: Check if a session is valid
- **Parameters**: sessionToken
- **Returns**: Session validity status
- **Use Cases**: API request authentication

## Value Objects

### Password

- **Definition**: A securely hashed password
- **Validation Rules**: Minimum length, complexity requirements
- **Behavior**: Hashing, validation
- **Usage**: User authentication

### Token

- **Definition**: A cryptographic token for session identification
- **Validation Rules**: Format, expiration
- **Behavior**: Generation, validation
- **Usage**: Session management

## Notes

- Terms should align with OAuth 2.0 and OpenID Connect where applicable
- Security-related terms should follow industry standards
- Deprecated authentication methods should be clearly marked
- New authentication methods should be documented here first 