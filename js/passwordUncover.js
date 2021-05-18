(() => {
  const passwordInputs = document.querySelectorAll('input[type="password"]');

  passwordInputs.forEach(passwordInput => {
    passwordInput.type = 'text';
  });
})();
