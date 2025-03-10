import { Storage } from "./storage.js";
import { EventHandlers } from "./eventHandlers.js";
import { format } from "date-fns-tz";
import { enUS } from "date-fns/locale";
import flatpickr from "flatpickr";
import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate.js";
import "flatpickr/dist/flatpickr.min.css";

export let tasks = [
  {
    title: "Pay-bills",
    descriptiopn: "Pay electric bill",
    priority: "low",
    project: "Today",
    date: "04/03/2024",
  },
  {
    title: "Learn JS",
    descriptiopn: "Finish the projects",
    priority: "medium",
    project: "Today",
    date: "04/05/2022",
  },
  {
    title: "Gym",
    descriptiopn: "Work hard",
    priority: "high",
    project: "Week",
    date: "01/01/2025",
  },
];

export class UI {
  storage = new Storage();
  eventHandle = new EventHandlers();
  calander = () => {
    const dateInput = document.getElementById("datetimepicker");

    flatpickr("#datetimepicker", {
      enableTime: true,
      plugins: [new confirmDatePlugin({})],
      showAlways: false,
      time_24hr: true,
      dateFormat: "Z",
      altInput: true,
      altFormat: "d/m/Y H:i",
      defaultDate: new Date(),
      minDate: "today",
      onChange: function (dateStr) {
        dateInput.value = dateStr;
      },
    });
  };

  /////////////////////////// delete after inspection
  /*  formatDate(datenew)
     {
         date = datenew.matc;
         const formatted = 'dd/mm/yyyy';
         return formatted;
     }; */
  getCurrentdate = () => {
    const nowUtc = new Date();
    const formatteddate = format(nowUtc, "dd/MM/yyyy");
    const formattedTime = format(nowUtc, "HH:mm:ss");
    return { formattedTime, formatteddate, nowUtc };
  };

  addClock = () => {
    const clock = document.getElementById("clock");
    const date = document.createElement("p");
    const hour = document.createElement("p");

    clock.appendChild(date);
    clock.appendChild(hour);
    let getnowCurrentDate = () => {
      this.getCurrentdate();
      hour.innerHTML = this.getCurrentdate().formattedTime;
    };
    const currentDay = format(this.getCurrentdate().nowUtc, "EEEE", {
      locale: enUS,
    });
    date.innerHTML = `Happy ${currentDay}!`;
    const intevalTime = setInterval(getnowCurrentDate, 1000);
  };

  validate = (inputID) => {
    const input = document.getElementById(inputID);
    const validityState = input.validity;

    if (validityState.valueMissing) {
      input.setCustomValidity("empty");
    } else if (validityState.rangeUnderflow) {
      input.setCustomValidity("We need a higher number!");
    } else if (validityState.rangeOverflow) {
      input.setCustomValidity("That's too high!");
    } else {
      input.setCustomValidity("");
    }

    input.reportValidity();
    const isvalid = input.validity.valid;
    const errorReason = input.validityState;

    return { isvalid, errorReason };
  };

  addInputsListenrers = (className) => {
    let formFields = document.getElementsByClassName(className);

    formFields = Array.from(formFields);
    if (formFields.length > 1) {
      formFields.forEach((el) => {
        if (el.id !== "") {
          this.eventHandle.blur_inputValidate(el);
          this.eventHandle.focus_inputValidate(el);
        }
      });
    } else if (formFields.length === 1) {
      this.eventHandle.blur_inputValidate(formFields[0]);
      this.eventHandle.focus_inputValidate(formFields[0]);
    }
  };

  addButton = () => {
    const newTaskBtn = document.getElementById("floating-button");
    const newTaskDialog = document.getElementById("new-task-popup");
    const overlay = document.getElementById("overlay");
    const newtaskForm = document.getElementById("newtaskForm");
    const inputValues = Array.from(
      newtaskForm.querySelectorAll("input, select, textarea"),
    ).filter((element) => element.name);

    newTaskBtn.addEventListener("click", () => {
      this.calander();
      inputValues.forEach((input) => {
        // this.addInputsListenrers(input.className);
        this.eventHandle.blur_inputValidate(input);
        this.eventHandle.focus_inputValidate(input);
      });

      overlay.style.display = "block";
      newTaskDialog.show();
    });
  };
  newProject = () => {
    const addProjectBtn = document.getElementById("new-project-button");
    const newProjectPopup = document.getElementById("new-project-popup");
    const newProjectField = document.getElementById("new-project-name");
    const overlay = document.getElementById("overlay");

    addProjectBtn.addEventListener("click", () => {
      // this.addInputsListenrers('new-project-input');

      overlay.style.display = "block";
      newProjectPopup.show();
      //   this.eventHandle.blur_inputValidate(newProjectField);
      // this.eventHandle.focus_inputValidate(newProjectField);
    });
  };

