const container = document.getElementById("detailed-time-container");

const getHeaderColor = (title) =>
  `--${title.replace(/\s+/g, "-")}-Primary`;

let timeData = [];

const updateTimeframes = (period) => {
  const items = container.querySelectorAll(".time-item");

  timeData.forEach((entry, index) => {
    const current = entry.timeframes[period].current;
    const previous = entry.timeframes[period].previous;

    const timeItem = items[index];
    const currentText = timeItem.querySelector(".current-time-text");
    const previousText = timeItem.querySelector(".previous-time-text");
    const buttons = document.querySelectorAll(".period-btn");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        
        buttons.forEach((b) => b.classList.remove("active"));
    
        btn.classList.add("active");
    
        const period = btn.id.replace("btn-", "");
        updateTimeframes(period);
      });
    });

    const currentHrLabel = current <= 1? "hr" : "hrs";
    currentText.textContent = `${current}${currentHrLabel}`;

    let label = "";
    switch (period) {
      case "daily":
        label = "Yesterday";
        break;
      case "weekly":
        label = "Last Week";
        break;
      case "monthly":
        label = "Last Month";
        break;
    }

    const hrLabel = previous <= 1? "hr" : "hrs";
    previousText.textContent = `${label} - ${previous} ${hrLabel}`;
  });
};

fetch("data.json")
  .then((response) => {
    if (!response.ok) return console.log("Oops! Something went wrong.");
    return response.json();
  })
  .then((data) => {
    timeData = data;

    data.forEach((timeCount) => {
      const timeItem = document.createElement("div");
      timeItem.classList.add("time-item");

      const headerColor = getHeaderColor(timeCount.title);
      timeItem.style.backgroundColor = `var(${headerColor}, #000)`;

      const timeItemHeader = document.createElement("div");
      timeItemHeader.classList.add("time-item-header");
      timeItemHeader.innerHTML = `
        <img src="images/icon-${timeCount.title}.svg" alt="${timeCount.title} icon" />
      `;

      const timeItemBody = document.createElement("div");
      timeItemBody.classList.add("time-item-body");
      timeItemBody.innerHTML = `
        <div class="time-item-body-category">
            <h3>${timeCount.title}</h3>
            <img src="images/icon-ellipsis.svg" alt="ellipsis" class="icon-ellipsis" />
        </div>
        <div class="time-item-body-stat">
            <h2 class="current-time-text">${timeCount.timeframes.daily.current} hrs</h2>
            <div class="previous-time-text">Yesterday - ${timeCount.timeframes.daily.previous} hrs</div>
        </div>
      `;

      timeItem.appendChild(timeItemHeader);
      timeItem.appendChild(timeItemBody);
      container.appendChild(timeItem);
    });

    
    updateTimeframes("daily"); 
    document.getElementById("btn-daily").classList.add("active");
  })
  .catch((error) => {
    console.log("Error in fetch data: ", error);
  });


document.getElementById("btn-daily").addEventListener("click", () => updateTimeframes("daily"));
document.getElementById("btn-weekly").addEventListener("click", () => updateTimeframes("weekly"));
document.getElementById("btn-monthly").addEventListener("click", () => updateTimeframes("monthly"));
