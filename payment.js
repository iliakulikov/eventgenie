// Payment Page JavaScript
(function() {
    'use strict';

    // DOM Elements
    let formData = {};
    let currentStep = 1;
    const totalSteps = 4;
    const vibeLabels = {
        'classic': 'Classic & Historical',
        'modern': 'Modern & Provocative',
        'visual': 'Photography & Visuals'
    };

    // Step elements
    const steps = {
        1: document.getElementById('step1'),
        2: document.getElementById('step2'),
        3: document.getElementById('step3'),
        4: document.getElementById('step4')
    };

    // Progress fill
    const progressFill = document.getElementById('paymentProgressFill');

    // Event dates
    const eventDates = [
        { label: 'Thursday Evening', date: '22 January', time: '7:00 PM' },
        { label: 'Friday Evening', date: '23 January', time: '7:00 PM' },
        { label: 'Saturday Evening', date: '24 January', time: '7:00 PM' },
        { label: 'Thursday Evening', date: '29 January', time: '7:00 PM' },
        { label: 'Friday Evening', date: '30 January', time: '7:00 PM' },
        { label: 'Saturday Evening', date: '31 January', time: '7:00 PM' }
    ];
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
        const rawVibe = urlParams.get('vibe');
        const vibeFromUrl = (rawVibe && vibeLabels[rawVibe]) ? rawVibe : null;
        
        console.log('URL vibe parameter:', vibeFromUrl);
        console.log('Available vibes in museums:', [...new Set(museumEvents.map(m => m.vibe))]);

        // Store vibe in formData
        if (vibeFromUrl) {
            formData.vibe = vibeFromUrl;
        }

        // Update vibe subtitle on Step 1
        updateVibeSubtitle(vibeFromUrl);

        // Render dates and museums based on vibe
        renderDateCards();
        renderEventCards(vibeFromUrl);

        // Setup event handlers
        setupEventHandlers();
        setupStepNavigation();
    }

    // Update vibe subtitle
    function updateVibeSubtitle(vibe) {
        const vibeToggle = document.getElementById('vibeToggle');
        const vibeDropdown = document.getElementById('vibeDropdown');
        if (!vibeToggle) return;

        const fallbackVibe = vibeToggle.dataset.vibe || 'classic';
        const selectedVibe = (vibe && vibeLabels[vibe]) ? vibe : fallbackVibe;
        const label = vibeLabels[selectedVibe] || vibeToggle.textContent.trim();

        vibeToggle.textContent = label;
        vibeToggle.dataset.vibe = selectedVibe;
        formData.vibe = selectedVibe;

        if (vibeDropdown) {
            const options = vibeDropdown.querySelectorAll('.vibe-option');
            options.forEach(option => {
                const isActive = option.dataset.vibe === selectedVibe;
                option.classList.toggle('active', isActive);
                option.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }
    }

    function updateVibeInUrl(vibe) {
        const url = new URL(window.location);
        if (vibe && vibeLabels[vibe]) {
            url.searchParams.set('vibe', vibe);
        } else {
            url.searchParams.delete('vibe');
        }
        history.replaceState({}, '', url);
    }

    function setVibe(vibe) {
        if (!vibeLabels[vibe]) return;
        updateVibeSubtitle(vibe);
        renderEventCards(vibe);
        updateVibeInUrl(vibe);
    }

    function setupVibeSelector() {
        const vibeSelector = document.getElementById('vibeSubtitle');
        const vibeToggle = document.getElementById('vibeToggle');
        const vibeDropdown = document.getElementById('vibeDropdown');
        if (!vibeSelector || !vibeToggle || !vibeDropdown) return;

        const closeDropdown = () => {
            vibeDropdown.classList.remove('open');
            vibeToggle.setAttribute('aria-expanded', 'false');
        };

        const openDropdown = () => {
            vibeDropdown.classList.add('open');
            vibeToggle.setAttribute('aria-expanded', 'true');
        };

        vibeToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = vibeDropdown.classList.contains('open');
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        const options = vibeDropdown.querySelectorAll('.vibe-option');
        options.forEach(option => {
            option.addEventListener('click', (event) => {
                event.stopPropagation();
                const selectedVibe = option.dataset.vibe;
                setVibe(selectedVibe);
                closeDropdown();
            });
        });

        document.addEventListener('click', (event) => {
            if (!vibeSelector.contains(event.target)) {
                closeDropdown();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDropdown();
            }
        });
    }

    // Setup step navigation
    function setupStepNavigation() {
        // Back buttons
        const backBtn2 = document.getElementById('backBtn2');
        const backBtn3 = document.getElementById('backBtn3');
        const backBtn4 = document.getElementById('backBtn4');

        if (backBtn2) {
            backBtn2.addEventListener('click', () => goToStep(1));
        }

        if (backBtn3) {
            backBtn3.addEventListener('click', () => goToStep(2));
        }

        if (backBtn4) {
            backBtn4.addEventListener('click', () => goToStep(3));
        }

        // Date card clicks
        const dateCards = document.querySelectorAll('.date-card');
        dateCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                dateCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                card.classList.add('selected');
                
                const radio = card.querySelector('input[type="radio"]');
                const dateIndex = parseInt(card.dataset.dateIndex);
                radio.checked = true;
                formData.selected_date = eventDates[dateIndex];
                
                // Update Step 2 header with selected date
                const dateDisplay = document.getElementById('selectedDateDisplay');
                if (dateDisplay && formData.selected_date) {
                    const day = (formData.selected_date.date.match(/\d+/) || [''])[0];
                    dateDisplay.innerHTML = `
                        <span class="inline-calendar">
                            <img src="img/calendar-icon.webp" alt="Calendar">
                            <span class="inline-calendar-day">${day}</span>
                        </span>
                        ${formData.selected_date.date} at ${formData.selected_date.time}`;
                }
                
                goToStep(2);
            });
        });

        // Confirmation continue button
        const confirmContinueBtn = document.getElementById('confirmContinueBtn');
        if (confirmContinueBtn) {
            confirmContinueBtn.addEventListener('click', () => {
                goToStep(4);
            });
        }

        // Plan selection
        const planRadios = document.querySelectorAll('input[name="subscription_plan"]');
        planRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                formData.subscription_plan = e.target.value;
                console.log('User selected plan:', e.target.value);
                // When ready: submitPaymentData();
            });
        });
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

    // Populate confirmation details
    function populateConfirmationDetails() {
        // Update date
        const confirmDate = document.getElementById('confirmDate');
        if (confirmDate && formData.selected_date) {
            confirmDate.textContent = `${formData.selected_date.date} at ${formData.selected_date.time}`;
        }

        // Update museum
        const confirmMuseum = document.getElementById('confirmMuseum');
        if (confirmMuseum && formData.selected_museum) {
            confirmMuseum.textContent = formData.selected_museum;
        }

        // Update vibe
        const confirmVibe = document.getElementById('confirmVibe');
        if (confirmVibe && formData.vibe) {
            confirmVibe.textContent = vibeLabels[formData.vibe] || formData.vibe;
        }

        // Update confirmation calendar day overlay
        const confirmCalendarDay = document.getElementById('confirmCalendarDay');
        if (confirmCalendarDay && formData.selected_date) {
            const day = (formData.selected_date.date.match(/\d+/) || [''])[0];
            confirmCalendarDay.textContent = day || '';
        }
    }

    // Setup all event handlers
    function setupEventHandlers() {
        setupVibeSelector();

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

    // Render date cards
    function renderDateCards() {
        const dateCardsContainer = document.getElementById('dateCards');
        if (!dateCardsContainer) return;

        dateCardsContainer.innerHTML = eventDates.map((date, index) => `
            <div class="date-card" data-date-index="${index}">
                <input type="radio" name="event_date" value="${index}" class="date-card-radio">
                <div class="date-card-icon">
                    <img src="img/calendar-icon.webp" alt="Calendar">
                    <span class="date-card-day">${date.date.match(/\d+/)?.[0] || ''}</span>
                </div>
                <div class="date-card-content">
                    <div class="date-card-label">${date.label}</div>
                    <div class="date-card-time">${date.date}, ${date.time}</div>
                </div>
                <div class="date-card-arrow">→</div>
            </div>
        `).join('');
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

        eventCardsContainer.innerHTML = eventsToDisplay.map((event, index) => `
            <label class="event-card" data-event-id="${event.id}">
                <input type="radio" name="museum" value="${index}" class="event-card-radio" style="display: none;">
                <div class="event-card-icon">${event.icon}</div>
                <div class="event-card-content">
                    <h4 class="event-card-title">${event.name}</h4>
                </div>
                <div class="event-card-arrow">→</div>
            </label>
        `).join('');

        const eventCards = eventCardsContainer.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            card.addEventListener('click', () => {
                const radio = card.querySelector('input[type="radio"]');
                radio.checked = true;
                formData.selected_museum = card.querySelector('.event-card-title').textContent;
                populateConfirmationDetails();
                goToStep(3);
            });
        });
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
