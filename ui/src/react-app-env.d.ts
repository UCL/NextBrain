/// <reference types="react-scripts" />

// declaring modules here fixes linting errors when no type declarations can be found for a library
// https://stackoverflow.com/questions/56351599/error-could-not-find-a-declaration-file-for-module-react-search-input

declare module "npyjs"; // no types available, library still in its infancy
declare module "ndarray"; // types have been installed but I still get a linting error
