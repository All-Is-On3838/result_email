Note from Allison:
- Function requires test info pdfs to be in root folder
- Instead we can call pdfs from cloud storage? 

<br> function currently assumes uid is stored in patient document as "user_id" and email is stored in user document as "email"

Useful Commands
<br> firebase emulators:start
<br> (when cd'd into the functions folder) npm run-script build

<br> folder structure (--| folder    --|> file)
<br> |-functions
<br> ----|-lib
<br> --------|> index.js
<br> --------|> index.js.map
<br> --------|> Flu.pdf
<br> --------|> RSV.pdf
<br> --------|> Strep.pdf
<br> ----|-src
<br> --------|> index.ts
<br> ----|> .env
