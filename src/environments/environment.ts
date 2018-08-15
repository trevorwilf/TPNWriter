// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseconfig: {
    apiKey: 'AIzaSyBKblNNmXP62HV4H9X280ZzFbRTS4d3cP8',
    authDomain: 'tpnwriterdev.firebaseapp.com',
    databaseURL: 'https://tpnwriterdev.firebaseio.com',
    projectId: 'tpnwriterdev',
    storageBucket: 'tpnwriterdev.appspot.com',
    messagingSenderId: '88470433725'
  }
};
