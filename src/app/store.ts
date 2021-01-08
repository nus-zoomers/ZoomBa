/* eslint-disable @typescript-eslint/no-explicit-any */
/*
Adapted from
https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
*/
import { app, remote } from 'electron';
import path from 'path';
import fs from 'fs';

function parseDataFile(filePath: string, defaults: any) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

class Store {
  path: string;

  data: any;

  constructor(opts: { configName: string; defaults: any }) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (app || remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, `${opts.configName}.json`);

    this.data = parseDataFile(this.path, opts.defaults);
  }

  // This will just return the property on the `data` object
  get(key: string | number) {
    return this.data[key];
  }

  // ...and this will set it
  set(key: string | number, val: any) {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data));
    } catch (e) {
      throw new Error('Failed to save!');
    }
  }
}

// expose the class
export default Store;

export const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 1024x728 is the default size of our window
    windowBounds: { width: 1024, height: 728 },
    script: { content: '', name: '', prompt: '' },
  },
});
