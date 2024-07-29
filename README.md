# Squirrel Fund

## Overview

Squirrel Fund is a web application built with Next.js and SST, designed to help users manage their savings and deposits. The application allows users to track their fund balances, make deposits, and view their transaction history.

## Features

- User authentication with AWS Cognito
- Real-time balance tracking
- Deposit and withdrawal management
- Interactive charts for visualizing fund performance
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend**: 
  - Next.js
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Recharts
- **Backend**: 
  - AWS Lambda
  - DynamoDB
  - S3 Bucket
- **Auth**:
  - AWS Amplify
  - Cognito

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- pnpm
- AWS account for Amplify services

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JasonDL-trajector/squirrel-fund.git
cd squirrel-fund

```

2. Install dependencies:

```bash
pnpm install
```

### Running the Application

To start the development server, run:


```bash
pnpm run dev

```

For the front-end:

```bash
cd packages/frontend
pnpm run dev

```


Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

### Deployment

This has been deployed using SST as its framework. All resources of this project can be navigated through AWS Console's Cloudformation.
