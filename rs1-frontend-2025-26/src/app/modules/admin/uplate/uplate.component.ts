import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UplateApiService } from '../../../api-services/uplate/uplate-api.service';
import { ListUplateQueryDto } from '../../../api-services/uplate/uplate-api.models';

@Component({
  selector: 'app-uplate',
  standalone: false,
  templateUrl: './uplate.component.html',
  styleUrl: './uplate.component.scss'
})
export class UplateComponent implements OnInit {
  private router = inject(Router);
  private uplateApiService = inject(UplateApiService);

  uplate: ListUplateQueryDto[] = [];
  displayedColumns: string[] = ['brojUplate', 'orderReferenceNumber', 'datumKreiranja', 'ukupanIznos'];

  // Paging
  pageSize = 10;

  ngOnInit(): void {
    this.loadUplate();
  }

  loadUplate(): void {
    this.uplateApiService.list(1, 100).subscribe({
      next: (response) => {
        this.uplate = response.items;
      },
      error: (err) => {
        console.error('Greška pri učitavanju uplata:', err);
      }
    });
  }

  onNovaUplata(): void {
    this.router.navigate(['/admin/uplate/add']);
  }

}
