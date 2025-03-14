# Ubiquitous Language - Billing Domain

This document captures the ubiquitous language used in the billing domain.

## Table of Contents

- [Ubiquitous Language - Billing Domain](#ubiquitous-language---billing-domain)
  - [Table of Contents](#table-of-contents)
  - [Terms](#terms)
    - [Invoice](#invoice)
    - [Payment](#payment)
    - [PaymentMethod](#paymentmethod)
    - [Subscription](#subscription)
    - [Price](#price)
  - [Event Names](#event-names)
    - [PaymentProcessed](#paymentprocessed)
    - [SubscriptionRenewed](#subscriptionrenewed)
    - [PaymentFailed](#paymentfailed)
  - [Commands](#commands)
    - [ProcessPayment](#processpayment)
    - [CreateSubscription](#createsubscription)
    - [UpdatePaymentMethod](#updatepaymentmethod)
  - [Queries](#queries)
    - [GetInvoiceHistory](#getinvoicehistory)
    - [GetSubscriptionStatus](#getsubscriptionstatus)
  - [Value Objects](#value-objects)
    - [Currency](#currency)
    - [Money](#money)
  - [Notes](#notes)

## Terms

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

- Terms should align with payment industry standards
- Currency handling should follow ISO 4217
- Payment method security follows PCI compliance
- Deprecated payment methods should be marked 