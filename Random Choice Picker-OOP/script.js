class RandomChoicePicker {
  constructor(choicesInputId, resultElementId, buttonId) {
    this.choicesInput = document.getElementById(choicesInputId);
    this.resultElement = document.getElementById(resultElementId);
    this.pickButton = document.getElementById(buttonId);
    this.addEventListeners();
  }

  addEventListeners() {
    this.pickButton.addEventListener("click", () => this.pickRandomChoice());
  }

  getChoices() {
    return this.choicesInput.value.split(",").map((choice) => choice.trim());
  }

  pickRandomChoice() {
    const choices = this.getChoices();

    // Check if there are choices to pick from
    if (choices.length === 0 || (choices.length === 1 && choices[0] === "")) {
      this.resultElement.textContent = "Please Enter Choices";
      return;
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * choices.length);
    
    // Display the randomly selected choice
    const randomChoice = choices[randomIndex];
    this.resultElement.textContent = `Random Choice: ${randomChoice}`;
  }
}

// Instantiate the RandomChoicePicker class
const randomChoicePicker = new RandomChoicePicker("choices", "result", "pickButton");
