import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NacinPlacanjaType } from '../../../../api-services/uplate/uplate-api.models';
import {
  ListOrdersWithItemsQueryDto,
  ListOrdersWithItemsQueryDtoItem
} from '../../../../api-services/orders/orders-api.models';
import { ToasterService } from '../../../../core/services/toaster.service';

interface NacinPlacanja {
  id: NacinPlacanjaType;
  name: string;
}

@Component({
  selector: 'app-uplata-add',
  standalone: false,
  templateUrl: './uplata-add.component.html',
  styleUrl: './uplata-add.component.scss'
})
export class UplataAddComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup;
  isSaving = false;
  isLoading = false;


  narudzbe: ListOrdersWithItemsQueryDto[] = [];
  selectedOrderItems: ListOrdersWithItemsQueryDtoItem[] = [];

  constructor() {
    this.form = this.fb.group({
      brojUplate: [''],
      orderId: [''],
      napomena: [''],
      items: this.fb.array([])
    });

    // Dodaj dvije pocetne stavke
    this.addItem();
    this.addItem();
  }

  ngOnInit(): void {
  }

  onOrderChange(orderId: number): void {
    const order = this.narudzbe.find(o => o.id === orderId);
    this.selectedOrderItems = order ? order.items : [];
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: [''],
      kolicina: [1],
      nacinPlacanja: ['']
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['/admin/uplate']);
  }

  onSubmit(): void {
  }
}
