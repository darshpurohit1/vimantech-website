document.addEventListener('DOMContentLoaded', () => {

    // यहाँ आपके मौजूदा एनिमेटेड एलिमेंट्स का कोड है
    const animatedElements = document.querySelectorAll('.animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Custom Order form logic
    if (document.getElementById('order-form')) {
        const form = document.getElementById('order-form');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const rangeSelect = document.getElementById('range');
        const motorSelect = document.getElementById('motor-type');
        const priceDisplay = document.getElementById('estimated-price');
        const imageInput = document.getElementById('image-upload');
        
        // Price data
        const prices = {
            '40': { 'hub': 10000, 'bldc': 15000 },
            '60': { 'hub': 14000, 'bldc': 19000 },
            '80': { 'hub': 18000, 'bldc': 23000 }
        };
    
        // Calculate and display price
        function updatePrice() {
            const selectedRange = rangeSelect.value;
            const selectedMotor = motorSelect.value;
            let price = 0;
    
            if (selectedRange && selectedMotor) {
                price = prices[selectedRange][selectedMotor];
            }
            priceDisplay.textContent = `₹${price}`;
        }
    
        rangeSelect.addEventListener('change', updatePrice);
        motorSelect.addEventListener('change', updatePrice);

        // Handle form submission and send to backend
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            
            // Price की वैल्यू को FormData में जोड़ें
            const priceValue = priceDisplay.textContent.replace('₹', '');
            formData.append('price', priceValue);

            try {
                const response = await fetch('https://api.vimantech.in.net/send-email', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.text();
                
                if (response.ok) {
                    alert('Form submitted successfully!');
                    form.reset();
                } else {
                    alert('An error occurred. Please try again.');
                }

            } catch (error) {
                console.error('Error:', error);
                alert('Form submission failed. Please check your network and try again.');
            }
        });
    }
      // Get a Quote form logic
if (document.getElementById('quote-form')) {
    const form = document.getElementById('quote-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            needs: formData.get('message'),
        };

        try {
            const response = await fetch('https://api.vimantech.in.net/send-quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.text();

            if (response.ok) {
                alert('Quote request sent successfully!');
                form.reset();
            } else {
                alert('An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            alert('Form submission failed. Please check your network and try again.');
        }
    });
  }
    
    }
);