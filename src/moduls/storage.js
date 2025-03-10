import { tasks } from "./ui.js";

export class Storage {
  storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "storage_Test";
      storage.setItem("storage_key", x);
      storage.removeItem("storage_key");
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        storage &&
        storage.length !== 0
      );
    }
  }

  addNewProject(project) {
    if (this.storageAvailable("localStorage")) {
      const projectString = project;
      const storedString = JSON.parse(localStorage.getItem("projects"));
      storedString.push(projectString);
      localStorage.setItem("projects", JSON.stringify(storedString));
    }
  }
  storeProjects() {
    if (this.storageAvailable("localStorage")) {
      const projects = ["Today", "Week", "Work"];
      //const projects = ["Today", "Week", "Work"];
      const projectsString = JSON.stringify(projects);
      localStorage.setItem("projects", projectsString);
    } else {
      // Too bad, no localStorage for us
    }
  }

  storeTasks(userDetails) {
    const userInput = userDetails;
    tasks.push(userInput);
  }

  sortTasksByDate(array, dateKey, ascending = true) {
    return array.slice().sort((a, b) => {
      const dateA = new Date(a[dateKey]);
      const dateB = new Date(b[dateKey]);

      if (ascending) {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }
}
