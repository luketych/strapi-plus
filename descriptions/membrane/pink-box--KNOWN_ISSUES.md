https://forum.strapi.io/t/getting-an-error-err-invalid-arg-type-the-path-argument/26952/4

When running `npm install`

“error The “path” argument must be of type string or an instance of Buffer or URL. Received null”

Why?

Because a yarn.lock/ folder might exist or package-lock.json / . (Or possibly an out-of-date node_modules/).

My issue was that I had a yarn.lock/ folder, even though I was using npm, so I overlooked that possiblity.
