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
    
    // Also bind to "Join the Next Experience" button
    const heroBtn = document.querySelector('.cta-button');
    const ctaLargeBtn = document.querySelector('.cta-button-large');
    
    let currentScreen = 1;
    let formData = {};
    let utmParams = '';
    let hasClaimedDiscount = false;  // Track if user claimed the discount

    // Google Sheets Configuration
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxpCzSSURmZdAPqC7bemODADkb2xrbgL5DI7H8M4uVFaQ-ezdtt2kWKXfj9tDhrl1w/exec';

    // Museum Events Data
    const museumEvents = [
        {
            id: 1,
            name: 'Natural History Museum',
            icon: '🦕',
            date: 'Wednesday, January 7',
            time: '7:00 PM',
            description: 'Discover millions of years of natural history. Walk through the iconic Hintze Hall, marvel at the blue whale, and explore dinosaur fossils in this architectural masterpiece.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 2,
            name: 'Tate Modern',
            icon: '🎨',
            date: 'Saturday, January 10',
            time: '3:00 PM',
            description: 'Experience contemporary art in a stunning former power station. From Picasso to modern installations, explore groundbreaking works that challenge and inspire.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 3,
            name: 'British Museum',
            icon: '🏛️',
            date: 'Wednesday, January 14',
            time: '7:00 PM',
            description: 'Journey through two million years of human history and culture. From the Rosetta Stone to Egyptian mummies, experience treasures from every corner of the ancient world.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 4,
            name: 'V&A Museum',
            icon: '👑',
            date: 'Sunday, January 18',
            time: '2:00 PM',
            description: 'The world\'s leading museum of art, design, and performance. Discover 5,000 years of creativity, from fashion and furniture to sculpture and photography.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 5,
            name: 'Science Museum',
            icon: '🚀',
            date: 'Friday, January 23',
            time: '6:30 PM',
            description: 'Explore the wonders of science and technology. From space exploration to medical breakthroughs, engage with interactive exhibits that bring scientific discovery to life.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        }
    ];

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
        
        // Hide cookie banner when opening quiz
        const cookieBanner = document.querySelector('.cookie-banner');
        if (cookieBanner) {
            cookieBanner.style.display = 'none';
        }
        
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
                    
                    // Track Meta Lead event
                    if (typeof fbq !== 'undefined') {
                        console.log('Tracking Meta Lead event');
                        fbq('track', 'Lead');
                    } else {
                        console.warn('Meta Pixel (fbq) not loaded');
                    }
                    
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
            
            // Send to Google Sheets with confirmation status 'confirmed'
            const success = await sendToGoogleSheets(formData, 'confirmed');

            if (success) {
                try {
                    // Persist lead data locally for the payment page
                    localStorage.setItem('eventgenieUser', JSON.stringify(formData));

                    // Build URL with all captured fields for redundancy
                    const params = new URLSearchParams();
                    Object.entries(formData).forEach(([key, value]) => {
                        if (value) params.append(key, value);
                    });
                    if (utmParams) params.append('utm', utmParams);

                    // Redirect to payment in the same tab
                    window.location.href = `payment.html?${params.toString()}`;
                } catch (err) {
                    console.error('Error redirecting to payment:', err);
                    confirmYesBtn.classList.remove('loading');
                    confirmYesBtn.disabled = false;
                }
            } else {
                // Re-enable button on error
                confirmYesBtn.classList.remove('loading');
                confirmYesBtn.disabled = false;
            }
        });
    }

    // Populate user's first name
    function populateUserName() {
        const userFirstNameElement = document.getElementById('userFirstName');
        if (userFirstNameElement && formData.first_name) {
            userFirstNameElement.textContent = formData.first_name;
        }
    }

    // Render event cards
    function renderEventCards() {
        const eventCardsContainer = document.getElementById('eventCards');
        if (!eventCardsContainer) return;

        eventCardsContainer.innerHTML = museumEvents.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-card-icon">${event.icon}</div>
                <div class="event-card-content">
                    <h4 class="event-card-title">${event.name}</h4>
                    <p class="event-card-time">${event.date} • ${event.time}</p>
                </div>
                <div class="event-card-arrow">→</div>
            </div>
        `).join('');

        // Add click handlers to event cards
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', () => {
                const eventId = parseInt(card.dataset.eventId);
                showEventDetail(eventId);
            });
        });
    }

    // Show discount popup
    function showDiscountPopup() {
        const discountPopup = document.getElementById('discountPopup');
        if (discountPopup) {
            discountPopup.classList.add('active');
        }
    }

    // Hide discount popup
    function hideDiscountPopup() {
        const discountPopup = document.getElementById('discountPopup');
        if (discountPopup) {
            discountPopup.classList.remove('active');
        }
    }

    // Show event detail
    function showEventDetail(eventId) {
        const event = museumEvents.find(e => e.id === eventId);
        if (!event) return;

        const modal = document.getElementById('eventDetailModal');
        const title = document.getElementById('eventDetailTitle');
        const description = document.getElementById('eventDetailDescription');
        const images = document.getElementById('eventDetailImages');

        if (title) title.textContent = event.name;
        if (description) description.textContent = event.description;
        if (images) {
            images.innerHTML = event.images.map(img => 
                `<img src="${img}" alt="${event.name}" class="event-detail-image">`
            ).join('');
        }

        if (modal) modal.classList.add('active');
    }

    // Hide event detail
    function hideEventDetail() {
        const modal = document.getElementById('eventDetailModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Discount popup event handlers
    const discountPopupClose = document.getElementById('discountPopupClose');
    const claimDiscountBtn = document.getElementById('claimDiscountBtn');
    const skipDiscountBtn = document.getElementById('skipDiscountBtn');

    if (discountPopupClose) {
        discountPopupClose.addEventListener('click', hideDiscountPopup);
    }

    if (claimDiscountBtn) {
        claimDiscountBtn.addEventListener('click', () => {
            // Mark discount as claimed
            hasClaimedDiscount = true;
            hideDiscountPopup();
            // Continue to next screen and show promo box
            showScreen(5);
            populateUserName();
            renderEventCards();
        });
    }

    if (skipDiscountBtn) {
        skipDiscountBtn.addEventListener('click', () => {
            hasClaimedDiscount = false;
            hideDiscountPopup();
            // Continue to next screen without showing promo
            showScreen(5);
            populateUserName();
            renderEventCards();
        });
    }

    // Event detail modal handlers
    const eventDetailClose = document.getElementById('eventDetailClose');
    const bookEventBtn = document.getElementById('bookEventBtn');

    if (eventDetailClose) {
        eventDetailClose.addEventListener('click', hideEventDetail);
    }

    if (bookEventBtn) {
        bookEventBtn.addEventListener('click', () => {
            hideEventDetail();
            showScreen(6);
            // Show promo box if discount was claimed
            if (hasClaimedDiscount) {
                const promoBox = document.getElementById('promoCodeBox');
                if (promoBox) {
                    promoBox.style.display = 'block';
                }
            }
        });
    }

    // Plans Continue button
    const plansContinueBtn = document.getElementById('plansContinueBtn');
    if (plansContinueBtn) {
        plansContinueBtn.addEventListener('click', () => {
            const selectedPlan = document.querySelector('input[name="subscription_plan"]:checked');
            if (selectedPlan) {
                console.log('Selected plan:', selectedPlan.value);
                // Redirect to Stripe
                window.open('https://stripe.com', '_blank');
            }
        });
    }

    // Close popups on overlay click
    document.getElementById('discountPopup')?.addEventListener('click', (e) => {
        if (e.target.id === 'discountPopup') {
            hideDiscountPopup();
        }
    });

    document.getElementById('eventDetailModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'eventDetailModal') {
            hideEventDetail();
        }
    });

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
