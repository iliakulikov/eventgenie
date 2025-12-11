// Quiz Modal JavaScript
(function() {
    'use strict';

    // DOM Elements
    const modal = document.getElementById('quizModal');
    const openBtn = document.getElementById('openQuizBtn');
    const closeBtn = document.getElementById('closeQuizBtn');
    const form = document.getElementById('quizForm');
    const screens = document.querySelectorAll('.quiz-screen');
    const nextButtons = document.querySelectorAll('[data-next]');
    const confirmYesBtn = document.getElementById('confirmYes');
    const confirmNoBtn = document.getElementById('confirmNo');
    
    // Also bind to "Join the Next Experience" button
    const heroBtn = document.querySelector('.cta-button');
    const ctaLargeBtn = document.querySelector('.cta-button-large');
    
    let currentScreen = 1;
    let formData = {};
    let utmParams = '';

    // Google Sheets Configuration
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzK1Ejj6wtzjGGymCry83q8IM_dMiZJ73CxY8FcPNp0YZPa1zyW_RqfK971c9kiqduN/exec';

    // Extract UTM parameters from URL
    function getUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        const utms = [];
        
        utmKeys.forEach(key => {
            const value = urlParams.get(key);
            if (value) {
                utms.push(`${key}=${value}`);
            }
        });
        
        return utms.join('&');
    }

    // Open Modal
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showScreen(1);
        
        // Capture UTM parameters from URL
        utmParams = getUTMParams();
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentScreen = 1;
        form.reset();
        showScreen(1);
    }

    // Show specific screen
    function showScreen(screenNumber) {
        screens.forEach(screen => {
            screen.classList.remove('active');
            if (parseInt(screen.dataset.screen) === screenNumber) {
                screen.classList.add('active');
            }
        });
        currentScreen = screenNumber;
        
        // Scroll to top of modal
        const container = document.querySelector('.quiz-container');
        if (container) {
            container.scrollTop = 0;
        }
    }

    // Validate current screen
    function validateScreen(screenNumber) {
        const currentScreenElement = document.querySelector(`.quiz-screen[data-screen="${screenNumber}"]`);
        const inputs = currentScreenElement.querySelectorAll('input[required], select[required], textarea[required]');
        
        let isValid = true;
        let firstInvalid = null;

        inputs.forEach(input => {
            if (input.type === 'radio') {
                const radioGroup = currentScreenElement.querySelectorAll(`input[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked && !firstInvalid) {
                    isValid = false;
                    firstInvalid = input;
                }
            } else if (!input.value.trim()) {
                isValid = false;
                if (!firstInvalid) {
                    firstInvalid = input;
                }
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '#2e2e2e';
            }
        });

        if (!isValid && firstInvalid) {
            // Find the question container
            const questionContainer = firstInvalid.closest('.quiz-question');
            if (questionContainer) {
                questionContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Show alert
            alert('Please fill in all required fields before continuing.');
        }

        return isValid;
    }

    // Collect form data
    function collectFormData() {
        const formDataObj = new FormData(form);
        formData = {};
        
        for (let [key, value] of formDataObj.entries()) {
            formData[key] = value;
        }
        
        return formData;
    }

    // Send data to Google Sheets using form submission method
    async function sendToGoogleSheets(data, paymentStatus) {
        const formData = new FormData();
        
        // Add all form fields
        formData.append('Date', new Date().toLocaleString('en-GB', { 
            timeZone: 'Europe/London',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }));
        formData.append('vibe', data.vibe || '');
        formData.append('introvert_extrovert', data.introvert_extrovert || '');
        formData.append('logic_emotion', data.logic_emotion || '');
        formData.append('humor', data.humor || '');
        formData.append('personality_type', data.personality_type || '');
        formData.append('first_name', data.first_name || '');
        formData.append('last_name', data.last_name || '');
        formData.append('dob', data.dob || '');
        formData.append('gender', data.gender || '');
        formData.append('industry', data.industry || '');
        formData.append('phone', data.phone || '');
        formData.append('email', data.email || '');
        formData.append('payment_confirmed', paymentStatus); // 'Pending', 'Yes', or 'No'
        formData.append('utm', utmParams || '');

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            console.log('Data sent to Google Sheets successfully with status:', paymentStatus);
            return true;
        } catch (error) {
            console.error('Error sending to Google Sheets:', error);
            if (paymentStatus === 'Pending') {
                // Don't show error for initial submission, just log it
                console.warn('Initial submission failed, but continuing to payment screen');
                return true; // Continue anyway
            } else {
                alert('There was an error submitting your response. Please try again.');
                return false;
            }
        }
    }

    // Event Listeners
    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }
    
    if (heroBtn) {
        heroBtn.addEventListener('click', openModal);
    }
    
    if (ctaLargeBtn && ctaLargeBtn.id !== 'openQuizBtn') {
        ctaLargeBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Next button handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const nextScreen = parseInt(button.dataset.next);
            
            if (validateScreen(currentScreen)) {
                collectFormData();
                
                // If moving from screen 3 to 4 (submit stage), send initial data
                if (currentScreen === 3 && nextScreen === 4) {
                    // Show loading state on button
                    button.classList.add('loading');
                    button.disabled = true;
                    
                    // Send initial submission with "Pending" status
                    await sendToGoogleSheets(formData, 'Pending');
                    
                    // Remove loading state
                    button.classList.remove('loading');
                    button.disabled = false;
                }
                
                showScreen(nextScreen);
            }
        });
    });

    // Payment confirmation handlers
    if (confirmYesBtn) {
        confirmYesBtn.addEventListener('click', async () => {
            collectFormData();
            
            // Show loading state
            confirmYesBtn.classList.add('loading');
            confirmYesBtn.disabled = true;
            confirmNoBtn.disabled = true;
            
            // Send to Google Sheets with confirmation (second submission with 'Yes')
            const success = await sendToGoogleSheets(formData, 'Yes');
            
            if (success) {
                // Show success message in modal
                showFinalMessage(
                    '✨',
                    'You\'re All Set!',
                    'Thank you! Your group has been confirmed. We will contact you shortly with all the details for this Saturday\'s experience.',
                    'success'
                );
            } else {
                // Re-enable buttons on error
                confirmYesBtn.classList.remove('loading');
                confirmYesBtn.disabled = false;
                confirmNoBtn.disabled = false;
            }
        });
    }

    if (confirmNoBtn) {
        confirmNoBtn.addEventListener('click', async () => {
            collectFormData();
            
            // Show loading state
            confirmNoBtn.classList.add('loading');
            confirmNoBtn.disabled = true;
            confirmYesBtn.disabled = true;
            
            // Send to Google Sheets without confirmation (second submission with 'No')
            const success = await sendToGoogleSheets(formData, 'No');
            
            if (success) {
                // Show thank you message in modal
                showFinalMessage(
                    '💙',
                    'Thank You!',
                    'We\'ve saved your information for future events. We\'ll reach out when we have something that matches your preferences.',
                    'info'
                );
            } else {
                // Re-enable buttons on error
                confirmNoBtn.classList.remove('loading');
                confirmNoBtn.disabled = false;
                confirmYesBtn.disabled = false;
            }
        });
    }

    // Show final message function
    function showFinalMessage(icon, title, text, type) {
        const currentScreenElement = document.querySelector('.quiz-screen[data-screen="4"]');
        const successContent = currentScreenElement.querySelector('.quiz-success');
        
        // Create final message element
        const finalMessage = document.createElement('div');
        finalMessage.className = 'quiz-final-message active';
        finalMessage.innerHTML = `
            <div class="quiz-final-message-icon">${icon}</div>
            <h2 class="quiz-final-message-title">${title}</h2>
            <p class="quiz-final-message-text">${text}</p>
            <button class="quiz-final-message-button">Close</button>
        `;
        
        // Hide success content and show final message
        successContent.style.display = 'none';
        currentScreenElement.appendChild(finalMessage);
        
        // Add event listener to the close button
        const closeButton = finalMessage.querySelector('.quiz-final-message-button');
        closeButton.addEventListener('click', () => {
            closeModal();
        });
    }

    // Input validation styling
    const allInputs = form.querySelectorAll('input[required]');
    allInputs.forEach(input => {
        if (input.type !== 'radio') {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.style.borderColor = '#2e2e2e';
                }
            });
        }
    });

    // Auto-format phone number
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('44')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+44' + value.substring(1);
            } else if (!value.startsWith('+')) {
                value = '+44' + value;
            }
            e.target.value = value;
        });
    }

    console.log('Quiz initialized. Remember to set your Google Apps Script URL in quiz.js!');
})();
