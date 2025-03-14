# Aggregated Ubiquitous Language

This document is automatically generated from individual domain ubiquitous language files.

## Terms

### auth

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

### domain-core

### Entity

- **Definition**: An object that has a distinct identity that runs through time and different states
- **Context**: Used as a base class for domain objects that need identity and lifecycle
- **Examples**: User, Order, Product
- **Related Terms**: Aggregate Root, Value Object
- **Code References**: `Entity.ts`, `BaseEntity.ts`

### Value Object

- **Definition**: An immutable object that describes some characteristic or attribute but carries no concept of identity
- **Context**: Used for objects that are defined by their attributes rather than identity
- **Examples**: Address, Money, DateRange
- **Related Terms**: Entity
- **Code References**: `ValueObject.ts`

### Aggregate Root

- **Definition**: The main entity in a cluster of domain objects that guarantees the consistency of changes being made within the aggregate
- **Context**: Used as the main entry point for modifying a group of related objects
- **Examples**: Order (containing OrderLines), User (containing Preferences)
- **Related Terms**: Entity, Domain Event
- **Code References**: `AggregateRoot.ts`

### billing

### Invoice

- **Definition**: A document detailing charges for products or services
- **Context**: Generated for customer billing cycles
- **Examples**: Monthly subscription invoice, One-time purchase invoice
- **Related Terms**: Payment, Currency
- **Code References**: `Invoice.ts`

### Payment

- **Definition**: A monetary transaction from customer to business
- **Context**: Used to settle invoices
- **Examples**: Credit card payment, Bank transfer
- **Related Terms**: Invoice, PaymentMethod
- **Code References**: `Payment.ts`

### PaymentMethod

- **Definition**: A stored method for processing payments
- **Context**: Used for recurring and one-time payments
- **Examples**: Credit card, Bank account, Digital wallet
- **Related Terms**: Payment
- **Code References**: `PaymentMethod.ts`

### Subscription

- **Definition**: A recurring billing agreement
- **Context**: Used for services billed on a regular schedule
- **Examples**: Monthly service plan, Annual membership
- **Related Terms**: Invoice, Payment
- **Code References**: `Subscription.ts`

### Price

- **Definition**: The monetary amount for a product or service
- **Context**: Used in product pricing and invoicing
- **Examples**: Base price, Discounted price
- **Related Terms**: Currency, Tax
- **Code References**: `Price.ts`

## Event Names

### auth

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

### domain-core

### Domain Event

- **Definition**: Something that happened in the domain that domain experts care about
- **Context**: Used to notify other parts of the system about changes in the domain
- **Data**: eventId, eventType, occurredOn, aggregateId, version, payload
- **Consumers**: Event handlers in other domains/bounded contexts
- **Code References**: `DomainEvent.ts`

### billing

### PaymentProcessed

- **Description**: A payment has been successfully processed
- **Trigger**: Successful payment processing
- **Data**: paymentId, amount, method, timestamp
- **Consumers**: Accounting service, Customer notification
- **Business Impact**: Revenue recognition

### SubscriptionRenewed

- **Description**: A subscription has been automatically renewed
- **Trigger**: Subscription renewal date
- **Data**: subscriptionId, customerId, planId, nextRenewalDate
- **Consumers**: Invoice generation, Customer notification
- **Business Impact**: Recurring revenue maintenance

### PaymentFailed

- **Description**: A payment attempt was unsuccessful
- **Trigger**: Failed payment processing
- **Data**: paymentId, error, attemptCount
- **Consumers**: Retry system, Customer notification
- **Business Impact**: Revenue risk

## Commands

### auth

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

### domain-core

### Command

- **Definition**: A request for the system to perform an action that changes state
- **Context**: Used to encapsulate and validate state changes
- **Parameters**: Depends on the specific command
- **Outcome**: State change or validation error
- **Code References**: `Command.ts`

### billing

### ProcessPayment

- **Purpose**: Execute a payment transaction
- **Preconditions**: Valid payment method, sufficient funds
- **Parameters**: amount, paymentMethodId, currency
- **Outcome**: Payment processed or failure
- **Side Effects**: PaymentProcessed or PaymentFailed event

### CreateSubscription

- **Purpose**: Start a new subscription
- **Preconditions**: Valid customer and plan
- **Parameters**: customerId, planId, paymentMethodId
- **Outcome**: New subscription or error
- **Side Effects**: SubscriptionCreated event

### UpdatePaymentMethod

- **Purpose**: Modify stored payment information
- **Preconditions**: Customer exists
- **Parameters**: customerId, paymentMethodDetails
- **Outcome**: Updated payment method or error
- **Side Effects**: PaymentMethodUpdated event

## Queries

### auth

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

### domain-core

### Query

- **Definition**: A request for information that doesn't change state
- **Context**: Used to retrieve data from the system
- **Parameters**: Search/filter criteria specific to the query
- **Returns**: Requested data or null
- **Code References**: `Query.ts`

### billing

### GetInvoiceHistory

- **Purpose**: Retrieve customer's invoice history
- **Parameters**: customerId, dateRange
- **Returns**: List of Invoice objects
- **Use Cases**: Customer billing review

### GetSubscriptionStatus

- **Purpose**: Check current subscription state
- **Parameters**: subscriptionId
- **Returns**: Subscription status and details
- **Use Cases**: Account management

## Value Objects

### auth

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

### billing

### Currency

- **Definition**: A monetary unit used for billing
- **Validation Rules**: ISO currency code format
- **Behavior**: Conversion, formatting
- **Usage**: Prices, payments, invoices

### Money

- **Definition**: An amount in a specific currency
- **Validation Rules**: Non-negative, precision rules
- **Behavior**: Arithmetic operations, formatting
- **Usage**: Payment processing, invoicing

## Notes

### auth

- Terms should align with OAuth 2.0 and OpenID Connect where applicable
- Security-related terms should follow industry standards
- Deprecated authentication methods should be clearly marked
- New authentication methods should be documented here first

### domain-core

- These terms form the foundation of our domain-driven design implementation
- All domains should use these terms consistently
- Implementation details may vary but concepts remain constant
- New core concepts should be added here as they emerge

### billing

- Terms should align with payment industry standards
- Currency handling should follow ISO 4217
- Payment method security follows PCI compliance
- Deprecated payment methods should be marked

## Interfaces

### domain-core

### Event Validator

- **Definition**: A contract for validating domain events
- **Context**: Used to ensure events contain valid data before processing
- **Validation Rules**: Defined per event type
- **Usage**: Event bus validation, command validation
- **Code References**: `EventValidator.ts`

### Event Bus

- **Definition**: A mechanism for publishing and subscribing to domain events
- **Context**: Used for event-driven communication between domains
- **Behavior**: Publishes events, notifies subscribers
- **Usage**: Cross-domain communication
- **Code References**: `IEventBus` in `DomainEvent.ts`

