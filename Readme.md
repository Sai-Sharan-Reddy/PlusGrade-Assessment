# Tax Calculator Application

### 1. How to Start the Application

#### Install dependencies
```
npm install
```

#### Run the development server
```
npm run dev

```

## Features Available in the Application

#### Dynamic Form Input
> Accepts Annual Income and Tax Year (2019 – 2022).

#### API-based Tax Brackets
> Fetches brackets per year from 
>> http://localhost:5001/tax-calculator/tax-year/:year. (when the provided docker image is run on the local server)

#### Accurate Tax Computation

> Calculates per-band taxable income and tax owed.

> Aggregates total tax and effective rate (raw numbers, formatted in UI).

#### Detailed Result Table
> Displays each band’s range, rate, taxable amount, and tax due.

#### Robust Error Handling
> Gracefully handles API failures
> Includes Error Boundaries to handle lifecycle errors (Reused the GeneralError for now, can have another component as a additional enhancement)

#### Complete Test Coverage

> Unit & integration tests via Jest.
> Full browser flow via Cypress.

--------------------------------------------

## Test Strategy & Setup

### Jest + React Testing Library → component and logic tests.

```
npm install
npm test
```

### Cypress → E2E.

```
npm run dev (start the server)
npx cypress open (open cypress in another terminal)
```

## Future(posible) Enhancements `Avoided here due to over engineering concerns.`

#### Caching
> Client side caching can be achieved using Redis (or any LRU-cache).

> LocalStorage (along with TTL) or SessionStorage can be used if required.

#### Performance Optimizations
> Optimizations like lazy loading can be applied to components like `Tax table (TaxInfo)`, which can be loaded only when the tax calculations are in progress and can be removed from the initial page load.

#### Logging
> Current application uses console for the logging, could implement tools like log4js and sentry for logging purposes based on the requirements.



### Limitation 
> Select dropdown (popup), has the default width (OS behaviour). 