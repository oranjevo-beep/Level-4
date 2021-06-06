function dataTable(config, data) {
  const table = document.createElement("table");
  const tableBody = document.createElement("tbody");
  const tableHead = document.createElement("thead");
  const parent = document.querySelector(`${config.parent}`);
  const result = config.columns.map((col) => col.title);
  const [titleName, titleSurname, titleAge] = result;
  const form = document.createElement("form");

  table.setAttribute("id", "table");

  tableHead.innerHTML = `  <tr>
    <th>#</th>
    <th>${titleName}</th>
    <th>${titleSurname}</th>
    <th>${titleAge}</th>
    <th><button id="add-btn">add user</button></th>
  </tr>`;

  const date = new Date();

  tableBody.innerHTML = Object.values(data)
    .map((value, idx) => {
      const { name, surname, avatar, birthday, id } = value;
      const birthdayDate = new Date(birthday);
      console.log(birthday);
      let age = Math.round((date - birthdayDate) / 1000 / 60 / 60 / 24);
      console.log(age);
      return `
        <tr data-num="${id}">
    <td>${id}</td>
    <td>${name}</td>
    <td>${surname}</td>
    <td>${calcAge(age)}</td>
    <td id="del-container"><button class="del">del</button></td>
    </tr>
  `;
    })

    .join("");

  table.appendChild(tableHead);
  table.appendChild(tableBody);
  parent.appendChild(table);
  parent.prepend(form);

  const delBtns = document.querySelectorAll(".del");
  delBtns.forEach((del) => {
    del.addEventListener("click", () => {
      console.log(del.parentElement.parentElement.dataset.num);
      delData(del.parentElement.parentElement.dataset.num);
    });
  });
  const trs = document.querySelectorAll("tbody tr");
  const idArr = [...trs].map((tr) => tr.dataset.num);
  const maxId = Math.max(...idArr);
  console.log(maxId);
  const addBtn = document.querySelector("#add-btn");
  addBtn.addEventListener("click", (e) => {
    form.innerHTML = ` <label for="fname">name:</label>
   <input type="text" id="fname" name="fname">
   <label for="fsurname">surname:</label>
   <input type="text" id="fsurname" name="fsurname">
   <label for="fbirthdate">birth date:</label>
   <input type="date" id="fbirth-date" name="birthdate">
   <button id="add">add</button>`;
    const inpName = document.querySelector("#fname");
    const inpSurname = document.querySelector("#fsurname");
    const inpBirth = document.querySelector("#fbirth-date");
    const addBtn = document.querySelector("#add");

    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        inpName.value !== "" &&
        inpSurname.value !== "" &&
        inpBirth.value !== ""
      ) {
        console.log(inpName.value);
        console.log(inpSurname.value);
        console.log(inpBirth.value);
        sendData(inpName.value, inpSurname.value, inpBirth.value, maxId + 1);
      }
    });
  });
}
// table heading data
const config1 = {
  parent: "#usersTable",
  columns: [
    { title: "Имя", value: "name" },
    { title: "Фамилия", value: "surname" },
    { title: "Возраст", value: "age" },
  ],
};

const URL = "http://mock-api.shpp.me/delenchuk/users";

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    //   to convert data ahead
    xhr.responseType = "json";
    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.onload = () => {
      // JSON.parse(xhr.response);
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject("Something went wrong!");
    };

    xhr.send(JSON.stringify(data));
  });
  return promise;
};
// get data
const getData = () => {
  sendHttpRequest("GET", URL).then((responseData) => {
    console.log(responseData);
    renderTableData(responseData);
  });
};

getData();
// del data
const delData = (id) => {
  sendHttpRequest(
    "DELETE",
    `http://mock-api.shpp.me/delenchuk/users/${id}`
  ).then(() => location.reload());
};
// delData(3);
// Put data
const putData = () => {
  sendHttpRequest("PUT", `http://mock-api.shpp.me/delenchuk/users/`);
};

// delData(3);
// send data
const sendData = (name, surname, birthday, id) => {
  sendHttpRequest("POST", "http://mock-api.shpp.me/delenchuk/users/", {
    name: name,
    surname: surname,
    avatar:
      "https://s3.amazonaws.com/uifaces/faces/twitter/sachacorazzi/445.jpg",
    birthday: birthday,
    id,
  }).then(() => location.reload());
};
// sendData();

// sendData("Govaldo", "Passato", "2020-03-26T14:32:45.839Z", 2);

function renderTableData(response) {
  const { data } = response;
  return dataTable(config1, data);
}

// Get data fetch
// const getTableData = function () {
//   fetch(URL).then((data) => {
//     console.log(data);
//     data.json().then((response) => {
//       console.log(response);
//       // const { data } = response;
//       // return dataTable(config1, data);
//     });
//   });
// };

// getTableData();

// Calculating age
function calcAge(value) {
  let age = value;
  if (value < 30) {
    age = `${value} days`;
    console.log(age);
  } else if (value < 365) {
    age = `${Math.round(value / 30)} months`;
  } else {
    const val = Math.round(value / 30);
    const newVal = val.toString().split("").join(".");
    age = `${newVal} years`;
  }

  return age;
}
