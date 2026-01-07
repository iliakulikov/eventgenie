// Payment Page JavaScript
(function() {
    'use strict';

    // DOM Elements
    let formData = {};
    let currentStep = 1;
    const totalSteps = 3;

    // Step elements
    const steps = {
        1: document.getElementById('step1'),
        2: document.getElementById('step2'),
        3: document.getElementById('step3')
    };

    // Progress fill
    const progressFill = document.getElementById('paymentProgressFill');
    const museumEvents = [
        {
            id: 1,
            name: 'The National Gallery',
            icon: '🏛',
            vibe: 'classic',
            date: 'Thursday, January 16',
            time: '7:00 PM',
            description: 'Discover masterpieces of Western European art spanning from the 13th to 19th centuries. Walk through galleries of iconic paintings by Leonardo da Vinci, Van Gogh, and Monet.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 2,
            name: 'British Museum',
            icon: '🏛',
            vibe: 'classic',
            date: 'Friday, January 17',
            time: '7:00 PM',
            description: 'Journey through two million years of human history and culture. From the Rosetta Stone to Egyptian mummies, experience treasures from every corner of the ancient world.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 3,
            name: 'Tate Britain',
            icon: '🏛',
            vibe: 'classic',
            date: 'Saturday, January 18',
            time: '7:00 PM',
            description: 'Experience the finest collection of British art from the 16th century to the present. Explore works by Turner, Constable, and other legendary British artists.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 4,
            name: 'Tate Modern',
            icon: '🧠',
            vibe: 'modern',
            date: 'Thursday, January 16',
            time: '7:00 PM',
            description: 'Experience contemporary art in a stunning former power station. From Picasso to modern installations, explore groundbreaking works that challenge and inspire.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 5,
            name: 'Whitechapel Gallery',
            icon: '🧠',
            vibe: 'modern',
            date: 'Friday, January 17',
            time: '7:00 PM',
            description: 'A leading contemporary art gallery showcasing cutting-edge works from emerging and established artists. Explore provocative exhibitions that push boundaries.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 6,
            name: 'The Barbican Centre',
            icon: '🧠',
            vibe: 'modern',
            date: 'Saturday, January 18',
            time: '7:00 PM',
            description: 'An iconic performing arts centre featuring contemporary art, music, theatre, and film. Experience bold and innovative cultural experiences.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 7,
            name: 'The Photographers\' Gallery',
            icon: '📸',
            vibe: 'visual',
            date: 'Thursday, January 16',
            time: '7:00 PM',
            description: 'The world\'s first independent photography gallery. Explore stunning visual narratives from award-winning photographers and contemporary artists.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 8,
            name: 'Victoria and Albert Museum',
            icon: '📸',
            vibe: 'visual',
            date: 'Friday, January 17',
            time: '7:00 PM',
            description: 'The world\'s leading museum of art, design, and performance. Discover 5,000 years of creativity, from fashion and furniture to sculpture and photography.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        },
        {
            id: 9,
            name: 'Saatchi Gallery',
            icon: '📸',
            vibe: 'visual',
            date: 'Saturday, January 18',
            time: '7:00 PM',
            description: 'A contemporary art gallery devoted to promoting young and established artists. Explore diverse visual mediums including photography, painting, and sculpture.',
            images: [
                'img/museum-popup-1.webp',
                'img/museum-popup-2.webp',
                'img/museum-popup-3.webp'
            ]
        }
    ];

    // Initialize page on load
    function initPage() {
        // Load user data from localStorage
        const storedUser = localStorage.getItem('eventgenieUser');
        if (storedUser) {
            formData = JSON.parse(storedUser);
        }

        // Get vibe from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const vibe = urlParams.get('vibe');
        
        console.log('URL vibe parameter:', vibe);
        console.log('Available vibes in museums:', [...new Set(museumEvents.map(m => m.vibe))]);

        // Populate user name and render events based on vibe
        populateUserName();
        renderEventCards(vibe);

        // Setup event handlers
        setupEventHandlers();
        setupStepNavigation();
    }

    // Setup step navigation
    function setupStepNavigation() {
        // Back buttons
        const backBtn2 = document.getElementById('backBtn2');
        const backBtn3 = document.getElementById('backBtn3');

        if (backBtn2) {
            backBtn2.addEventListener('click', () => goToStep(1));
        }

        if (backBtn3) {
            backBtn3.addEventListener('click', () => goToStep(2));
        }

        // Continue buttons
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            card.addEventListener('click', () => {
                // Store selected museum
                formData.selected_museum = card.querySelector('.event-card-title').textContent;
                goToStep(2);
            });
        });

        const continueBtn2 = document.getElementById('continueBtn2');
        if (continueBtn2) {
            continueBtn2.addEventListener('click', () => {
                const selectedLocation = document.querySelector('input[name="location"]:checked');
                if (selectedLocation) {
                    formData.location = selectedLocation.value;
                    goToStep(3);
                }
            });
        }
    }

    // Go to specific step
    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > totalSteps) return;

        // Hide current step
        if (steps[currentStep]) {
            steps[currentStep].classList.remove('active');
        }

        // Show new step
        currentStep = stepNumber;
        if (steps[currentStep]) {
            steps[currentStep].classList.add('active');
        }

        // Update progress bar
        const progressPercent = (currentStep / totalSteps) * 100;
        progressFill.style.width = progressPercent + '%';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Setup all event handlers
    function setupEventHandlers() {
        // Plans Continue button
        const plansContinueBtn = document.getElementById('plansContinueBtn');
        if (plansContinueBtn) {
            plansContinueBtn.addEventListener('click', () => {
                const selectedPlan = document.querySelector('input[name="subscription_plan"]:checked');
                if (selectedPlan) {
                    formData.subscription_plan = selectedPlan.value;
                    console.log('Selected plan:', selectedPlan.value);
                    // Redirect to Stripe or payment processor
                    window.open('https://stripe.com', '_blank');
                }
            });
        }
    }

    // Populate user's first name
    function populateUserName() {
        const userFirstNameElement = document.getElementById('userFirstName');
        if (userFirstNameElement && formData.first_name) {
            userFirstNameElement.textContent = formData.first_name;
        }
    }

    // Render event cards
    function renderEventCards(vibe = null) {
        const eventCardsContainer = document.getElementById('eventCards');
        if (!eventCardsContainer) return;

        // Filter museums by vibe if provided
        const eventsToDisplay = vibe 
            ? museumEvents.filter(event => event.vibe === vibe)
            : museumEvents;

        console.log('Filtering museums for vibe:', vibe);
        console.log('Museums found:', eventsToDisplay.length);
        console.log('Museums:', eventsToDisplay.map(m => ({ name: m.name, vibe: m.vibe })));

        eventCardsContainer.innerHTML = eventsToDisplay.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-card-icon">${event.icon}</div>
                <div class="event-card-content">
                    <h4 class="event-card-title">${event.name}</h4>
                    <p class="event-card-time">${event.date} • ${event.time}</p>
                </div>
                <div class="event-card-arrow">→</div>
            </div>
        `).join('');

        // Event card clicks are handled by setupStepNavigation
    }

    // Hide event detail modal
    function hideEventDetail() {
        const modal = document.getElementById('eventDetailModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initPage);

})();
