import "./index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "fe18e607-fd88-422c-86cf-2d6176e26ed9",
    "Content-Type": "application/json",
  },
});

// destructure the second item in the callback of the.then()
api
  .getAppInfo()
  .then(([cards]) => {
    console.log(cards);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);

      // Handle the user's information
    });
  })
  .catch(console.error(err));

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editModalSubmitBtn = editModal.querySelector(".modal__submit-btn");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalClose = previewModal.querySelector(".modal__close");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function closeOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleEsc(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  modal.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", handleEsc);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  modal.removeEventListener("click", closeOverlay);
  document.removeEventListener("keydown", handleEsc);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const values = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardEl = getCardElement(values);
  cardsList.prepend(cardEl);
  evt.target.reset();
  disableButton(cardSubmitBtn, settings);
  closeModal(cardModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDelete = cardElement.querySelector(".card__delete-button");

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });

  cardDelete.addEventListener("click", (evt) => {
    if (cardElement) {
      cardElement.remove();
    }
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });

  return cardElement;
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editForm,
    [editModalNameInput, editModalDescriptionInput],
    config
  );
  openModal(editModal);
});

const closeButtons = document.querySelectorAll(".modal__close");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