  getNewProjectDetails = () => {
    const dialogConfirmBtn = document.getElementById("confirm-project-Btn");
    const dialogCancelBtn = document.getElementById("cancel-project-Btn");
    const newProjectForm = document.getElementById("new-project-form");
    const newProjectDialog = document.getElementById("new-project-popup");
    const overlay = document.getElementById("overlay");

    dialogConfirmBtn.addEventListener("click", (event) => {
      const validateField = this.eventHandle.submitButtonValidation();
      if (!validateField) {
        console.error("filed is empty");
      } else {
        const projectMenu = document.getElementById("projects-menu");
        const projectList = document.getElementById("projects-menu-list");
        const listElement = document.createElement("div");
        const selectParentDiv = document.getElementById("dialog-taks-inputs");
        const selectDiv = document.getElementById("new-task-project");

        const newOptions = document.createElement("select");

        projectMenu.removeChild(projectList);
        listElement.id = "projects-menu-list";
        projectMenu.appendChild(listElement);

        selectParentDiv.removeChild(selectDiv);

        newOptions.id = "new-task-project";
        newOptions.name = "new-task-project";

        selectParentDiv.appendChild(newOptions);

        const formData = new FormData(newProjectForm);
        const userProjectName = formData.get("project-name");
        this.getNewProjectName = () => {
          return userProjectName;
        };
        this.storage.addNewProject(this.getNewProjectName());
        this.createProjectList();
        // event.preventDefault();

        newProjectForm.reset();
        overlay.style.display = "none";
        newProjectDialog.close();

        console.info("Field input is validate");
      }
    });
    dialogCancelBtn.addEventListener("click", () => {
      newProjectForm.reset();
      newProjectDialog.close();
      overlay.style.display = "none";
    });
  };

  homePage = () => {
    const homeBtn = document.getElementById("home-button");
    homeBtn.addEventListener("click", () => {
      this.renderProjectPage("home");
    });
  };

  createProjectList = () => {
    const projectList = localStorage.getItem("projects");
    const storedProjectsList = JSON.parse(projectList);
    const projectMenu = document.getElementById("projects-menu-list");

    const projectsListDropdown = document.getElementById("new-task-project");

    if (this.storage.storageAvailable) {
      storedProjectsList.forEach((project) => {
        const popupProjectsDropdown = document.createElement("option");
        popupProjectsDropdown.text = project;
        popupProjectsDropdown.value = project;
        projectsListDropdown.appendChild(popupProjectsDropdown);

        const projectMenuItems = document.createElement("button");
        projectMenuItems.textContent = `#${project}`;
        projectMenuItems.id = `project-menu-${project}`;
        projectMenuItems.addEventListener("click", () => {
          this.renderProjectPage(project);
        });
        projectMenu.appendChild(projectMenuItems);
      });
    }
  };

  createTaskCard = (task, project) => {
    const projectPage = document.getElementById(`${project}-page`);
    const taskCard = document.createElement("div");
    taskCard.id = `${task.title}-card`;

    if (task.priority === "low")
      taskCard.style.border = " 3px solid rgba(131, 175, 161, 0.47)";
    if (task.priority === "medium") taskCard.style.border = "3px solid #F8EDB4";
    if (task.priority === "high")
      taskCard.style.border = "5px solid rgba(188, 75, 81, 0.66)";

    const cardTitle = document.createElement("p");
    cardTitle.innerHTML = "Title:";
    cardTitle.className = "card-label";

    const cardtasktitle = document.createElement("p");
    cardtasktitle.id = `${task.title}-card-title`;
    cardtasktitle.className = "task-label";
    cardtasktitle.innerHTML = task.title;

    const cardDesc = document.createElement("p");
    cardDesc.className = "card-label";
    cardDesc.innerHTML = "Description:";

    const cardTaskDesc = document.createElement("p");
    cardTaskDesc.id = `${task.title}-card-desc`;
    cardTaskDesc.className = "task-label";
    cardTaskDesc.innerHTML = task.descriptiopn;

    const cardTaskProject = document.createElement("span");
    cardTaskProject.id = `${task.project}-card-project`;
    cardTaskProject.innerHTML = `#${task.project}`;

    const cardDate = document.createElement("p");
    cardDate.className = "card-label";
    cardDate.innerHTML = "Date:";

    const cardTaskDateContainer = document.createElement("div");
    cardTaskDateContainer.id = `${task.title}-card-date-contianer`;
    const cardTaskDate = document.createElement("p");
    const cardTaskHour = document.createElement("p");
    cardTaskDate.id = `${task.title}-card-date`;
    cardTaskDate.className = `label-date-hour`;
    cardTaskHour.className = `label-date-hour`;
    cardTaskHour.id = `${task.title}-card-hour`;
    cardTaskDate.innerHTML = `Date: ${format(task.date, "dd/MM/yyyy")}`;
    cardTaskHour.innerHTML = `Hour: ${format(task.date, "HH:mm")}`;

    cardTaskDateContainer.appendChild(cardTaskHour);
    cardTaskDateContainer.appendChild(cardTaskDate);

    taskCard.appendChild(cardTitle);
    taskCard.appendChild(cardtasktitle);
    taskCard.appendChild(cardDesc);
    taskCard.appendChild(cardTaskDesc);
    taskCard.appendChild(cardTaskProject);
    taskCard.appendChild(cardTaskDateContainer);

    projectPage.appendChild(taskCard);
  };

