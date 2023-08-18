# Goal: 
create firebase cloud function that sends result email after staff updates test result in provider portal

## Notes
- Function requires test info pdfs to be in root folder (future: instead we can call pdfs from cloud storage?) 
- function currently assumes uid is stored in patient document as "user_id" and email is stored in user document as "email"

### Useful Commands
firebase emulators:start
<br> (when cd'd into the functions folder) npm run-script build

folder structure (--| folder    --|> file)
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
