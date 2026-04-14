//=======CONFIGURACION=======
const supabaseUrl = 'https://bqcmutnxppsszjdsblyo.supabase.co'
const supabaseKey = 'sb_publishable_SsMYfFd4RZlNUCGo5w6EAw_3F615dzj'
const _supabase = supabase.createClient(supabaseUrl, supabaseKey)

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    const resultadoCostoEl = document.getElementById('resultado-costo');
    const resultadoPrecioEl = document.getElementById('resultado-precio');
    const resultadoGananciaEl = document.getElementById('resultado-ganancia');
    const btnGuardar = document.getElementById('btn-guardar');

    const formatCurrency = (value) => {
        return '$ ' + value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const calculate = () => {
        const mercaderia = parseFloat(document.getElementById('costo-mercaderia').value) || 0;
        const transporte = parseFloat(document.getElementById('costo-transporte').value) || 0;
        const empaque = parseFloat(document.getElementById('costo-empaque').value) || 0;
        const otros = parseFloat(document.getElementById('costo-otros').value) || 0;
        const margen = parseFloat(document.getElementById('margen-ganancia').value) || 0;

        const costoTotal = mercaderia + transporte + empaque + otros;
        const ganancia = costoTotal * (margen / 100);
        const precioSugerido = costoTotal + ganancia;

        animateValueUpdate(resultadoCostoEl, costoTotal);
        animateValueUpdate(resultadoPrecioEl, precioSugerido);
        animateValueUpdate(resultadoGananciaEl, ganancia);

        return { costoTotal, precioSugerido, ganancia };
    };

    //=======MODULO DE GUARDADO=======
    btnGuardar.addEventListener('click', async () => {
        const { costoTotal, precioSugerido, ganancia } = calculate();
        
        if (costoTotal === 0) {
            alert('Por favor, ingresa al menos un costo antes de guardar.');
            return;
        }

        btnGuardar.innerText = 'Guardando en la nube...';
        btnGuardar.disabled = true;

        const { error } = await _supabase
            .from('calculos')
            .insert([
                { 
                    costo_total: costoTotal, 
                    precio_venta: precioSugerido, 
                    ganancia: ganancia 
                }
            ]);

        if (error) {
            alert('Error al guardar: ' + error.message);
        } else {
            alert('¡Cálculo guardado con éxito en Supabase!');
        }

        btnGuardar.innerText = 'Guardar Reporte en la Nube';
        btnGuardar.disabled = false;
    });

    const animateValueUpdate = (element, newValue) => {
        const formatted = formatCurrency(newValue);
        if (element.innerText !== formatted) {
            element.innerText = formatted;
            element.classList.remove('animate-value');
            void element.offsetWidth;
            element.classList.add('animate-value');
        }
    };

    inputs.forEach(input => {
        input.addEventListener('input', calculate);
    });

    calculate();
});
