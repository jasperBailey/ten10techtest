# Ten10TechTest

## Setup

1. **Install dependencies**

    Run the following command in the project root:

    ```
    npm ci
    ```

2. **Configure environment variables**

    Copy `.env.example` to `.env` and fill in your credentials:

    ```
    cp .env.example .env
    ```

    Edit `.env` with your test user email and password.

## Running Tests

To execute the Playwright test suite, run:

```
npx playwright test
```
