# Full-stack development boilerplate

This is a starter package that'll help me get coding faster than before.
The package includes the boilerplate code and setup that I'd otherwise need to flesh out every time I start working on an app.

The package takes the following steps:
1. `.gitignore` contains necessary ignore rules
2. `backend` and `frontend` folders separate code
3. `.env` contains basic secrets. This file is ignored by Git, so see the sample in `env.txt` instead
4. Starter scripts added to `package.json`
5. `webpack.config.js` is set up to work with `.js` files in the `frontend` folder
6. `backend` folder separates code according to MVC
7. `frontend` folder separates development (`src`) from what lands on an actual website (`public`)