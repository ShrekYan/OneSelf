export const navigateBack = (): void => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "/home";
  }
};

export const navigateToHome = (): void => {
  window.location.href = "/home";
};
