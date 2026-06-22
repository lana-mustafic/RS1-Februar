import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaktureApiService } from '../../../../api-services/fakture/fakture-api.service';
import { ListFaktureQueryDto, FakturaTip } from '../../../../api-services/fakture/fakture-api.models';

@Component({
  selector: 'app-fakture',
  standalone: false,
  templateUrl: './fakture.component.html',
  styleUrl: './fakture.component.scss'
})
export class FaktureComponent implements OnInit {
  private router = inject(Router);
  private faktureApiService = inject(FaktureApiService);

  fakture: ListFaktureQueryDto[] = [];
  displayedColumns: string[] = ['brojRacuna', 'tip', 'datumKreiranja', 'brojStavki'];

  ngOnInit(): void {
    this.loadFakture();
  }

  loadFakture(): void {
    // Hardkodirano paging: stranica 1, veličina 10
    this.faktureApiService.list(1, 10).subscribe({
      next: (response) => {
        this.fakture = response.items;
      },
      error: (err) => {
        console.error('Greška pri učitavanju faktura:', err);
      }
    });
  }

  onNovaFaktura(): void {
    this.router.navigate(['/admin/fakture/add']);
  }

  /**
   * Helper metoda za prikaz tipa fakture kao string
   */
  getTipString(tip: FakturaTip): string {
    return tip === FakturaTip.Ulazna ? 'ULAZNA' : 'IZLAZNA';
  }

  /**
   * Helper metoda za CSS klasu badge-a
   */
  getTipClass(tip: FakturaTip): string {
    return tip === FakturaTip.Ulazna ? 'ulazna' : 'izlazna';
  }
}
