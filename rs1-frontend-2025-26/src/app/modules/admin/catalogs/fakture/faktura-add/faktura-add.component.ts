import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FakturaTip} from '../../../../../api-services/fakture/fakture-api.models';

interface Tip {
  id: FakturaTip;
  name: string;
}

interface Kategorija {
  id: number;
  name: string;
}

@Component({
  selector: 'app-faktura-add',
  standalone: false,
  templateUrl: './faktura-add.component.html',
  styleUrl: './faktura-add.component.scss'
})
export class FakturaAddComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup;
  isSaving = false;
  isLoading = false;

  tipovi: Tip[] = [
    { id: FakturaTip.Ulazna, name: 'Ulazna' },
    { id: FakturaTip.Izlazna, name: 'Izlazna' }
  ];

  //ispitni zadatak: zamjeniti hardkodirano sa API rezultatom
  kategorije: Kategorija[] = [
    { id: 1, name: 'Laptopi' },
    { id: 2, name: 'Monitori' }
  ];

  constructor() {
    this.form = this.fb.group({
      brojRacuna: [''],
      tip: [''],
      napomena: [''],
      items: this.fb.array([])
    });

    // Dodaj dvije početne stavke
    this.addItem();
    this.addItem();
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      kategorijaId: [''],
      proizvod: [''],
      kolicina: [1]
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['/admin/fakture']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      // TODO: Implementirati save logiku
      console.log('Form data:', this.form.value);
      this.router.navigate(['/admin/fakture']);
    }
  }
}
