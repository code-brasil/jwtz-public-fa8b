document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerBtn = document.getElementById('register-btn');
    const protectedContent = document.getElementById('protected-content');
    const welcomeMessage = document.getElementById('welcome-message');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const logoutBtn = document.getElementById('logout-btn');

    if (window.location.pathname.endsWith('admin.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        fetch('http://localhost:8000/functions/jwtz/protected', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
                localStorage.removeItem('token');
                setTimeout(() => { window.location.href = 'index.html'; }, 3000);
            } else {
                welcomeMessage.textContent = data.message;
                protectedContent.classList.remove('hidden');
            }
        })
        .catch(err => {
            showError('An error occurred.');
            console.error(err);
        });
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        fetch('http://localhost:8000/functions/jwtz/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                localStorage.setItem('token', data.token);
                window.location.href = 'admin.html';
            }
        })
        .catch(err => {
            showError('An error occurred.');
            console.error(err);
        });
    });

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const email = prompt('Enter your email:');
            if (!email) {
                alert('Email is required for registration.');
                return;
            }
            fetch('http://localhost:8000/functions/jwtz/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showError(data.error);
                } else {
                    alert('Registration successful. Please log in.');
                }
            })
            .catch(err => {
                showError('An error occurred.');
                console.error(err);
            });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    function showError(message) {
        if (errorMessage) {
            errorText.textContent = message;
            errorMessage.classList.remove('hidden');
            setTimeout(() => { errorMessage.classList.add('hidden'); }, 3000);
        }
    }
});