import next from '@adysre/config/eslint/next';

export default [
  ...(Array.isArray(next) ? next : [next]),
  {
    /*
     * A template's `static/` folder is the plain HTML/CSS/JS build that ships
     * inside its download: browser code for someone else's project, not app
     * source. Linting it against our Node/React rules only produces noise
     * about globals it is entitled to use.
     */
    ignores: ['src/components/templates/*/static/**'],
  },
];
