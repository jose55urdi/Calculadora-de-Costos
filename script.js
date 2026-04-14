/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Select all inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    
    // Select result elements
    const resultadoCostoEl = document.getElementById('resultado-costo');
    const resultadoPrecioEl = document.getElementById('resultado-precio');
    const resultadoGananciaEl = document.getElementById('resultado-ganancia');

    // Helper to format currency
    const formatCurrency = (value) => {
        return '$ ' + value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Calculate function
    const calculate = () => {
        // Get values
        const mercaderia = parseFloat(document.getElementById('costo-mercaderia').value) || 0;
        const transporte = parseFloat(document.getElementById('costo-transporte').value) || 0;
        const empaque = parseFloat(document.getElementById('costo-empaque').value) || 0;
        const otros = parseFloat(document.getElementById('costo-otros').value) || 0;
        
        const margen = parseFloat(document.getElementById('margen-ganancia').value) || 0;

        // Calculations
        const costoTotal = mercaderia + transporte + empaque + otros;
        
        // Formula de Markup: Precio = Costo Total + (Costo Total * Margen / 100)
        const ganancia = costoTotal * (margen / 100);
        const precioSugerido = costoTotal + ganancia;

        // Update DOM
        animateValueUpdate(resultadoCostoEl, costoTotal);
        animateValueUpdate(resultadoPrecioEl, precioSugerido);
        animateValueUpdate(resultadoGananciaEl, ganancia);
    };

    // Add animation effect when updating values
    const animateValueUpdate = (element, newValue) => {
        const formatted = formatCurrency(newValue);
        if (element.innerText !== formatted) {
            element.innerText = formatted;
            
            // Re-trigger animation
            element.classList.remove('animate-value');
            void element.offsetWidth; // Trigger reflow
            element.classList.add('animate-value');
        }
    };

    // Listen to changes for reactive updates
    inputs.forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Initial calculation setup
    calculate();
});
