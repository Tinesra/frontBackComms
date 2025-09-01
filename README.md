This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Project Overview

This project is a React application that demonstrates form handling and API interactions. It includes:

- User registration form with username and password fields
- API integration for creating user accounts
- Responsive design with custom styling

### Project Structure

- `src/app/components/` - Contains reusable UI components
- `src/lib/` - Contains utility functions and API client
- `public/` - Static assets and images

### Features

- Form validation for required fields
- API error handling and success messages
- Clean user interface with custom styling

## Environment Setup

Create a .env.local file in the root directory with the following variable:
```bash
NEXT_PUBLIC_API_URL=given_baseUrl
```
- Replace given_baseUrl with the given base URL.
