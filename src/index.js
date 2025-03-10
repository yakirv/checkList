import "./styles.css";

import { UI } from "./moduls/ui.js";
import { Storage } from "./moduls/storage.js";


const ui = new UI();
ui.renderProjectPage("home");
ui.addButton();
ui.homePage();
ui.newProject();
ui.createProjectList();
ui.getNewTaskDetails();
ui.getNewProjectDetails();
ui.addClock();

const storage = new Storage();
storage.storeProjects();
