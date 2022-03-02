# Full-stack development boilerplate

This is a starter package that'll help me get coding faster than before.
This start package includes the boilerplate code and setup that I'd otherwise need to work out every time I start an app.

The steps that this boilerplate takes care of:
1. `git init` and `.gitignore` with necessary ignore rules
2. `backend` and `frontend` folders separate code
3. `.env` contains basic secrets. This file is ignored by Git, so see the sample in `env.txt` instead.
4. `nodemon` and `webpack` scripts in `package.json`
5. `webpack.config.js` set up to work with `.js` files in the `frontend` folder
6. `backend` folder separates code according MVC
7. `frontend` folder separates development `src` from what lands on an actual web server `public`