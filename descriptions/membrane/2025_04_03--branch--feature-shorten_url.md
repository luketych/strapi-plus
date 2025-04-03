16:51

The objective of this feature branch is to reimplement the part of the strapi /upload enpoint that shortens the URL before returning to the requester.

In the past I was using the short.io API. Now I will be using a custom-deployed kutt URL shortening API running at https://ktrx.cards.

I am not sure whether I should create a strapi plugin for this, or do it directly inside of the code. Maybe I will try editing the code directly, in order to thread the needle and get things working in the easiest way possible first. And then I can start to do it properly, add layers of stability to it, etc, etc.
