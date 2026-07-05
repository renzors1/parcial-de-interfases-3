import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VeterinariosService } from '../../services/veterinarios.service';
import { Veterinario } from '../../models/clinica';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-gestion-medicos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './gestion-medicos.html',
  styleUrl: './gestion-medicos.css'
})
export class GestionMedicos implements OnInit {
  medicos: Veterinario[] = [];
  mostrarModal = false;
  modoEdicion = false;
  medicoSeleccionadoId: string | null = null;
  
  medicoForm: FormGroup;

  constructor(
    private veterinariosService: VeterinariosService, 
    private fb: FormBuilder,
    private router: Router
  ) {
    this.medicoForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\(\)]+$/)]],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.]+$/)]],
      especialidad: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      edad: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]$/)]], // 10 a 99 años
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^9[0-9]{8}$/)]],
      correoPersonal: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      correoInstitucional: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      direccion: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.,#-]+$/)]]
    });
  }

  ngOnInit(): void {
    this.cargarMedicos();

    // Auto-completar datos basados en el nombre completo
    this.medicoForm.get('nombreCompleto')?.valueChanges.subscribe(val => {
      if (val) {
        // Auto-formatear a Mayúsculas cada palabra (Title Case)
        const palabras = val.split(' ').map((p: string) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
        const capitalizado = palabras.join(' ');
        
        if (val !== capitalizado) {
          this.medicoForm.patchValue({ nombreCompleto: capitalizado }, { emitEvent: false });
        }

        // Generar correos y nombre corto solo al crear
        if (!this.modoEdicion) {
          const partes = capitalizado.trim().split(' ').filter((p: string) => p.length > 0);
          const primerNombre = partes[0] || '';
          const primerApellido = partes.length > 1 ? partes[1] : '';
          
          // Auto-generar Nombre Corto con "Dr."
          const nombreCorto = primerApellido ? `Dr. ${primerNombre} ${primerApellido}` : `Dr. ${primerNombre}`;
          this.medicoForm.patchValue({ nombre: nombreCorto }, { emitEvent: false });

          // Auto-generar Correo Institucional
          if (primerNombre && primerApellido) {
            const email = `${primerNombre.toLowerCase()}.${primerApellido.toLowerCase()}@vetcare.com`;
            // Remover tildes del correo
            const emailLimpio = email.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            this.medicoForm.patchValue({ correoInstitucional: emailLimpio }, { emitEvent: false });
          }
        }
      }
    });
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  cargarMedicos(): void {
    this.medicos = this.veterinariosService.getVeterinarios();
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.medicoSeleccionadoId = null;
    this.medicoForm.reset();
    this.mostrarModal = true;
  }

  abrirModalEditar(medico: Veterinario): void {
    this.modoEdicion = true;
    this.medicoSeleccionadoId = medico.id;
    this.medicoForm.patchValue({
      nombreCompleto: medico.nombreCompleto,
      nombre: medico.nombre,
      especialidad: medico.especialidad,
      edad: medico.edad,
      horaInicio: medico.horario.horaInicio,
      horaFin: medico.horario.horaFin,
      dni: medico.dni,
      telefono: medico.telefono,
      correoPersonal: medico.correoPersonal,
      correoInstitucional: medico.correoInstitucional,
      password: medico.password,
      direccion: medico.direccion
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarMedico(): void {
    if (this.medicoForm.invalid) return;

    const values = this.medicoForm.value;
    
    // Validación de correo institucional único
    const correoExistente = this.medicos.find(m => 
      m.correoInstitucional === values.correoInstitucional && 
      (!this.modoEdicion || m.id !== this.medicoSeleccionadoId)
    );
    
    if (correoExistente) {
      this.medicoForm.get('correoInstitucional')?.setErrors({ correoDuplicado: true });
      return;
    }
    
    if (this.modoEdicion && this.medicoSeleccionadoId) {
      const medicoEditado: Veterinario = {
        id: this.medicoSeleccionadoId,
        nombreCompleto: values.nombreCompleto,
        nombre: values.nombre,
        especialidad: values.especialidad,
        horario: {
          dias: [1, 2, 3, 4, 5],
          horaInicio: values.horaInicio,
          horaFin: values.horaFin
        },
        activo: true,
        edad: values.edad,
        dni: values.dni,
        telefono: values.telefono,
        correoPersonal: values.correoPersonal,
        correoInstitucional: values.correoInstitucional,
        password: values.password,
        direccion: values.direccion
      };
      
      const docAnterior = this.medicos.find(m => m.id === this.medicoSeleccionadoId);
      if (docAnterior) {
        medicoEditado.activo = docAnterior.activo;
        medicoEditado.horario.dias = docAnterior.horario.dias;
      }
      
      this.veterinariosService.updateVeterinario(medicoEditado);
    } else {
      const nuevoMedico: Veterinario = {
        id: 'v' + new Date().getTime().toString(),
        nombreCompleto: values.nombreCompleto,
        nombre: values.nombre,
        especialidad: values.especialidad,
        horario: {
          dias: [1, 2, 3, 4, 5],
          horaInicio: values.horaInicio,
          horaFin: values.horaFin
        },
        activo: true,
        edad: values.edad,
        dni: values.dni,
        telefono: values.telefono,
        correoPersonal: values.correoPersonal,
        correoInstitucional: values.correoInstitucional,
        password: values.password,
        direccion: values.direccion
      };
      this.veterinariosService.saveVeterinario(nuevoMedico);
    }

    this.cargarMedicos();
    this.cerrarModal();
  }

  toggleEstado(id: string): void {
    this.veterinariosService.toggleVeterinarioStatus(id);
    this.cargarMedicos();
  }
}
