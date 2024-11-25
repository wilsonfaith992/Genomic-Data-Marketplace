# Genomic Marketplace Smart Contract

## Overview
A Stacks blockchain smart contract for a decentralized genomic data marketplace where users can register, add datasets, and trade genomic information.

## Features
- User registration
- Dataset addition
- User and dataset lookup
- Basic reputation tracking

## Contract Components

### Constants
- `contract-owner`: The address that deployed the contract
- Error codes for various validation scenarios

### Data Structures
- **Users Map**: Tracks user information
    - User ID
    - Address
    - Reputation score

- **Datasets Map**: Stores genomic dataset details
    - Dataset ID
    - Owner
    - Price
    - Description
    - IPFS hash

## Key Functions

### User Registration
`register-user()`
- Allows new users to register
- Prevents duplicate registrations
- Assigns a unique user ID

### Dataset Management
`add-dataset(price, description, ipfs-hash)`
- Enables registered users to add new datasets
- Requires valid user registration
- Generates a unique dataset ID

### Read-Only Functions
- `get-dataset(dataset-id)`: Retrieve dataset details
- `get-user(user-id)`: Retrieve user information
- `get-user-id(address)`: Look up user ID by address

## Error Handling
- `err-owner-only`: Restricts actions to contract owner
- `err-not-found`: Handles non-existent user/dataset lookups
- `err-already-exists`: Prevents duplicate registrations

## Security Considerations
- Basic access control
- User registration validation
- Unique ID generation

## Potential Improvements
- Implement dataset purchase mechanism
- Add more robust reputation system
- Enhance access control
- Create transfer and deletion functions for datasets

## Deployment
Deploy on Stacks blockchain using Clarinet or similar Stacks development tools.
