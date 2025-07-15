import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
let userId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f5932ff2-0db9-468c-9f2d-fc5a988d067b",
    "Content-Type": "application/json",
  },
});

function showErrorMessage(message) {
  const errorElement = document.querySelector("#error-message");
  errorElement.textContent = message;
  errorElement.classList.add("error-message_visible");

  setTimeout(() => {
    errorElement.classList.remove("error-message_visible");
  }, 3000);
}

api
  .getAppInfo()
  .then(([user, cards]) => {
    userId = user._id;
    cards.forEach((item) => {
      const cardElement = getCardElement(userId, item);
      cardsList.append(cardElement);
    });

    avatarImage.src = user.avatar;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
  })
  .catch((err) => {
    showErrorMessage("something went wrong. Please try again later.");
  });

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

// Edit form elements
const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editModalSubmitBtn = editModal.querySelector(".modal__submit-btn");

// Card form elements
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormEl = avatarModal.querySelector("#edit-avatar-form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarInput = document.getElementById("profile-avatar-input");
const avatarImage = document.querySelector(".profile__avatar");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteCancelButton = deleteModal.querySelector(".modal__cancel-btn");
const deleteButton = deleteModal.querySelector(".modal__submit-btn-delete");

//Preview image popup elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalClose = previewModal.querySelector(".modal__close");

// card element and id
let selectedCard, selectedCardId;

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
  const editSubmitButton = editModalSubmitBtn;
  const origText = editModalSubmitBtn.textContent;

  editSubmitButton.textContent = "Saving...";
  editSubmitButton.disabled = true;

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch((err) => {
      showErrorMessage("Unable to update profile. Please try again.");
    })
    .finally(() => {
      editModalSubmitBtn.textContent = origText;
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = cardSubmitBtn;
  const originalText = submitButton.textContent;

  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api
    .addCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(userId, cardData);
      cardsList.prepend(cardElement);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch((err) => {
      showErrorMessage("Unable to add card. Please try again.");
      submitButton.disabled = false;
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

//finish avatar submission handler
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = avatarSubmitBtn;
  const originalText = submitButton.textContent;

  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
      avatarFormEl.reset();
      disableButton(submitButton, settings);
    })
    .catch((err) => {
      showErrorMessage("Unable to update avatar. Please try again.");
      submitButton.disabled = false;
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

//Deleting cards
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = deleteButton;
  const originalText = submitButton.textContent;

  submitButton.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      const cardToDelete = selectedCard;
      if (cardToDelete) {
        cardToDelete.remove();
      }
      closeModal(deleteModal);
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

// call changeLikeStatus, passing appropriate arguments
// handle .then(toggle active class) and .catch
function getCardElement(userId, data) {
  const cardElement = cardTemplate.cloneNode(true);
  cardElement.id = data._id;
  cardElement.dataset.cardid = data._id;

  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDelete = cardElement.querySelector(".card__delete-button");

  let isLiked = data.isLiked;

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (isLiked) {
    cardLikeBtn.classList.add("card__like-button_liked");
  }
  cardLikeBtn.addEventListener("click", () => {
    api
      .handleLike(data._id, isLiked)
      .then((res) => {
        if (res) {
          isLiked = !isLiked;
          cardLikeBtn.classList.toggle("card__like-button_liked");
        }
      })
      .catch((err) => {
        console.error(err);
        showErrorMessage("Unable to update like. Please try again.");
      });
  });

  cardDelete.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

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
  openModal(editModal);
});

const closeButtons = document.querySelectorAll(".modal__close");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

// todo-select avatar modal button at top of page
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

deleteModal.addEventListener("submit", handleDeleteSubmit);

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarFormEl.addEventListener("submit", handleAvatarSubmit);

enableValidation(settings);
