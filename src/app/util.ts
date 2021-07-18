export const promisify = (f) => function(...args) {
    return new Promise((resolve, reject) => {
      function callback(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // append our custom callback to the end of f arguments

      f.call(this, ...args); // call the original function
    });
  };

export const sleep = (time): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

export const buildPowerShellCmd = (cmd): string => `powershell.exe -Command "& {${cmd}}"`;
