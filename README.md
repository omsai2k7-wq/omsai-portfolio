 # OMSAI / Private Digital Archive

 An editorial React and Vite portfolio for P. OMSAI REDDY, a Computer Science undergraduate at REVA University.

 ## Run locally

 ```bash
 npm install
 npm run dev
 ```

 ## Adriel

 Adriel is the archive's assistant interface. Without configuration it answers from the verified local portfolio record and clearly identifies unknown information. To connect a general-purpose model, expose a secure server-side proxy and set:

 ```env
 VITE_ADRIEL_ENDPOINT=/api/adriel
 ```

 The endpoint should accept `{ "messages": [...] }` and return `{ "message": "..." }`. Provider API keys must remain on the server and must never be placed in `VITE_*` variables or committed to the frontend.

 ## Build

 ```bash
 npm run build
 npm run lint
 ```
