export const navigateBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "/home";
  }
};
