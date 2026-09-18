const form = document.querySelector("#blessingForm");
const blessingInput = document.querySelector("#blessingLevel");
const blessingOutput = document.querySelector("#blessingOutput");
const successModal = document.querySelector("#successModal");
const modalName = document.querySelector("#modalName");
const closeModalButton = document.querySelector("#closeModalButton");
const randomButton = document.querySelector("#randomButton");
const randomLine = document.querySelector("#randomLine");
const breakTargetInput = document.querySelector('input[name="breakTarget"]');

const memeLines = [
  "斷開拖延，今天的作業直接五倍完成。",
  "斷開壞心情，領受五倍快樂與五倍奶茶。",
  "斷開 Bug 的鎖鏈，console 從此清清潔潔。",
  "斷開選擇困難，radio 和 checkbox 都要會。",
  "斷開 CSS 崩壞，排版從此端正有秩序。",
];

const fields = form.elements;

function getCheckedValues(name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(
    (input) => input.value,
  );
}

function getSelectedText(selectId) {
  const select = document.querySelector(selectId);
  return select.selectedOptions[0]?.textContent || "尚未選擇";
}

function getFormData() {
  return {
    campaign: fields.campaign.value,
    fullName: fields.fullName.value.trim(),
    email: fields.email.value.trim(),
    phone: fields.phone.value.trim(),
    passwordLength: fields.password.value.length,
    blessingLevel: `${fields.blessingLevel.value} 倍`,
    teamSize: fields.teamSize.value,
    eventDate: fields.eventDate.value,
    eventTime: fields.eventTime.value,
    eventDateTime: fields.eventDateTime.value,
    breakTarget: getCheckedValues("breakTarget")[0] || "",
    equipments: getCheckedValues("equipments"),
    memeFile: fields.memeFile.files[0]?.name || "",
    memeMode: getSelectedText("#memeMode"),
    message: fields.message.value.trim(),
    agree: fields.agree.checked,
  };
}

function updateBlessingOutput() {
  blessingOutput.textContent = `${blessingInput.value} 倍`;
}

function setFieldMessage(field, message) {
  field.setCustomValidity(message);
}

function updateValidationMessages() {
  setFieldMessage(fields.fullName, "");
  setFieldMessage(fields.email, "");
  setFieldMessage(fields.password, "");
  setFieldMessage(breakTargetInput, "");
  setFieldMessage(fields.memeMode, "");
  setFieldMessage(fields.message, "");
  setFieldMessage(fields.agree, "");

  if (fields.fullName.validity.valueMissing) {
    setFieldMessage(fields.fullName, "請輸入你的名字唷");
  }

  if (fields.email.validity.valueMissing) {
    setFieldMessage(fields.email, "Email 還沒輸入唷");
  } else if (fields.email.validity.typeMismatch) {
    setFieldMessage(fields.email, "Email 格式不正確唷");
  }

  if (fields.password.validity.tooShort) {
    setFieldMessage(fields.password, "密碼要六位數以上唷");
  }

  if (breakTargetInput.validity.valueMissing) {
    setFieldMessage(breakTargetInput, "請選一個今天要斷開的項目唷");
  }

  if (fields.memeMode.validity.valueMissing) {
    setFieldMessage(fields.memeMode, "請選擇一個靈修模式唷");
  }

  if (fields.message.validity.valueMissing) {
    setFieldMessage(fields.message, "請輸入今日見證唷");
  }

  if (fields.agree.validity.valueMissing) {
    setFieldMessage(fields.agree, "請先勾選同意唷");
  }
}

function markInvalidFields() {
  const fields = form.querySelectorAll("input, select, textarea");

  fields.forEach((field) => {
    field.classList.toggle("is-error", !field.checkValidity());
  });
}

function focusFirstInvalidField() {
  const firstInvalidField = form.querySelector(
    "input:invalid, select:invalid, textarea:invalid",
  );

  if (!firstInvalidField) {
    return;
  }

  firstInvalidField.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  firstInvalidField.focus({ preventScroll: true });
  firstInvalidField.reportValidity();
}

function showRandomLine() {
  const randomIndex = Math.floor(Math.random() * memeLines.length);
  randomLine.textContent = memeLines[randomIndex];
}

function openSuccessModal(name) {
  modalName.textContent = name || "同學";
  randomLine.textContent = "準備領受今日訓練金句。";
  successModal.classList.add("is-open");
}

function closeSuccessModal() {
  successModal.classList.remove("is-open");
}

form.addEventListener("input", () => {
  updateBlessingOutput();
  updateValidationMessages();
  markInvalidFields();
});

form.addEventListener("change", () => {
  updateValidationMessages();
  markInvalidFields();
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    updateBlessingOutput();
    updateValidationMessages();
    form.querySelectorAll(".is-error").forEach((field) => {
      field.classList.remove("is-error");
    });
  }, 0);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateValidationMessages();
  markInvalidFields();

  if (!form.checkValidity()) {
    focusFirstInvalidField();
    return;
  }

  const data = getFormData();
  openSuccessModal(data.fullName);
});

randomButton.addEventListener("click", showRandomLine);
closeModalButton.addEventListener("click", closeSuccessModal);

successModal.addEventListener("click", (event) => {
  if (event.target === successModal) {
    closeSuccessModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSuccessModal();
  }
});

updateValidationMessages();
updateBlessingOutput();
