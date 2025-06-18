document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const passwordStrengthMeter = document.getElementById('password-strength-meter');

    // --- VALIDATION FUNCTIONS ---

    const isRequired = value => value.trim() !== '';
    const isLength = (length, min, max) => length >= min && length <= max;
    const isEmailValid = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    const isPasswordSecure = (password) => {
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        return re.test(password);
    };

    // --- DYNAMIC FEEDBACK FUNCTIONS ---

    const showError = (input, message) => {
        const formField = input.parentElement;
        input.classList.remove('success');
        input.classList.add('error');
        const error = formField.querySelector('.error-message');
        error.style.display = 'block';
        error.textContent = message;
    };

    const showSuccess = (input) => {
        const formField = input.parentElement;
        input.classList.remove('error');
        input.classList.add('success');
        const error = formField.querySelector('.error-message');
        error.style.display = 'none';
        error.textContent = '';
    };

    const updatePasswordStrength = (passwordValue) => {
        let strength = 0;
        if (passwordValue.length > 7) strength++;
        if (passwordValue.match(/[a-z]/)) strength++;
        if (passwordValue.match(/[A-Z]/)) strength++;
        if (passwordValue.match(/[0-9]/)) strength++;
        if (passwordValue.match(/[^a-zA-Z0-9]/)) strength++;

        let width = (strength / 5) * 100;
        passwordStrengthMeter.style.width = width + '%';

        if (strength < 3) {
            passwordStrengthMeter.style.backgroundColor = '#dc3545'; // Weak
        } else if (strength < 5) {
            passwordStrengthMeter.style.backgroundColor = '#ffc107'; // Medium
        } else {
            passwordStrengthMeter.style.backgroundColor = '#28a745'; // Strong
        }
    };

    // --- VALIDATION CHECKS ---

    const checkUsername = () => {
        let valid = false;
        const min = 3, max = 25;
        const usernameValue = username.value.trim();

        if (!isRequired(usernameValue)) {
            showError(username, 'Username cannot be blank.');
        } else if (!isLength(usernameValue.length, min, max)) {
            showError(username, `Username must be between ${min} and ${max} characters.`);
        } else {
            showSuccess(username);
            valid = true;
        }
        return valid;
    };

    const checkEmail = () => {
        let valid = false;
        const emailValue = email.value.trim();
        if (!isRequired(emailValue)) {
            showError(email, 'Email cannot be blank.');
        } else if (!isEmailValid(emailValue)) {
            showError(email, 'Email is not valid.');
        } else {
            showSuccess(email);
            valid = true;
        }
        return valid;
    };

    const checkPassword = () => {
        let valid = false;
        const passwordValue = password.value.trim();

        updatePasswordStrength(passwordValue);

        if (!isRequired(passwordValue)) {
            showError(password, 'Password cannot be blank.');
        } else if (!isPasswordSecure(passwordValue)) {
            showError(password, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        } else {
            showSuccess(password);
            valid = true;
        }
        return valid;
    };

    const checkConfirmPassword = () => {
        let valid = false;
        const confirmPasswordValue = confirmPassword.value.trim();
        const passwordValue = password.value.trim();

        if (!isRequired(confirmPasswordValue)) {
            showError(confirmPassword, 'Please confirm your password.');
        } else if (passwordValue !== confirmPasswordValue) {
            showError(confirmPassword, 'Passwords do not match.');
        } else {
            showSuccess(confirmPassword);
            valid = true;
        }
        return valid;
    };

    // --- EVENT LISTENERS ---

    form.addEventListener('submit', function (e) {
        e.preventDefault(); 

        let isUsernameValid = checkUsername(),
            isEmailValid = checkEmail(),
            isPasswordValid = checkPassword(),
            isConfirmPasswordValid = checkConfirmPassword();

        let isFormValid = isUsernameValid &&
            isEmailValid &&
            isPasswordValid &&
            isConfirmPasswordValid;

        if (isFormValid) {
            console.log('Form is valid and ready to submit!');
            alert('Registration successful!');
        }
    });

    // --- DYNAMIC DOM UPDATES ON INPUT ---

    form.addEventListener('input', (e) => {
        switch (e.target.id) {
            case 'username':
                checkUsername();
                break;
            case 'email':
                checkEmail();
                break;
            case 'password':
                checkPassword();
                break;
            case 'confirm-password':
                checkConfirmPassword();
                break;
        }
    });
});