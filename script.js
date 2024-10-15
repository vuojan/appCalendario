async function cargarEventos() {
    const response = await fetch('eventos.json');
    return await response.json();
}

async function initCalendar() {
    const eventos = await cargarEventos();
    const calendarEl = document.getElementById('calendario');

    
    const fechasConEventos = Object.keys(eventos);

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        dateClick: function(info) {
            mostrarEventos(eventos, info.dateStr);
        },
        events: Object.entries(eventos).flatMap(([fecha, listaEventos]) => 
            listaEventos.map(evento => ({
                title: evento.nombre,
                start: fecha,
                description: evento.descripcion,
                ubicacion: evento.ubicacion,
                materiales: evento.materiales.join(', ')
            }))
        ),
        eventDidMount: function(info) {
            
            if (fechasConEventos.includes(info.event.startStr)) {
                info.el.classList.add('fc-day-event');
            }
        }
    });

    calendar.render();
}

function mostrarEventos(eventos, fecha) {
    const eventosDiv = document.getElementById('eventos');
    eventosDiv.innerHTML = ''; 

    if (eventos[fecha]) {
        eventos[fecha].forEach(evento => {
            const eventoDiv = document.createElement('div');
            eventoDiv.className = 'evento';
            eventoDiv.innerHTML = `
                <h3>${evento.nombre}</h3>
                <p><strong>Descripción:</strong> ${evento.descripcion}</p>
                <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>
                <p><strong>Materiales:</strong> ${evento.materiales.join(', ')}</p>
            `;
            eventosDiv.appendChild(eventoDiv);
        });
    } else {
        eventosDiv.innerHTML = '<p>No hay eventos para esta fecha.</p>';
    }
}

initCalendar();

