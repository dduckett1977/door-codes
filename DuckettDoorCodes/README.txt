DUCKETT DOOR CODES, LIVE SYNC VERSION
duckettmgmt.com

WHAT THIS IS
A private door code app for you and Brandon. Both phones see the same codes, and changes show up on the other phone within about 20 seconds. Everything is encrypted before it leaves the phone. The server only stores scrambled data.

PASSPHRASE
Use the passphrase you chose. You can change it any time in the app under Menu. After a change, the other phone is asked to unlock again with the new one.

OPTION 1: DEPLOY WITH GITHUB (recommended, set it and forget it)
1. Create a free GitHub account if needed, then make a new PRIVATE repository.
2. Unzip this folder. On the repository page choose Add file, then Upload files. Drag in everything inside the DuckettDoorCodes folder, including the netlify and public folders. Commit.
3. In Netlify choose Add new site, then Import an existing project, then GitHub, and pick the repository. Leave the settings as they are. The netlify.toml file already tells Netlify what to publish. Click Deploy.
4. When it finishes, open Site configuration and Change site name to something nobody would guess.
5. Open the site and unlock it once. The first unlock loads your starting codes onto the server. Do this right after deploying.
6. Send Brandon the link and the passphrase. On iPhone use Share, then Add to Home Screen.

OPTION 2: DEPLOY WITH THE NETLIFY COMMAND LINE
1. Install Node.js, then in a terminal run: npm install netlify-cli -g
2. In this folder run: npm install
3. Then run: netlify deploy --prod
Follow the prompts to create or pick a site. Then do steps 4 to 6 above.

IMPORTANT
Drag and drop deploys on Netlify do not support the sync function. Use GitHub or the command line.
The free Netlify plan covers Functions and storage for this app.
If you ever redeploy, your saved codes stay put. They live on the server, not in the files.
