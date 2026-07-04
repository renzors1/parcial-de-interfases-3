import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { ClinicaService } from '../../services/clinica.service';
import { Mascota, Cita, Veterinario, EntradaHistorial } from '../../models/clinica';
import { FormatoFechaPipe } from '../../pipes/formato-fecha.pipe';
import { ResaltarProximaDirective } from '../../directives/resaltar-proxima.directive';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, Navbar, Footer, FormatoFechaPipe, ResaltarProximaDirective],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas implements OnInit {
  mascotas: Mascota[] = [];
  citas: Cita[] = [];
  citaForm!: FormGroup;
  esCliente: boolean = false;
  esVeterinario: boolean = false;
  vetAsociadoNombre: string = '';
  correoActivo: string = '';
  minFecha: string = '';
  veterinarios: Veterinario[] = [];
  vetSeleccionado: Veterinario | null = null;
  veterinariosList: string[] = [];
  horasDisponibles: string[] = [];

  // Modal de Atención
  mostrarModalAtencion: boolean = false;
  citaSeleccionada: Cita | null = null;
  atencionPeso: number | null = null;
  atencionSintomas: string = '';
  atencionDiagnostico: string = '';
  atencionReceta: string = '';

  constructor(
    private fb: FormBuilder,
    private clinicaService: ClinicaService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarMascotas();
    this.cargarCitas();
    this.cargarVeterinarios();
    this.inicializarFormulario();
    this.establecerFechaMinima();
  }

  cargarDatosUsuario(): void {
    if (typeof localStorage !== 'undefined') {
      const activo = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
      if (activo) {
        this.esCliente = activo.rol === 'CLIENTE';
        this.esVeterinario = activo.rol === 'VETERINARIO';
        this.vetAsociadoNombre = activo.veterinarioAsociado || '';
        this.correoActivo = activo.correo || '';
      }
    }
  }

  inicializarFormulario(): void {
    const vetPorDefecto = this.esVeterinario ? this.vetAsociadoNombre : '';
    this.citaForm = this.fb.group({
      mascotaId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      veterinario: [{ value: vetPorDefecto, disabled: this.esVeterinario }, Validators.required],
      motivo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.,;:!\?\-\(\)]*$/)]]
    });

    if (this.esVeterinario) {
      this.vetSeleccionado = this.veterinarios.find(v => v.nombreCompleto === this.vetAsociadoNombre) || null;
      this.generarHorasDisponibles();
    }
  }

  cargarVeterinarios(): void {
    const todosVets = this.clinicaService.getVeterinarios();
    if (this.esVeterinario) {
      this.veterinarios = todosVets.filter(v => v.nombreCompleto === this.vetAsociadoNombre);
    } else {
      this.veterinarios = todosVets;
    }
    this.veterinariosList = this.veterinarios.map(v => v.nombreCompleto);
  }

  establecerFechaMinima(): void {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    this.minFecha = `${anio}-${mes}-${dia}`;
  }

  onFechaChange(): void {
    this.generarHorasDisponibles();
  }

  onVeterinarioChange(): void {
    const nombreCompleto = this.citaForm.get('veterinario')?.value;
    this.vetSeleccionado = this.veterinarios.find(v => v.nombreCompleto === nombreCompleto) || null;
    this.generarHorasDisponibles();
  }

  generarHorasDisponibles(): void {
    const fecha = this.citaForm.get('fecha')?.value;
    if (!this.vetSeleccionado || !fecha) {
      this.horasDisponibles = [];
      return;
    }

    const { horaInicio, horaFin } = this.vetSeleccionado.horario;
    const inicio = parseInt(horaInicio.split(':')[0], 10);
    const fin = parseInt(horaFin.split(':')[0], 10);

    const horas: string[] = [];
    for (let h = inicio; h <= fin; h++) {
      const horaStr = String(h).padStart(2, '0') + ':00';
      horas.push(horaStr);
    }

    const citasExistentes = this.clinicaService.getCitas();
    const vetNombre = this.vetSeleccionado.nombreCompleto;
    
    this.horasDisponibles = horas.filter(h => {
      const ocupada = citasExistentes.some(c => 
        c.veterinario === vetNombre &&
        c.fecha === fecha &&
        c.hora === h
      );
      return !ocupada;
    });
  }

  obtenerTextoHorario(vet: Veterinario): string {
    const nombresDias: { [key: number]: string } = {
      1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 0: 'Domingo'
    };
    const dias = vet.horario.dias.map(d => nombresDias[d]).join(', ');
    return `${dias} de ${vet.horario.horaInicio} a ${vet.horario.horaFin}`;
  }

  cargarMascotas(): void {
    const todas = this.clinicaService.getMascotas();
    if (this.esCliente) {
      this.mascotas = todas.filter(m => m.duenoEmail === this.correoActivo);
    } else {
      this.mascotas = todas;
    }
  }

  cargarCitas(): void {
    const todas = this.clinicaService.getCitas();
    if (this.esCliente) {
      const misMascotasIds = this.mascotas.map(m => m.id);
      this.citas = todas.filter(c => misMascotasIds.includes(c.mascotaId));
    } else if (this.esVeterinario) {
      this.citas = todas.filter(c => c.veterinario === this.vetAsociadoNombre);
    } else {
      this.citas = todas;
    }
  }

  registrarCita(): void {
    if (this.citaForm.invalid) {
      alert('Por favor complete todos los campos.');
      return;
    }

    const formVal = this.citaForm.getRawValue();

    // 1. Validar que la fecha no sea en el pasado
    const hoyStr = this.minFecha;
    if (formVal.fecha < hoyStr) {
      alert('No es posible agendar citas en fechas pasadas.');
      return;
    }

    // 2. Validar horario y día de atención del especialista
    const vetInfo = this.veterinarios.find(v => v.nombreCompleto === formVal.veterinario);
    if (!vetInfo) {
      alert('Veterinario no válido.');
      return;
    }

    // Obtener día de la semana (1 = Lunes, ..., 0 = Domingo)
    const partesFecha = formVal.fecha.split('-');
    const anio = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1;
    const dia = parseInt(partesFecha[2], 10);
    const fechaSeleccionada = new Date(anio, mes, dia);
    const diaSemana = fechaSeleccionada.getDay();

    if (!vetInfo.horario.dias.includes(diaSemana)) {
      const nombresDias: { [key: number]: string } = {
        1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 0: 'Domingo'
      };
      const diasPermitidos = vetInfo.horario.dias.map(d => nombresDias[d]).join(', ');
      alert(`El especialista solo atiende los días: ${diasPermitidos}.`);
      return;
    }

    // Validar rango horario
    const horaSeleccionada = formVal.hora;
    const { horaInicio, horaFin } = vetInfo.horario;
    if (horaSeleccionada < horaInicio || horaSeleccionada > horaFin) {
      alert(`El especialista atiende en el rango horario de ${horaInicio} a ${horaFin}.`);
      return;
    }

    // 3. Validar colisiones (mismo doctor, fecha y hora)
    const citasExistentes = this.clinicaService.getCitas();
    const hayColision = citasExistentes.some(c => 
      c.veterinario === formVal.veterinario &&
      c.fecha === formVal.fecha &&
      c.hora === formVal.hora
    );

    if (hayColision) {
      alert('El especialista ya tiene una cita programada para esta fecha y hora. Por favor, seleccione otro horario.');
      return;
    }

    const mascotaSeleccionada = this.mascotas.find(m => m.id === formVal.mascotaId);
    if (!mascotaSeleccionada) {
      alert('Mascota no válida.');
      return;
    }

    const nuevaCita: Cita = {
      id: Date.now().toString(),
      mascotaId: formVal.mascotaId,
      mascotaNombre: mascotaSeleccionada.nombre,
      duenoNombre: mascotaSeleccionada.dueno,
      fecha: formVal.fecha,
      hora: formVal.hora,
      veterinario: formVal.veterinario,
      motivo: formVal.motivo,
      estado: 'Pendiente'
    };

    this.clinicaService.saveCita(nuevaCita);
    this.cargarCitas();
    
    const vetPorDefecto = this.esVeterinario ? this.vetAsociadoNombre : '';
    this.citaForm.reset({ mascotaId: '', veterinario: vetPorDefecto });
    
    if (this.esVeterinario) {
      this.vetSeleccionado = this.veterinarios.find(v => v.nombreCompleto === this.vetAsociadoNombre) || null;
      this.generarHorasDisponibles();
    } else {
      this.vetSeleccionado = null;
      this.horasDisponibles = [];
    }
    
    alert('Cita agendada correctamente.');
  }

  eliminarCita(id: string): void {
    this.clinicaService.deleteCita(id);
    this.cargarCitas();
  }

  abrirModalAtencion(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.atencionSintomas = cita.motivo;
    this.atencionDiagnostico = '';
    this.atencionReceta = '';

    const mascota = this.mascotas.find(m => m.id === cita.mascotaId);
    this.atencionPeso = mascota?.peso || null;

    this.mostrarModalAtencion = true;
  }

  cerrarModalAtencion(): void {
    this.mostrarModalAtencion = false;
    this.citaSeleccionada = null;
  }

  guardarResumenCita(): void {
    if (!this.citaSeleccionada) return;
    if (!this.atencionDiagnostico) {
      alert('Por favor ingrese el diagnóstico.');
      return;
    }

    const mascotaId = this.citaSeleccionada.mascotaId;

    // 1. Guardar historial clínico
    const nuevaEntrada: EntradaHistorial = {
      id: Date.now().toString(),
      mascotaId: mascotaId,
      fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnostico: this.atencionDiagnostico,
      tratamiento: `Atendido en Cita por ${this.citaSeleccionada.veterinario}.`,
      receta: this.atencionReceta || 'Ninguna',
      peso: this.atencionPeso || undefined
    };
    this.clinicaService.saveHistorial(nuevaEntrada);

    // 2. Actualizar peso de la mascota si se ingresó
    if (this.atencionPeso !== null && this.atencionPeso > 0) {
      this.clinicaService.updateMascotaPeso(mascotaId, this.atencionPeso);
    }

    // 3. Cambiar estado de la cita a 'Atendida'
    this.clinicaService.updateCitaEstado(this.citaSeleccionada.id, 'Atendida');

    this.cerrarModalAtencion();
    this.cargarCitas();
    this.cargarMascotas();
    alert('Atención registrada e historial clínico actualizado con éxito.');
  }

  filtrarCaracteres(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const regex = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.,;:!\?\-\(\)]/g;
    const originalValue = input.value;
    const cleanedValue = originalValue.replace(regex, '');
    if (originalValue !== cleanedValue) {
      input.value = cleanedValue;
      this.citaForm.get('motivo')?.setValue(cleanedValue, { emitEvent: false });
    }
  }

  filtrarDiagnostico(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const regex = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.,;:!\?\-\(\)]/g;
    this.atencionDiagnostico = input.value.replace(regex, '');
  }

  filtrarRecetaAtencion(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const regex = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.,;:!\?\-\(\)]/g;
    this.atencionReceta = input.value.replace(regex, '');
  }
}