  renderProjectPage = (project) => {
    const content = document.getElementById("content");
    if (content && content.firstChild) {
      content.removeChild(content.firstElementChild);
    }
    const sortedTasks = this.storage.sortTasksByDate(tasks, "date", false);

    const projectPage = document.createElement("div");
    projectPage.id = `${project}-page`;
    content.appendChild(projectPage);

    const refreshPageItem = () => {
      sortedTasks.forEach((task) => {
        if (project === "home") {
          this.createTaskCard(task, project);
        }
        if (task.project === project) {
          this.createTaskCard(task, project);
        }
      });
    };
    refreshPageItem();
  };

  getNewTaskDetails = () => {
    const dialogConfirmBtn = document.getElementById("confirmBtn");
    const dialogCancelBtn = document.getElementById("cancelBtn");
    const newtaskForm = document.getElementById("newtaskForm");
    const newTaskDialog = document.getElementById("new-task-popup");
    const overlay = document.getElementById("overlay");

    dialogConfirmBtn.addEventListener("click", (event) => {
      const inputsElements = document.getElementsByClassName("new-task-input");
      const inputsElementsArray = Array.from(inputsElements);
      let fieldValidate = true;

      event.preventDefault();
      const formData = new FormData(newtaskForm);
      const userTaskTitle = formData.get("task-title");
      const userTaskDesc = formData.get("task-description");
      const userTaskPriority = formData.get("task-priority");
      const userTaskProject = formData.get("new-task-project");
      const userTaskDate = formData.get("datetimepicker");

      const pageContent = document.getElementById(`${userTaskProject}-page`);

      const getUSerTaskDetails = () => {
        return {
          title: userTaskTitle,
          descriptiopn: userTaskDesc,
          priority: userTaskPriority,
          project: userTaskProject,
          date: userTaskDate,
        };
      };
      const storeData = () => {
        this.storage.storeTasks(getUSerTaskDetails());
        tasks = this.storage.sortTasksByDate(tasks, "date");
      };
      const closePopUp = () => {
        storeData();

        newtaskForm.reset();
        overlay.style.display = "none";
        newTaskDialog.close();

        if (pageContent !== null) {
          if (
            pageContent.id === `${userTaskProject}-page` ||
            pageContent.id === "home-page"
          ) {
            this.renderProjectPage(userTaskProject);
          }
        } else {
          const pageContent =
            document.getElementById("content").firstElementChild;

          if (pageContent.id === "home-page") {
            const task = pageContent.id.split("-");
            this.renderProjectPage(task[0]);
          }
        }
      };

      inputsElementsArray.every((el) => {
        //this.eventHandle.inputValidation(el.id)
      });
      /*
                         if (el.id != '')
                         {
                            fieldValidate= this.validate(el.id).isvalid;
                         
                         if (fieldValidate)
                            {
                            return true;    
                           }
    
                            if(!fieldValidate)
                            {
                           const error = this.validate(el.id).errorReason;
                           return false, error;
                             }
                            }
                            }); */

      if (fieldValidate) {
        closePopUp();
      } else if (fieldValidate.errorReason) {
        /* console.log(error) */
      }
    });

    dialogCancelBtn.addEventListener("click", () => {
      overlay.style.display = "none";
      newTaskDialog.close();
      newtaskForm.reset();
    });
  };
}
