window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
      const element = document.getElementById(selector);
      if (element) {
        element.innerText = text;
      }
    };
  
    for (const type of ["chrome", "node", "electron"]) {
      const version = process.versions[type as keyof NodeJS.ProcessVersions];
      if (version) {
        replaceText(`${type}-version`, version);
      }
    }
  });
