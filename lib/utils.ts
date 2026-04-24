// Format price as USD currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Load Paystack inline script dynamically
export const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve) => {
    // Check if script already exists
    if (document.querySelector('#paystack-script')) {
      resolve();
      return;
    }
    
    // Create and append script tag
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};