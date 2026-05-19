document.addEventListener('DOMContentLoaded', () => {

    // Animated elements
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

    // ─── Helper: button ko loading state mein le jaao ───────────────────────
    function setButtonLoading(btn) {
        btn._originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Submitting... Please wait';
        btn.style.opacity = '0.65';
        btn.style.cursor = 'not-allowed';
    }

    // ─── Helper: success state ───────────────────────────────────────────────
    function setButtonSuccess(btn, form, extraReset) {
        btn.textContent = '✓ Submitted Successfully!';
        btn.style.opacity = '1';
        btn.style.background = '#1a7a4a';
        btn.style.color = '#fff';
        btn.style.cursor = 'default';
        form.reset();
        if (extraReset) extraReset();
        setTimeout(() => resetButton(btn), 3000);
    }

    // ─── Helper: error state ─────────────────────────────────────────────────
    function setButtonError(btn) {
        btn.textContent = '✗ Error! Try again';
        btn.style.opacity = '1';
        btn.style.background = '#c0392b';
        btn.style.color = '#fff';
        btn.style.cursor = 'pointer';
        setTimeout(() => resetButton(btn), 2500);
    }

    // ─── Helper: button wapas normal ─────────────────────────────────────────
    function resetButton(btn) {
        btn.disabled = false;
        btn.textContent = btn._originalText;
        btn.style.opacity = '';
        btn.style.background = '';
        btn.style.color = '';
        btn.style.cursor = '';
    }

    // ════════════════════════════════════════════════════════════════════════
    // ORDER FORM (Custom Conversion)
    // ════════════════════════════════════════════════════════════════════════
    if (document.getElementById('order-form')) {
        const form = document.getElementById('order-form');
        const rangeSelect = document.getElementById('range');
        const motorSelect = document.getElementById('motor-type');
        const priceDisplay = document.getElementById('estimated-price');

        const prices = {
            '30':  { 'hub': 14500 },
            '60':  { 'hub': 19000 },
            '100': { 'hub': 26000 }
        };

        function updatePrice() {
            const selectedRange = rangeSelect.value;
            let price = 0;
            if (selectedRange && prices[selectedRange]) {
                price = prices[selectedRange]['hub'];
            }
            priceDisplay.textContent = `₹${price}`;
        }

        rangeSelect.addEventListener('change', updatePrice);
        motorSelect.addEventListener('change', updatePrice);

        let isSubmittingOrder = false;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (isSubmittingOrder) return;   // double-click block
            isSubmittingOrder = true;

            const submitBtn = form.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn);

            const formData = new FormData(form);
            const priceValue = priceDisplay.textContent.replace('₹', '');
            formData.append('price', priceValue);

            try {
                const response = await fetch('https://api.vimantech.in.net/send-email', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    setButtonSuccess(submitBtn, form, () => {
                        priceDisplay.textContent = '₹0';
                    });
                } else {
                    setButtonError(submitBtn);
                }
            } catch (error) {
                console.error('Order form error:', error);
                setButtonError(submitBtn);
            } finally {
                // 3s baad flag reset (success ya error dono cases mein)
                setTimeout(() => { isSubmittingOrder = false; }, 3000);
            }
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // QUOTE FORM (Get a Quote)
    // ════════════════════════════════════════════════════════════════════════
    if (document.getElementById('quote-form')) {
        const form = document.getElementById('quote-form');

        let isSubmittingQuote = false;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (isSubmittingQuote) return;   // double-click block
            isSubmittingQuote = true;

            const submitBtn = form.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn);

            const formData = new FormData(form);
            const data = {
                name:    formData.get('name'),
                email:   formData.get('email'),
                phone:   formData.get('phone'),
                message: formData.get('message'),
            };

            try {
                const response = await fetch('https://api.vimantech.in.net/send-quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    setButtonSuccess(submitBtn, form, null);
                } else {
                    setButtonError(submitBtn);
                }
            } catch (error) {
                console.error('Quote form error:', error);
                setButtonError(submitBtn);
            } finally {
                setTimeout(() => { isSubmittingQuote = false; }, 3000);
            }
        });
    }

});

// ════════════════════════════════════════════════════════════════════════
// Hamburger Menu
// ════════════════════════════════════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

const navItems = document.querySelectorAll('nav ul li a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});
   // tumhara existing code



// MAGNETIC BUTTON

const magneticButtons =
document.querySelectorAll('.cta-button');

magneticButtons.forEach((btn)=>{

    btn.addEventListener('mousemove',(e)=>{

        const rect =
        btn.getBoundingClientRect();

        const x =
        e.clientX - rect.left - rect.width/2;

        const y =
        e.clientY - rect.top - rect.height/2;

        btn.style.transform =
        `translate(${x*0.2}px,${y*0.2}px)`;

    });

    btn.addEventListener('mouseleave',()=>{

        btn.style.transform =
        `translate(0px,0px)`;

    });

});
 const glow = document.createElement('div');

glow.classList.add('cursor-glow');

document.body.appendChild(glow);

document.addEventListener('mousemove',(e)=>{

    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';

});
const header = document.querySelector('header');

window.addEventListener('scroll',()=>{

    if(window.scrollY > 50){

        header.style.background =
        'rgba(5,5,15,0.75)';

        header.style.backdropFilter =
        'blur(18px)';

    }else{

        header.style.background =
        'rgba(10,10,10,0.45)';
    }

});