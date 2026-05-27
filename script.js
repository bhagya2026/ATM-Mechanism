let balance = 53000;
const CORRECT_PIN = "1234";
let selectedLanguage = "en";

// Translation Configuration Matrix
const dictionary = {
  en: {
    pinPrompt: "Enter Your 4-Digit PIN",
    pinSubmit: "Submit",
    welcome: "Card Verified! Insert amount or choose an option below.",
    invalidPin: "❌ Incorrect PIN! Try again.",
    invalidAmount: "⚠️ Invalid Amount. Please try again.",
    insufficient: "❌ Transaction Declined: Insufficient Funds.",
    depositSuccess: "✅ Processed: ₹{amt} deposited successfully!",
    withdrawSuccess: "💸 Dispensing: ₹{amt}. Take your cash!",
    balanceDisplay: "💳 Current Balance: ₹{bal}"
  },
  kn: {
    pinPrompt: "ನಿಮ್ಮ 4-ಅಂಕಿಯ ಪಿನ್ ನಮೂದಿಸಿ",
    pinSubmit: "ಸಲ್ಲಿಸಿ",
    welcome: "ಕಾರ್ಡ್ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ! ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.",
    invalidPin: "❌ ತಪ್ಪು ಪಿನ್! ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    invalidAmount: "⚠️ ಅಮಾನ್ಯ ಮೊತ್ತ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    insufficient: "❌ ವಹಿವಾಟು ವಿಫಲವಾಗಿದೆ: ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಹಣದ ಕೊರತೆಯಿದೆ.",
    depositSuccess: "✅ ಪ್ರಕ್ರಿಯೆ ಯಶಸ್ವಿ: ₹{amt} ಜಮಾ ಮಾಡಲಾಗಿದೆ!",
    withdrawSuccess: "💸 ನಗದು ವಿತರಿಸಲಾಗುತ್ತಿದೆ: ₹{amt}. ಹಣ ಪಡೆದುಕೊಳ್ಳಿ!",
    balanceDisplay: "💳 ಪ್ರಸ್ತುತ ಬ್ಯಾಲೆನ್ಸ್: ₹{bal}"
  }
};

// UI Elements
const cardScreen = document.getElementById("card-screen");
const langScreen = document.getElementById("language-screen");
const pinScreen = document.getElementById("pin-screen");
const dashboardScreen = document.getElementById("dashboard-screen");

const pinPrompt = document.getElementById("pin-prompt");
const pinSubmitBtn = document.getElementById("pin-submit-btn");
const statusText = document.getElementById("status-text");
const amountInput = document.getElementById("amount");

// STEP 1: Insert Card -> Moves to Language screen
function insertCard() {
  cardScreen.classList.add("hidden");
  langScreen.classList.remove("hidden");
}

// STEP 2: Language selected -> Configures translations, moves to PIN view
function selectLanguage(lang) {
  selectedLanguage = lang;
  
  pinPrompt.textContent = dictionary[selectedLanguage].pinPrompt;
  pinSubmitBtn.textContent = dictionary[selectedLanguage].pinSubmit;

  langScreen.classList.add("hidden");
  pinScreen.classList.remove("hidden");
}

// STEP 3: Verify PIN -> Unlocks the physical panel buttons and changes display
function verifyPin() {
  const enteredPin = document.getElementById("pin-input").value;
  
  if (enteredPin === CORRECT_PIN) {
    pinScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");
    
    statusText.textContent = dictionary[selectedLanguage].welcome;
    document.getElementById("pin-input").value = ""; 

    // UNLOCK ATM CONTROLS
    amountInput.disabled = false;
    document.getElementById("btn-deposit").disabled = false;
    document.getElementById("btn-withdraw").disabled = false;
    document.getElementById("btn-check").disabled = false;
  } else {
    alert(dictionary[selectedLanguage].invalidPin);
    document.getElementById("pin-input").value = "";
  }
}

// Transaction Processors
function getAmountValue() {
  const value = parseFloat(amountInput.value);
  amountInput.value = ""; 
  return value;
}

function handleDeposit() {
  const amt = getAmountValue();
  if (isNaN(amt) || amt <= 0) {
    statusText.textContent = dictionary[selectedLanguage].invalidAmount;
    return;
  }
  balance += amt;
  statusText.textContent = dictionary[selectedLanguage].depositSuccess.replace("{amt}", amt);
}

function handleWithdraw() {
  const amt = getAmountValue();
  if (isNaN(amt) || amt <= 0) {
    statusText.textContent = dictionary[selectedLanguage].invalidAmount;
    return;
  }
  if (amt > balance) {
    statusText.textContent = dictionary[selectedLanguage].insufficient;
    return;
  }
  balance -= amt;
  statusText.textContent = dictionary[selectedLanguage].withdrawSuccess.replace("{amt}", amt);
}

function handleCheckBalance() {
  statusText.textContent = dictionary[selectedLanguage].balanceDisplay.replace("{bal}", balance);
}

// Reset Session (Eject Card)
function resetATM() {
  document.getElementById("pin-input").value = "";
  amountInput.value = "";
  selectedLanguage = "en"; 
  
  // LOCK ATM CONTROLS BACK DOWN
  amountInput.disabled = true;
  document.getElementById("btn-deposit").disabled = true;
  document.getElementById("btn-withdraw").disabled = true;
  document.getElementById("btn-check").disabled = true;

  // Clear Screen Views back to base step
  langScreen.classList.add("hidden");
  pinScreen.classList.add("hidden");
  dashboardScreen.classList.add("hidden");
  cardScreen.classList.remove("hidden");
}