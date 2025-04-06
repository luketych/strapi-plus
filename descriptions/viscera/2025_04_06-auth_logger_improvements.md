# Plan for Auth Logger Improvements

**Goal:** Enhance logging and error recovery for authentication-related issues.

**Errors Addressed:**

*   `RangeError: Invalid time value`
*   `Error: Invalid token`

**Hypotheses:**

*   **Invalid Time Value:** The error `RangeError: Invalid time value` likely originates from lines 41 and 42 in `src/middlewares/auth-logger.js`, where the `decoded.iat` and `decoded.exp` values (representing issue and expiry timestamps) are multiplied by 1000 and passed to the `Date` constructor. This suggests that `decoded.iat` or `decoded.exp` might be undefined, null, or an invalid number, leading to an invalid date. It's also possible that these values are very large or very small, outside the range of valid dates.
*   **Invalid Token:** The "Invalid token" error likely comes from the `strapi.plugins['users-permissions'].services.jwt.verify` function on line 37 in `src/middlewares/auth-logger.js`. This could be due to several reasons:
    *   The token is malformed or corrupted.
    *   The token's signature is invalid, indicating it has been tampered with.
    *   The secret key used to sign the token is incorrect.

**Plan:**

1.  **Enhance Logging in `src/middlewares/auth-logger.js`:**
    *   **Logging for Time Value Error:**
        *   Add `strapi.log.debug({iat: typeof decoded.iat, value: decoded.iat}, 'iat value')` before line 41.
        *   Add `strapi.log.debug({exp: typeof decoded.exp, value: decoded.exp}, 'exp value')` before line 42.
        *   Add a check `if (typeof decoded.iat !== 'number' || isNaN(decoded.iat))` before line 41. If it's not a number, log an error and use a default date or skip the logging.
        *   Add a check `if (decoded.exp && (typeof decoded.exp !== 'number' || isNaN(decoded.exp)))` before line 42. If it's not a number, log an error and use a default date or skip the logging.
    *   **Logging for Invalid Token Error:**
        *   In the `catch` block (lines 68-86), add `token: tokenValue` to the error log.
2.  **Consider Error Recovery (Implementation depends on specific requirements):**
    *   Token retry mechanism (if multiple secret keys are used).
    *   Token invalidation and re-authentication.

## Mermaid Diagram

```mermaid
graph LR
    A[Start] --> B{Error: Invalid time value?};
    B -- Yes --> C{Log decoded.iat and decoded.exp values and types};
    C --> D{Check if decoded.iat and decoded.exp are valid numbers};
    D -- No --> E{Log error and use default value or skip logging};
    D -- Yes --> F{Create Date objects and log};
    B -- No --> G{Error: Invalid token?};
    G -- Yes --> H{Include original token in error log};
    H --> I{Retry token verification or invalidate token};
    G -- No --> J[End];
    F --> J;
    E --> J;
    I --> J;