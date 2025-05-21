import React, { useState } from 'react';
import moment from 'moment';
import {Calendar, momentLocalizer } from 'react-big-calendar';
import  withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import vacinasPadrao from './vacinasPadrao';
import EventModal from './EventModal';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function Calendario (){
    const [eventos, setEventos] = useState(vacinasPadrao)
    const [eventoSelecionado, setEventoSelecionado] = useState(null);

    const eventStyle= (event) => ({
        style:{
            backgroundColor: event.color,
        },
    } )

    const moverEventos = (data) => {
        const { start, end} = data;
        const updatedEvents = eventos.map((event) =>{
            if( event.id === data.event.id){
                return{
                    ...event,
                    start: new Date(start),
                    end: new Date(end)
                };
            }
            return event;
        });

        setEventos(updatedEvents)
    }

    const handleEventClick = (evento) =>{
        setEventoSelecionado(evento);
    }

    const handleEventClose = () => {
        setEventoSelecionado(null);

    }

    return(
        <div className="tela">
            <div className='toolbar'>
                <p>Ferramentas</p>
            </div>

        <div className="calendario">
            <DragAndDropCalendar
                defaultDate={moment().toDate()}
                defaultView='month'
                events={eventos}
                localizer = {localizer}
                resizable
                onEventDrop={moverEventos}
                onEventResize={moverEventos}
                onSelectEvent={handleEventClick}
                eventPropGetter={eventStyle}
                className='calendar'
            />
        </div>

        {eventoSelecionado && (
            <EventModal
            evento = {eventoSelecionado}
            onClose ={handleEventClose}
            />
        )} 
        </div>
    )
}

export default Calendario;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#F0F8FF"
  },
  texto: {
    fontSize: 24
  },
  tela: {
    display:flex,
    backgroundColor: "#262626"
  },
  

});