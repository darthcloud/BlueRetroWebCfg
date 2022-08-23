export const ChromeSamples = {
    log: function () {
      var line = Array.prototype.slice
        .call(arguments)
        .map(function (argument) {
          return typeof argument === "string"
            ? argument
            : JSON.stringify(argument);
        })
        .join(" ");
      let temp = document.querySelector("#log").textContent;
      document.querySelector("#log").textContent = line + "\n" + temp;
    },
  
    clearLog: function () {
      document.querySelector("#log").textContent = "";
    },
  
    setStatus: function (status) {
      document.querySelector("#status").textContent = status;
    },
  
    setContent: function (newContent) {
      var content = document.querySelector("#content");
      while (content.hasChildNodes()) {
        content.removeChild(content.lastChild);
      }
      content.appendChild(newContent);
    },
  };

  export default ChromeSamples