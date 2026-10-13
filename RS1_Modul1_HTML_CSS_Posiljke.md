# Pošiljke — samo HTML i CSS

Ovaj fajl je **samo izgled** tri stranice: lista, dodavanje, uređivanje.

Backend, TypeScript i API su u `RS1_Modul1_Vodic.md`. Ovdje ih nema.

Na ispitu ne listaš ovaj fajl. Ova tabela je cijeli postupak. Ispod nje, **Dio 1** je gotov kod koji lijepiš. **Dio 2** objašnjava šta je starter već imao.

Sve putanje kreću od `rs1-frontend-2025-26/src/app/modules/admin/`.

## Odakle šta kopiraš

### CSS

CSS liste **ne diraš** i **ne kopiraš**. CSS formi **ne kucaš** iz bloka u tački 5. Kopiraš gotov fajl proizvoda, cijeli, i ništa u njemu ne mijenjaš.

| Šta | Obrazac — otvori i kopiraj cijeli fajl | Zalijepi u | Unutra |
|-----|----------------------------------------|------------|--------|
| Lista | nema obrasca. Već stoji u starteru: `posiljke/posiljke.component.scss` | nigdje | ne otvaraj radi pisanja |
| Dodavanje | `catalogs/products/products-add/products-add.component.scss` | `posiljke/posiljka-add/posiljka-add.component.scss` | ništa. Fajl u starteru ne postoji, ti ga napraviš kao kopiju |
| Uređivanje | **isti** `products-add.component.scss`. Ne `products-edit.component.scss` | `posiljke/posiljka-edit/posiljka-edit.component.scss` | ništa |

Ako si CSS dodavanja već kopirala, uređivanje možeš kopirati iz tog fajla. Sadržaj je isti.

Ikona u naslovu ostaje korpa (`add_shopping_cart`), jer je fajl od proizvoda. Na ispitu je ostavi.

### HTML

Listu proizvoda ne lijepiš u listu pošiljki. Dodavanje kopiraš iz `products-add.component.html` i preimenuješ polja. `| translate` i naziv, opis, cijena, kategorija ne ostaju.

| Šta | Odakle uzimaš kod | U koji fajl | Kako |
|-----|-------------------|-------------|------|
| Lista | Dio 1, tačka **1**. Korak po korak, šta se mijenja i odakle: Dio 2, **Lista, HTML** i **Lista, CSS** | `posiljke/posiljke.component.html` | stranicu ne brišeš. Starter već ima tabelu |
| Dodavanje | uzor u projektu: `catalogs/products/products-add/products-add.component.html`. Gotov fajl i šta preimenuješ: Dio 2, **Dodavanje, HTML** | `posiljke/posiljka-add/posiljka-add.component.html` | obrišeš `posiljka-add works!` i zalijepiš cijeli fajl |
| Uređivanje | kreneš od gotovog HTML-a dodavanja, ne od `products-edit`. Šta dodaš: Dio 2, **Uređivanje, HTML**. Cijeli kod za lijepljenje: Dio 1, tačka **4** | `posiljke/posiljka-edit/posiljka-edit.component.html` | obrišeš `posiljka-edit works!` i zalijepiš cijeli fajl |

Ako hoćeš da vidiš raspored prije lijepljenja, otvori ove fajlove i **samo gledaj**. Njihov tekst ne ide u pošiljke.

| Gledaš, ne kopiraš | Šta tu vidiš |
|--------------------|--------------|
| `catalogs/products/products.component.html` | filter u `actions-container` pored dugmeta, cijena sa `number` pipe, ispod tabele `<app-fit-paginator-bar [vm]="this" />` |
| `catalogs/products/products-add/products-add.component.html` | cijeli HTML dodavanja. Kopiraš ga i preimenuješ polja, kako piše u Dijelu 2 |
| `catalogs/products/products-edit/products-edit.component.html` | ista kartica kao dodavanje, drugi naslov. Nema statusa ni datuma. Kod pošiljke ne lijepiš odavde. Kreneš od svog `posiljka-add.component.html` |

---

# Dio 1 — cijeli kod

HTML liste, dodavanja i uređivanja lijepiš **odavde** (tačke 1, 3 i 4). CSS formi ne prepisuješ iz tačke 5: taj fajl kopiraš iz `products-add.component.scss`, kako piše u tabeli na vrhu.

## 1. Lista — cijeli HTML

Fajl: `src/app/modules/admin/posiljke/posiljke.component.html`

Ovo je fajl **poslije** tvojih izmjena. U dijelu 2 piše šta je od ovoga novo.

```html
<div class="container">
  <!-- Header Card -->
  <div class="header-card mat-elevation-z2">
    <div class="header-card-content">
      <div class="title-section">
        <div class="title-icon">
          <mat-icon>local_shipping</mat-icon>
        </div>
        <h1>Pošiljke</h1>
      </div>

      <div class="actions-container">
        <mat-form-field class="search-field" appearance="fill">
          <mat-label>Narudžba</mat-label>
          <mat-select
            [(ngModel)]="request.orderId"
            (ngModelChange)="onOrderFilterChange()">
            <mat-option [value]="null">Sve narudžbe</mat-option>
            <mat-option *ngFor="let o of orders" [value]="o.id">
              {{ o.referenceNumber }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-raised-button color="primary" (click)="onCreate()">
          <mat-icon>add</mat-icon>
          Nova pošiljka
        </button>
      </div>
    </div>
  </div>

  <!-- Info napomena -->
  <div class="info-card">
    <mat-icon>info</mat-icon>
    <span>Ovdje raditi ispitni zadatak - prvi modul</span>
  </div>

  <!-- Table -->
  <div class="mat-elevation-z8">
    <table mat-table [dataSource]="items">
      <!-- Broj pošiljke -->
      <ng-container matColumnDef="shipmentNumber">
        <th mat-header-cell *matHeaderCellDef>Broj pošiljke</th>
        <td mat-cell *matCellDef="let item">
          <span style="font-weight: 500">{{ item.shipmentNumber }}</span>
        </td>
      </ng-container>

      <!-- Narudžba -->
      <ng-container matColumnDef="orderReferenceNumber">
        <th mat-header-cell *matHeaderCellDef>Narudžba</th>
        <td mat-cell *matCellDef="let item">
          {{ item.orderReferenceNumber }}
        </td>
      </ng-container>

      <!-- Status -->
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let item">
          <span class="status-badge status-{{ item.status }}">
            {{ item.statusNaziv }}
          </span>
        </td>
      </ng-container>

      <!-- Cijena dostave -->
      <ng-container matColumnDef="shippingCost">
        <th mat-header-cell *matHeaderCellDef>Cijena dostave</th>
        <td mat-cell *matCellDef="let item">
          <span style="font-weight: 600; color: #4976b5">
            {{ item.shippingCost | number:'1.1-1' }} KM
          </span>
        </td>
      </ng-container>

      <!-- Datum slanja -->
      <ng-container matColumnDef="shippedAtUtc">
        <th mat-header-cell *matHeaderCellDef>Datum slanja</th>
        <td mat-cell *matCellDef="let item">
          {{ item.shippedAtUtc | date:'dd.MM.yyyy' }}
        </td>
      </ng-container>

      <!-- Datum dostave -->
      <ng-container matColumnDef="deliveredAtUtc">
        <th mat-header-cell *matHeaderCellDef>Datum dostave</th>
        <td mat-cell *matCellDef="let item">
          {{ (item.deliveredAtUtc | date:'dd.MM.yyyy') || '-' }}
        </td>
      </ng-container>

      <!-- Akcije -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Akcije</th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button color="primary" matTooltip="Uredi" (click)="onEdit(item)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" matTooltip="Obriši" (click)="onDelete(item)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

      <!-- No data -->
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="7">
          Nema pošiljki.
        </td>
      </tr>
    </table>

    <app-fit-paginator-bar [vm]="this" />
  </div>
</div>
```

## 2. Lista — cijeli CSS

Fajl: `src/app/modules/admin/posiljke/posiljke.component.scss`

Ovaj fajl **već postoji u starteru**. Ne dodaješ klasu. Ne brišeš klasu. Filter i bedž statusa već imaju stil ovdje, iako filter u HTML-u još ne stoji.

```scss
// Glavne boje - teget paleta #4976b5
$primary-color: #4976b5;
$primary-light: #6b96d1;
$primary-lighter: #e8f0f9;
$primary-dark: #3a5e91;

$text-primary: #2c3e50;
$text-secondary: #546e7a;

$bg-gradient-start: #f0f5fb;
$bg-gradient-end: #e3ecf7;

$border-color: rgba(73, 118, 181, 0.15);

// Container
.container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, $bg-gradient-start 0%, $bg-gradient-end 100%);
  min-height: 100vh;
}

// Header Card
.header-card {
  background: white;
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(73, 118, 181, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid $border-color;

  .header-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;

    .title-section {
      display: flex;
      align-items: center;
      gap: 16px;

      .title-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(73, 118, 181, 0.25);

        mat-icon {
          color: white;
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
        color: $text-primary;
        letter-spacing: -0.5px;
      }
    }

    .actions-container {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;

      .search-field {
        width: 280px;

        ::ng-deep {
          .mat-mdc-text-field-wrapper {
            background-color: white;
          }

          .mdc-notched-outline__leading,
          .mdc-notched-outline__notch,
          .mdc-notched-outline__trailing {
            border-color: rgba(73, 118, 181, 0.3) !important;
          }

          .mat-mdc-form-field.mat-focused {
            .mdc-notched-outline__leading,
            .mdc-notched-outline__notch,
            .mdc-notched-outline__trailing {
              border-color: $primary-color !important;
              border-width: 2px !important;
            }
          }

          .mat-mdc-floating-label {
            color: $text-secondary;
          }

          .mat-focused .mat-mdc-floating-label {
            color: $primary-color !important;
          }

          input {
            color: $text-primary;
          }

          .mat-icon {
            color: $primary-color;
          }
        }
      }

      button[mat-raised-button] {
        background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
        color: white;
        font-weight: 600;
        padding: 0 24px;
        height: 44px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(73, 118, 181, 0.25);
        transition: all 0.3s ease;

        mat-icon {
          margin-right: 8px;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(73, 118, 181, 0.35);
        }
      }
    }
  }
}

// Loading & Error
.loading {
  text-align: center;
  padding: 40px;
  color: $text-secondary;
  font-size: 16px;
}

.error {
  text-align: center;
  padding: 20px;
  color: #ef5350;
  font-size: 16px;
}

// Status badges
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  &.status-1 { // Kreirana
    background: #e3f2fd;
    color: #1565c0;
  }
  &.status-2 { // USkladistu
    background: #fff3e0;
    color: #e65100;
  }
  &.status-3 { // UDostavi
    background: #e8f5e9;
    color: #2e7d32;
  }
  &.status-4 { // Dostavljena
    background: #e8f5e9;
    color: #1b5e20;
  }
  &.status-5 { // Otkazana
    background: #ffebee;
    color: #c62828;
  }
}

// Table
table {
  width: 100%;
}

// Responsive
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .header-card {
    padding: 20px;

    .header-card-content {
      flex-direction: column;
      align-items: stretch;

      .title-section {
        justify-content: center;
      }

      .actions-container {
        flex-direction: column;
        width: 100%;

        .search-field {
          width: 100%;
        }

        button[mat-raised-button] {
          width: 100%;
        }
      }
    }
  }
}
```

## 3. Dodavanje — cijeli HTML

Fajl: `src/app/modules/admin/posiljke/posiljka-add/posiljka-add.component.html`

Starter ima samo `<p>posiljka-add works!</p>`. To obrišeš i zalijepiš ovo.

```html
<div class="container">
  <div class="header-card mat-elevation-z2">
    <h1>Nova pošiljka</h1>
  </div>

  <div class="form-card mat-elevation-z2">
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="errorMessage" class="error-banner">
        <mat-icon>error</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>

      <div *ngIf="isLoading" class="loading-overlay">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Snimanje...</p>
      </div>

      <p>Status i datum slanja postavljaju se automatski.</p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Broj pošiljke</mat-label>
        <input matInput formControlName="shipmentNumber" maxlength="20" />
        <mat-error *ngIf="hasError('shipmentNumber', 'required')">
          Broj pošiljke je obavezan.
        </mat-error>
        <mat-error *ngIf="hasError('shipmentNumber', 'maxlength')">
          Najviše 20 karaktera.
        </mat-error>
      </mat-form-field>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Cijena dostave</mat-label>
          <input
            matInput
            type="number"
            formControlName="shippingCost"
            step="0.1"
          />
          <span matTextPrefix>KM&nbsp;</span>
          <mat-error *ngIf="hasError('shippingCost', 'required')">
            Cijena je obavezna.
          </mat-error>
          <mat-error *ngIf="hasError('shippingCost', 'min')">
            Cijena mora biti veća od 0.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Narudžba</mat-label>
          <mat-select formControlName="orderId">
            <mat-option *ngFor="let o of orders" [value]="o.id">
              {{ o.referenceNumber }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError('orderId', 'required')">
            Narudžba je obavezna.
          </mat-error>
        </mat-form-field>
      </div>

      <div class="form-actions">
        <button type="button" mat-stroked-button (click)="onCancel()" [disabled]="isLoading">
          <mat-icon>close</mat-icon>
          Odustani
        </button>

        <button
          type="submit"
          mat-raised-button
          color="primary"
          [disabled]="form.invalid || isLoading"
        >
          <mat-icon>save</mat-icon>
          Sačuvaj
        </button>
      </div>
    </form>
  </div>
</div>
```

## 4. Uređivanje — cijeli HTML

Fajl: `src/app/modules/admin/posiljke/posiljka-edit/posiljka-edit.component.html`

Starter ima samo `<p>posiljka-edit works!</p>`. To obrišeš i zalijepiš cijeli blok ispod. Dok ta rečenica stoji na ekranu, ovaj fajl nije zamijenjen. TypeScript može učitati pošiljku, a stranica i dalje pokazuje samo tu rečenicu.

Ovo je gotov HTML dodavanja, sa četiri izmjene:

1. Naslov je `Uredi pošiljku`.
2. Rečenice „Status i datum slanja postavljaju se automatski." nema.
3. Ispod cijene i narudžbe ide padajući spisak Status.
4. Ispod statusa idu dva obična paragrafa, datum slanja i datum dostave, pa rečenica da server sam upiše datum dostave.

Korak po korak, šta se mijenja i zašto Sačuvaj ostane ugašen: Dio 2, **Uređivanje, HTML**.

```html
<div class="container">
  <div class="header-card mat-elevation-z2">
    <h1>Uredi pošiljku</h1>
  </div>

  <div class="form-card mat-elevation-z2">
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="errorMessage" class="error-banner">
        <mat-icon>error</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>

      <div *ngIf="isLoading" class="loading-overlay">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Snimanje...</p>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Broj pošiljke</mat-label>
        <input matInput formControlName="shipmentNumber" maxlength="20" />
        <mat-error *ngIf="hasError('shipmentNumber', 'required')">
          Broj pošiljke je obavezan.
        </mat-error>
        <mat-error *ngIf="hasError('shipmentNumber', 'maxlength')">
          Najviše 20 karaktera.
        </mat-error>
      </mat-form-field>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Cijena dostave</mat-label>
          <input
            matInput
            type="number"
            formControlName="shippingCost"
            step="0.1"
          />
          <span matTextPrefix>KM&nbsp;</span>
          <mat-error *ngIf="hasError('shippingCost', 'required')">
            Cijena je obavezna.
          </mat-error>
          <mat-error *ngIf="hasError('shippingCost', 'min')">
            Cijena mora biti veća od 0.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Narudžba</mat-label>
          <mat-select formControlName="orderId">
            <mat-option *ngFor="let o of orders" [value]="o.id">
              {{ o.referenceNumber }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError('orderId', 'required')">
            Narudžba je obavezna.
          </mat-error>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Status</mat-label>
        <mat-select formControlName="status">
          <mat-option *ngFor="let s of statuses" [value]="s.value">
            {{ s.label }}
          </mat-option>
        </mat-select>
        <mat-error *ngIf="hasError('status', 'required')">
          Status je obavezan.
        </mat-error>
      </mat-form-field>

      <p>Datum slanja: {{ model?.shippedAtUtc | date:'dd.MM.yyyy' }}</p>
      <p>Datum dostave: {{ (model?.deliveredAtUtc | date:'dd.MM.yyyy') || '-' }}</p>

      <p>Ako status postane Dostavljena, datum dostave se postavlja automatski na serveru.</p>

      <div class="form-actions">
        <button type="button" mat-stroked-button (click)="onCancel()" [disabled]="isLoading">
          <mat-icon>close</mat-icon>
          Odustani
        </button>

        <button
          type="submit"
          mat-raised-button
          color="primary"
          [disabled]="form.invalid || isLoading"
        >
          <mat-icon>save</mat-icon>
          Sačuvaj
        </button>
      </div>
    </form>
  </div>
</div>
```

## 5. Dodavanje i uređivanje — cijeli CSS

Dva fajla, **isti sadržaj**:

- `src/app/modules/admin/posiljke/posiljka-add/posiljka-add.component.scss`
- `src/app/modules/admin/posiljke/posiljka-edit/posiljka-edit.component.scss`

Ni jedan ne postoji u starteru. `styleUrl` u komponenti već pokazuje na njih. Dok fajla nema, `ng serve` padne čim otvoriš tu stranicu.

Ne kucaš ovo. Kopiraš cijeli fajl:

`src/app/modules/admin/catalogs/products/products-add/products-add.component.scss`

Ikona u naslovu ostaje korpa (`add_shopping_cart`), jer je fajl od proizvoda. Na ispitu je ostavi. Ne crtaš novi dizajn.

```scss
// Glavne boje - teget paleta #4976b5
$primary-color: #4976b5;
$primary-light: #6b96d1;
$primary-lighter: #e8f0f9;
$primary-dark: #3a5e91;

$secondary-color: #5a8ac9;
$accent-color: #7ba7db;

$bg-gradient-start: #f0f5fb;
$bg-gradient-end: #e3ecf7;

$text-primary: #2c3e50;
$text-secondary: #546e7a;
$text-disabled: #90a4ae;

$success-color: #66bb6a;
$error-color: #ef5350;
$warning-color: #ffa726;

$border-color: rgba(73, 118, 181, 0.15);
$hover-bg: rgba(73, 118, 181, 0.04);

// Container
.container {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(135deg, $bg-gradient-start 0%, $bg-gradient-end 100%);
  min-height: 100vh;
}

// Header Card
.header-card {
  background: white;
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(73, 118, 181, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid $border-color;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(73, 118, 181, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 16px;

    &::before {
      content: '';
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(73, 118, 181, 0.25);
      flex-shrink: 0;
    }

    position: relative;

    &::after {
      content: 'add_shopping_cart';
      font-family: 'Material Icons';
      font-size: 28px;
      color: white;
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

// Form Card
.form-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(73, 118, 181, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid $border-color;
  position: relative;

  form {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .error-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #ffebee;
      border: 1px solid #ef9a9a;
      border-radius: 12px;
      color: #c62828;
      font-weight: 500;
      animation: slideDown 0.3s ease-out;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: $error-color;
      }
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      z-index: 10;
      backdrop-filter: blur(4px);

      mat-spinner {
        ::ng-deep circle {
          stroke: $primary-color;
        }
      }

      p {
        color: $text-secondary;
        font-size: 16px;
        font-weight: 500;
        margin: 0;
      }
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
      min-width: 0;
    }

    .form-row {
      display: flex;
      gap: 16px;
      width: 100%;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    mat-form-field {
      &.mat-mdc-form-field-appearance-outline {
        ::ng-deep {
          .mat-mdc-text-field-wrapper {
            background-color: $primary-lighter;
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .mdc-notched-outline__leading,
          .mdc-notched-outline__notch,
          .mdc-notched-outline__trailing {
            border-color: $border-color !important;
            transition: border-color 0.3s ease;
          }

          &.mat-focused {
            .mat-mdc-text-field-wrapper {
              background-color: white;
              box-shadow: 0 4px 12px rgba(73, 118, 181, 0.12);
            }

            .mdc-notched-outline__leading,
            .mdc-notched-outline__notch,
            .mdc-notched-outline__trailing {
              border-color: $primary-color !important;
              border-width: 2px !important;
            }

            .mat-mdc-floating-label {
              color: $primary-color !important;
            }
          }

          &.mat-form-field-invalid {
            .mdc-notched-outline__leading,
            .mdc-notched-outline__notch,
            .mdc-notched-outline__trailing {
              border-color: $error-color !important;
            }

            .mat-mdc-floating-label {
              color: $error-color !important;
            }
          }

          .mat-mdc-floating-label {
            color: $text-secondary;
            font-weight: 500;
          }

          input,
          textarea {
            color: $text-primary;
            font-size: 15px;

            &::placeholder {
              color: $text-disabled;
            }
          }

          .mat-mdc-select {
            color: $text-primary;
            font-size: 15px;
          }

          .mat-mdc-form-field-error {
            color: $error-color;
            font-size: 12px;
            font-weight: 500;
            margin-top: 4px;
          }

          .mat-mdc-form-field-icon-prefix,
          .mat-mdc-form-field-icon-suffix {
            color: $primary-color;
          }
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid $border-color;

      button {
        min-width: 140px;
        height: 44px;
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: 10px;
        transition: all 0.3s ease;

        mat-icon {
          margin-right: 8px;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &[mat-stroked-button] {
          border: 2px solid $border-color;
          color: $text-secondary;
          background-color: transparent;

          mat-icon {
            color: $text-secondary;
          }

          &:hover:not([disabled]) {
            background-color: $hover-bg;
            border-color: $text-secondary;
            color: $text-primary;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

            mat-icon {
              color: $text-primary;
            }
          }

          &[disabled] {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }

        &[mat-raised-button] {
          background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
          color: white;
          box-shadow: 0 4px 12px rgba($primary-color, 0.3);
          border: none;

          mat-icon {
            color: white;
          }

          &:hover:not([disabled]) {
            background: linear-gradient(135deg, $primary-dark 0%, $primary-color 100%);
            box-shadow: 0 6px 16px rgba($primary-color, 0.4);
            transform: translateY(-2px);
          }

          &[disabled] {
            background: linear-gradient(135deg, lighten($border-color, 5%) 0%, $border-color 100%);
            color: $text-disabled;
            box-shadow: none;
            cursor: not-allowed;
            opacity: 0.6;
          }
        }
      }

      @media (max-width: 480px) {
        flex-direction: column-reverse;

        button {
          width: 100%;
        }
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .header-card {
    padding: 20px;
    border-radius: 12px;

    h1 {
      font-size: 24px;

      &::before {
        width: 40px;
        height: 40px;
      }

      &::after {
        font-size: 24px;
        left: 8px;
      }
    }
  }

  .form-card {
    padding: 24px 20px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .header-card {
    h1 {
      font-size: 20px;

      &::before {
        width: 36px;
        height: 36px;
      }

      &::after {
        font-size: 20px;
        left: 8px;
      }
    }
  }

  .form-card {
    padding: 20px 16px;
  }
}

::ng-deep .mat-mdc-select-panel {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(73, 118, 181, 0.15);
  border: 1px solid $border-color;
  margin-top: 8px;

  .mat-mdc-option {
    padding: 12px 16px;
    transition: all 0.2s ease;

    &:hover {
      background-color: $hover-bg;
    }

    &.mat-mdc-option-active {
      background-color: $primary-lighter;
      color: $primary-color;
      font-weight: 500;
    }

    &.mdc-list-item--selected {
      background-color: $primary-lighter;
      color: $primary-color;
      font-weight: 600;

      &::after {
        content: 'check';
        font-family: 'Material Icons';
        font-size: 20px;
        margin-left: auto;
      }
    }
  }
}
```

---

# Dio 2 — šta je već bilo, šta si ti dodala

## Lista, HTML

Fajl: `posiljke/posiljke.component.html`.

Cijela stranica već stoji u starteru. CSS `posiljke.component.scss` ne otvaraš. U HTML ulaze tačno četiri dopune. Raspored gledaš na listi proizvoda, `catalogs/products/products.component.html`. Tekst koji upisuješ je u tačkama ispod. Gotov fajl poslije izmjena je Dio 1, tačka 1. HTML proizvoda ne lijepiš: tamo je `| translate`, polje za kucanje, a red se zove `product`.

### Šta starter već crta

Tri dijela. Njih ne diraš.

**Kartica naslova.** Plavi kvadrat sa ikonom kamiona `local_shipping`, naslov „Pošiljke", i desno dugme „Nova pošiljka". To dugme već ima `(click)="onCreate()"`. Drugi klik mu ne dodaješ.

**Napomena.** `info-card` sa tekstom „Ovdje raditi ispitni zadatak - prvi modul". U SCSS-u liste nema pravila za `.info-card`. Ostaje kako jeste.

**Tabela od 7 kolona.** Broj pošiljke, narudžba, status, cijena, datum slanja, datum dostave, akcije. Imena kolona (`shipmentNumber`, `orderReferenceNumber`, …) i `colspan="7"` na redu „Nema pošiljki." ostaju.

Bedž statusa ostaje ovakav:

```html
<span class="status-badge status-{{ item.status }}">
  {{ item.statusNaziv }}
</span>
```

`item.status` je broj 1–5 i služi samo imenu klase (`status-4`). Na bedžu se vidi riječ iz `statusNaziv` (`Dostavljena`). Ako ispišeš `status`, na bedžu stoji `4`.

### Izmjena 1 — filter narudžbe

Mjesto: unutar `<div class="actions-container">`, **prije** dugmeta „Nova pošiljka".

Starter:

```html
<div class="actions-container">
  <button mat-raised-button color="primary" (click)="onCreate()">
    <mat-icon>add</mat-icon>
    Nova pošiljka
  </button>
</div>
```

Ti dodaš `mat-form-field` ispred dugmeta. Dugme ostaje.

```html
<div class="actions-container">
  <mat-form-field class="search-field" appearance="fill">
    <mat-label>Narudžba</mat-label>
    <mat-select
      [(ngModel)]="request.orderId"
      (ngModelChange)="onOrderFilterChange()">
      <mat-option [value]="null">Sve narudžbe</mat-option>
      <mat-option *ngFor="let o of orders" [value]="o.id">
        {{ o.referenceNumber }}
      </mat-option>
    </mat-select>
  </mat-form-field>

  <button mat-raised-button color="primary" (click)="onCreate()">
    <mat-icon>add</mat-icon>
    Nova pošiljka
  </button>
</div>
```

| Komad | Šta radi |
|-------|----------|
| `class="search-field"` | širina 280px već stoji u SCSS-u liste. Bez te klase polje nema tu širinu |
| `[(ngModel)]="request.orderId"` | select čita i upisuje id narudžbe |
| `(ngModelChange)="onOrderFilterChange()"` | tek kad je novi id upisan, lista se ponovo učita |
| `[value]="null"` | „Sve narudžbe" — backend dobije listu bez filtera |
| `[value]="o.id"` | šalje se **broj**, ne tekst `ORD-0001` |
| `{{ o.referenceNumber }}` | na ekranu piše `ORD-0001` |

`.actions-container` je već flex. Zato select i dugme stoje u jednom redu. Na uskom ekranu SCSS ih slaže jedno ispod drugog.

Odakle raspored: na listi proizvoda `mat-form-field` klase `search-field` već stoji u istom `actions-container`, pored dugmeta. Taj fajl ne lijepiš. Kod proizvoda je `input` i `| translate`. Kod pošiljke je `mat-select`, i taj blok je ovdje iznad.

### Izmjena 2 — paginator

Mjesto: odmah ispod `</table>`, još **unutra** u `<div class="mat-elevation-z8">`.

Starter završava ovako:

```html
    </table>
  </div>
</div>
```

Ti dodaš jednu liniju:

```html
    </table>

    <app-fit-paginator-bar [vm]="this" />
  </div>
</div>
```

`[vm]="this"` predaje ovu komponentu traci. Traka već postoji u projektu. Ne praviš `mat-paginator` i ne pišeš njen CSS.

Ista linija već stoji na dnu tabele proizvoda. Odavde je uzimaš.

`colspan="7"` na praznom redu ostaje. Sedam kolona se ne mijenja.

### Izmjena 3 — klik na olovku i kantu

Dugme „Nova pošiljka" **već** ima `(click)="onCreate()"`. Tu ne dodaješ drugi klik.

Starter, kolona Akcije:

```html
<button mat-icon-button color="primary" matTooltip="Uredi">
  <mat-icon>edit</mat-icon>
</button>
<button mat-icon-button color="warn" matTooltip="Obriši">
  <mat-icon>delete</mat-icon>
</button>
```

Ti dodaš samo `(click)`:

```html
<button mat-icon-button color="primary" matTooltip="Uredi" (click)="onEdit(item)">
  <mat-icon>edit</mat-icon>
</button>
<button mat-icon-button color="warn" matTooltip="Obriši" (click)="onDelete(item)">
  <mat-icon>delete</mat-icon>
</button>
```

Ime je `item`, jer iznad piše `*matCellDef="let item"`. `onEdit(row)` ne prolazi: `row` postoji samo na `<tr>`.

Na listi proizvoda klik već postoji, `(click)="onEdit(product)"` i `onDelete(product)`. Oblik je isti. Argument je drugačiji, jer se tamo red zove `product`, a ovdje `item`.

### Izmjena 4 — cijena i datumi

Status **ne diraš**. Ostaje:

```html
<span class="status-badge status-{{ item.status }}">
  {{ item.statusNaziv }}
</span>
```

`item.status` je broj 1–5 i služi samo imenu CSS klase (`status-4`). Tekst na bedžu je `statusNaziv` (`Dostavljena`). Ako ispišeš `status`, na bedžu stoji `4`.

Tri ćelije mijenjaš.

Starter:

```html
{{ item.shippingCost }} KM
{{ item.shippedAtUtc }}
{{ item.deliveredAtUtc || '-' }}
```

Poslije:

```html
{{ item.shippingCost | number:'1.1-1' }} KM
{{ item.shippedAtUtc | date:'dd.MM.yyyy' }}
{{ (item.deliveredAtUtc | date:'dd.MM.yyyy') || '-' }}
```

| Pipe | Ekran |
|------|--------|
| `number:'1.1-1'` | jedna decimala. `12.5` postane `12,5 KM` |
| `date:'dd.MM.yyyy'` | `2026-09-21T14:30:00Z` postane `21.09.2026` |
| zagrada oko datuma dostave | ako je datum prazan, vidi se `-` |

`KM` je običan tekst poslije pipe-a.

Zagrada na datumu dostave je obavezna. Bez nje pipe ne sredi vrijednost prije crtice, pa dostavljena pošiljka pokaže ISO string (`2026-09-21T...`).

Odakle pipe: na proizvodima cijena već ide kroz `number`, ali format je `'1.2-2'` (dvije decimale). Pošiljka traži `'1.1-1'`. Datumski pipe na toj listi nema. Ove tri linije kucaš odavde. Inline stil cijene (`font-weight: 600`, boja `#4976b5`) ostaje.

### Šta na listi ostaje netaknuto

- naslov, ikona kamiona, kartica
- napomena „Ovdje raditi ispitni zadatak - prvi modul"
- svih 7 kolona i njihova imena (`shipmentNumber`, `orderReferenceNumber`, …)
- bedž statusa
- `colspan="7"`
- inline stil na broju pošiljke i na cijeni (`font-weight`, boja `#4976b5`)

## Lista, CSS

**Nema izmjene.** Fajl ne kopiraš od proizvoda.

HTML koji si dodala već ima klase u ovom fajlu. Klase za filter i bedž već su u starteru, iako filter u HTML-u još ne stoji.

| Klasa u HTML-u | Šta SCSS već radi |
|----------------|-------------------|
| `.container` | pozadina, padding 24px, max širina 1400px |
| `.header-card`, `.title-section`, `.title-icon` | bijela kartica, plavi kvadrat, ikona kamiona |
| `.actions-container` | filter i dugme u jednom redu, razmak 16px |
| `.search-field` | širina filtera 280px, na telefonu 100% |
| `button[mat-raised-button]` | plavo dugme „Nova pošiljka" |
| `.status-badge` | oblik bedža |
| `.status-1` … `.status-5` | boja: Kreirana, U skladištu, U dostavi, Dostavljena, Otkazana |
| `table` | širina 100% |

Paginatora nema u ovom SCSS-u. On ima svoj fajl. Ne dodaješ mu stil.

Napomena `.info-card` nema pravilo u ovom SCSS-u. Ostavi je u HTML-u. Ne stilizuješ je.

## Dodavanje, HTML

Starter, cijeli fajl:

```html
<p>posiljka-add works!</p>
```

To zamijeniš cijelim fajlom. Nema „malo dopuni".

### Uzor u projektu

Na ispitu otvoriš:

`catalogs/products/products-add/products-add.component.html`

To je cijeli raspored: `container`, naslov, `form-card`, greška, spinner, polje preko cijele širine, red od dva polja, dugmad. `| translate` i polja proizvoda ne ostaju. Kopiraš fajl, pa zamijeniš imena kako je u tabeli ispod.

Uzor, cijeli fajl:

```html
<div class="container">
  <div class="header-card mat-elevation-z2">
    <h1>{{ 'PRODUCTS.ADD.TITLE' | translate }}</h1>
  </div>

  <div class="form-card mat-elevation-z2">
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="errorMessage" class="error-banner">
        <mat-icon>error</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>

      <div *ngIf="isLoading" class="loading-overlay">
        <mat-spinner diameter="50"></mat-spinner>
        <p>{{ 'PRODUCTS.ADD.SAVING' | translate }}</p>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'PRODUCTS.FORM.NAME' | translate }}</mat-label>
        <input matInput formControlName="name" />
        <mat-icon matSuffix>inventory_2</mat-icon>
        <mat-error *ngIf="hasError('name')">
          {{ getErrorMessage('name') }}
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'PRODUCTS.FORM.DESCRIPTION' | translate }}</mat-label>
        <textarea matInput formControlName="description" rows="4"></textarea>
        <mat-icon matSuffix>description</mat-icon>
        <mat-error *ngIf="hasError('description')">
          {{ getErrorMessage('description') }}
        </mat-error>
      </mat-form-field>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>{{ 'PRODUCTS.FORM.PRICE' | translate }}</mat-label>
          <input matInput type="number" formControlName="price" step="0.01" />
          <span matTextPrefix>KM&nbsp;</span>
          <mat-icon matSuffix>payments</mat-icon>
          <mat-error *ngIf="hasError('price')">
            {{ getErrorMessage('price') }}
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>{{ 'PRODUCTS.FORM.CATEGORY' | translate }}</mat-label>
          <mat-select formControlName="categoryId">
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
          <mat-icon matSuffix>category</mat-icon>
          <mat-error *ngIf="hasError('categoryId')">
            {{ getErrorMessage('categoryId') }}
          </mat-error>
        </mat-form-field>
      </div>

      <div class="form-actions">
        <button type="button" mat-stroked-button (click)="onCancel()" [disabled]="isLoading">
          <mat-icon>close</mat-icon>
          {{ 'PRODUCTS.FORM.CANCEL' | translate }}
        </button>
        <button type="submit" mat-raised-button color="primary" [disabled]="form.invalid || isLoading">
          <mat-icon>save</mat-icon>
          {{ 'PRODUCTS.FORM.SAVE' | translate }}
        </button>
      </div>
    </form>
  </div>
</div>
```

| U proizvodima | Kod tebe |
|---------------|----------|
| `PRODUCTS.ADD.TITLE` | tekst `Nova pošiljka` |
| `PRODUCTS.ADD.SAVING` | tekst `Snimanje...` |
| polje `name` | `shipmentNumber`, `maxlength="20"`, dvije greške: `required` i `maxlength` |
| polje `description` (textarea) | brišeš. Na to mjesto ide rečenica `<p>Status i datum slanja postavljaju se automatski.</p>` |
| `price`, `step="0.01"` | `shippingCost`, `step="0.1"`, greške `required` i `min` |
| `categoryId`, `categories`, `category.id`, `category.name` | `orderId`, `orders`, `o.id`, `o.referenceNumber` |
| `hasError('name')` i `getErrorMessage(...)` | `hasError('shipmentNumber', 'required')` i svoj tekst. Isto za ostala polja |
| `mat-icon matSuffix` i `placeholder` | brišeš |
| `PRODUCTS.FORM.CANCEL` / `SAVE` | tekst `Odustani` / `Sačuvaj` |
| `(ngSubmit)="onSubmit()"`, `onCancel()`, `form.invalid \|\| isLoading` | ostaje isto |

`KM&nbsp;` ostaje na cijeni. Opis proizvoda nema par na pošiljci. Status i datumi na dodavanju ne postoje.

Kako treba izgledati `posiljka-add.component.html`:

```html
<div class="container">
  <div class="header-card mat-elevation-z2">
    <h1>Nova pošiljka</h1>
  </div>

  <div class="form-card mat-elevation-z2">
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="errorMessage" class="error-banner">
        <mat-icon>error</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>

      <div *ngIf="isLoading" class="loading-overlay">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Snimanje...</p>
      </div>

      <p>Status i datum slanja postavljaju se automatski.</p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Broj pošiljke</mat-label>
        <input matInput formControlName="shipmentNumber" maxlength="20" />
        <mat-error *ngIf="hasError('shipmentNumber', 'required')">
          Broj pošiljke je obavezan.
        </mat-error>
        <mat-error *ngIf="hasError('shipmentNumber', 'maxlength')">
          Najviše 20 karaktera.
        </mat-error>
      </mat-form-field>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Cijena dostave</mat-label>
          <input matInput type="number" formControlName="shippingCost" step="0.1" />
          <span matTextPrefix>KM&nbsp;</span>
          <mat-error *ngIf="hasError('shippingCost', 'required')">
            Cijena je obavezna.
          </mat-error>
          <mat-error *ngIf="hasError('shippingCost', 'min')">
            Cijena mora biti veća od 0.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Narudžba</mat-label>
          <mat-select formControlName="orderId">
            <mat-option *ngFor="let o of orders" [value]="o.id">
              {{ o.referenceNumber }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError('orderId', 'required')">
            Narudžba je obavezna.
          </mat-error>
        </mat-form-field>
      </div>

      <div class="form-actions">
        <button type="button" mat-stroked-button (click)="onCancel()" [disabled]="isLoading">
          <mat-icon>close</mat-icon>
          Odustani
        </button>

        <button
          type="submit"
          mat-raised-button
          color="primary"
          [disabled]="form.invalid || isLoading"
        >
          <mat-icon>save</mat-icon>
          Sačuvaj
        </button>
      </div>
    </form>
  </div>
</div>
```

Isti fajl je i u Dijelu 1, tačka 3.

Blokovi, odozgo:

| Blok | Klasa | Uloga |
|------|-------|--------|
| Omotač | `container` | pozadina i širina stranice |
| Naslov | `header-card` | kartica, unutra `<h1>Nova pošiljka</h1>` |
| Kartica forme | `form-card` | bijela kartica oko polja |
| Forma | `[formGroup]="form"` | veže polja na `FormGroup` iz TypeScripta |
| Slanje | `(ngSubmit)="onSubmit()"` | zove `onSubmit`, ne `save()` |
| Greška | `error-banner` | vidi se samo ako postoji `errorMessage` |
| Učitavanje | `loading-overlay` | spinner dok traje snimanje |
| Rečenica | običan `<p>` | „Status i datum slanja postavljaju se automatski." To **nije** polje |
| Broj | `full-width` + `formControlName="shipmentNumber"` | jedna kolona, max 20 znakova |
| Red | `form-row` | cijena i narudžba jedna pored druge |
| Cijena | `half-width` + `shippingCost` | broj, prefiks `KM` |
| Narudžba | `half-width` + `orderId` | padajući spisak, vrijednost je `o.id` |
| Dugmad | `form-actions` | Odustani lijevo od Sačuvaj, poravnata desno |

Tri polja, ništa više. Na dodavanju **nema** statusa i **nema** datuma. To upisuje server.

| `formControlName` | Mora se zvati isto kao ključ u `fb.group` |
|-------------------|--------------------------------------------|
| `shipmentNumber` | broj pošiljke |
| `shippingCost` | cijena |
| `orderId` | narudžba |

Dugmad:

| Dugme | `type` | Klik |
|-------|--------|------|
| Odustani | `button` | `(click)="onCancel()"`. Da je `submit`, klik bi pokušao snimanje |
| Sačuvaj | `submit` | ide kroz `(ngSubmit)`, dakle `onSubmit()` |

`[disabled]="form.invalid || isLoading"` drži Sačuvaj ugašen dok je polje prazno ili dok traje snimanje.

`hasError('shipmentNumber', 'required')` pokaže tekst greške tek kad je polje dirnuto. Ključ za `maxLength` je `maxlength`, malim slovima. Ključ za `min` je `min`.

`step="0.1"` je korak strelice na cijeni. Jedna decimala.

`[value]="o.id"` na narudžbi je broj. Tekst koji korisnik vidi je `{{ o.referenceNumber }}`.

## Dodavanje, CSS

Fajl **ne postoji**. To je jedina „izmjena": napraviš ga kao kopiju.

Kopiraj:

`products-add/products-add.component.scss`

u:

`posiljka-add/posiljka-add.component.scss`

Unutra ne mijenjaš ništa. HTML iz tačke 3 traži ove klase, i sve su već u kopiji:

| Klasa | Šta radi |
|-------|----------|
| `.container` | stranica, max širina 900px |
| `.header-card` | kartica naslova + ikona korpe preko `::after` |
| `.form-card` | bijela kartica |
| `.full-width` | polje preko cijele širine |
| `.half-width` | polje uzme pola reda |
| `.form-row` | cijena i narudžba u jednom redu; ispod 768px idu jedno ispod drugog |
| `.form-actions` | Odustani i Sačuvaj desno |
| `.error-banner` | crvena traka |
| `.loading-overlay` | bijeli sloj sa spinnerom preko forme |

## Uređivanje, HTML

Starter, cijeli fajl:

```html
<p>posiljka-edit works!</p>
```

To zamijeniš cijelim fajlom. Nema „malo dopuni". Ako na `/admin/posiljke/5/edit` još piše `posiljka-edit works!`, HTML nije zalijepljen. `loadData` u TypeScriptu može raditi, a ekran i dalje pokazuje samo tu rečenicu.

Ne otvaraš `products-edit.component.html` da ga preimenuješ. Tamo nema statusa ni datuma, a ima `| translate`, naziv, opis i kategoriju. Kreneš od **svog** gotovog `posiljka-add.component.html` i uradiš izmjene iz tabele.

| Na dodavanju | Na uređivanju |
|--------------|----------------|
| naslov „Nova pošiljka" | naslov „Uredi pošiljku" |
| rečenica „Status i datum slanja postavljaju se automatski." | tu rečenicu **brišeš** |
| nema statusa | novi padajući spisak, `formControlName="status"` |
| nema datuma | dva `<p>`, nisu inputi |
| — | rečenica da server sam upiše datum dostave kad status postane Dostavljena |
| broj, cijena, narudžba, Odustani, Sačuvaj | ostaju isti, ista imena kontrola |

Kako treba izgledati `posiljka-edit.component.html`. Ovo je cijeli fajl. Isti je i u Dijelu 1, tačka 4.

```html
<div class="container">
  <div class="header-card mat-elevation-z2">
    <h1>Uredi pošiljku</h1>
  </div>

  <div class="form-card mat-elevation-z2">
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="errorMessage" class="error-banner">
        <mat-icon>error</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>

      <div *ngIf="isLoading" class="loading-overlay">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Snimanje...</p>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Broj pošiljke</mat-label>
        <input matInput formControlName="shipmentNumber" maxlength="20" />
        <mat-error *ngIf="hasError('shipmentNumber', 'required')">
          Broj pošiljke je obavezan.
        </mat-error>
        <mat-error *ngIf="hasError('shipmentNumber', 'maxlength')">
          Najviše 20 karaktera.
        </mat-error>
      </mat-form-field>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Cijena dostave</mat-label>
          <input
            matInput
            type="number"
            formControlName="shippingCost"
            step="0.1"
          />
          <span matTextPrefix>KM&nbsp;</span>
          <mat-error *ngIf="hasError('shippingCost', 'required')">
            Cijena je obavezna.
          </mat-error>
          <mat-error *ngIf="hasError('shippingCost', 'min')">
            Cijena mora biti veća od 0.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Narudžba</mat-label>
          <mat-select formControlName="orderId">
            <mat-option *ngFor="let o of orders" [value]="o.id">
              {{ o.referenceNumber }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError('orderId', 'required')">
            Narudžba je obavezna.
          </mat-error>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Status</mat-label>
        <mat-select formControlName="status">
          <mat-option *ngFor="let s of statuses" [value]="s.value">
            {{ s.label }}
          </mat-option>
        </mat-select>
        <mat-error *ngIf="hasError('status', 'required')">
          Status je obavezan.
        </mat-error>
      </mat-form-field>

      <p>Datum slanja: {{ model?.shippedAtUtc | date:'dd.MM.yyyy' }}</p>
      <p>Datum dostave: {{ (model?.deliveredAtUtc | date:'dd.MM.yyyy') || '-' }}</p>

      <p>Ako status postane Dostavljena, datum dostave se postavlja automatski na serveru.</p>

      <div class="form-actions">
        <button type="button" mat-stroked-button (click)="onCancel()" [disabled]="isLoading">
          <mat-icon>close</mat-icon>
          Odustani
        </button>

        <button
          type="submit"
          mat-raised-button
          color="primary"
          [disabled]="form.invalid || isLoading"
        >
          <mat-icon>save</mat-icon>
          Sačuvaj
        </button>
      </div>
    </form>
  </div>
</div>
```

Blokovi, odozgo:

| Blok | Klasa ili veza | Uloga |
|------|----------------|--------|
| Omotač | `container` | pozadina i širina stranice. SCSS je kopija add forme |
| Naslov | `header-card` | kartica, unutra `Uredi pošiljku` |
| Kartica forme | `form-card` | bijela kartica oko polja |
| Forma | `[formGroup]="form"` | veže polja na `FormGroup` iz TypeScripta |
| Slanje | `(ngSubmit)="onSubmit()"` | zove `onSubmit`, ne `save()`. Baza tek onda zove `save()` |
| Greška | `error-banner` | vidi se samo ako postoji `errorMessage` |
| Učitavanje | `loading-overlay` | spinner dok traje učitavanje ili snimanje |
| Broj | `full-width` + `shipmentNumber` | jedna kolona, max 20 znakova |
| Red | `form-row` | cijena i narudžba jedna pored druge |
| Cijena | `half-width` + `shippingCost` | broj, prefiks `KM` |
| Narudžba | `half-width` + `orderId` | padajući spisak, vrijednost je `o.id`, tekst je `o.referenceNumber` |
| Status | `full-width` + `status` | padajući spisak, vrijednost je broj `s.value` |
| Datumi | običan `<p>` | čitaju `model`, nisu kontrole forme |
| Info | običan `<p>` | „Ako status postane Dostavljena…" To **nije** polje |
| Dugmad | `form-actions` | Odustani lijevo od Sačuvaj, poravnata desno |

Četiri kontrole. Ime u HTML-u mora biti isto slovo po slovo kao ključ u `fb.group`. Angular ne izjednačava `ShippingCost` i `shippingCost`.

| `formControlName` | Ključ u `fb.group` | Šta korisnik mijenja |
|-------------------|--------------------|----------------------|
| `shipmentNumber` | `shipmentNumber` | broj pošiljke |
| `shippingCost` | `shippingCost` | cijena |
| `orderId` | `orderId` | narudžba |
| `status` | `status` | status |

`hasError` gleda isti naziv. Druga riječ je tip greške, malim slovima:

| Polje | Greška | Poziv |
|-------|--------|-------|
| broj | prazno | `hasError('shipmentNumber', 'required')` |
| broj | predugo | `hasError('shipmentNumber', 'maxlength')` |
| cijena | prazna | `hasError('shippingCost', 'required')` |
| cijena | nula ili manje | `hasError('shippingCost', 'min')` |
| narudžba | nije izabrana | `hasError('orderId', 'required')` |
| status | nije izabran | `hasError('status', 'required')` |

`hasError('shipmentNumber', 'maxlength(20)')` ne pokaže ništa. Ključ je `maxlength`. `hasError('ShippingCost', ...)` i `hasError('categoryId', ...)` gledaju kontrole kojih nema. Na uređivanju kategorija ne postoji.

Dugmad:

| Dugme | `type` | Klik |
|-------|--------|------|
| Odustani | `button` | `(click)="onCancel()"`. Da je `submit`, klik bi pokušao snimanje |
| Sačuvaj | `submit` | ide kroz `(ngSubmit)`, dakle `onSubmit()` |

`[disabled]="form.invalid || isLoading"` drži Sačuvaj ugašen dok je bilo koje od četiri polja prazno ili dok traje snimanje. Klik se tada uopšte ne desi. Nema toasta i nema `PUT`.

### Status

Cijeli novi blok, ide ispod reda sa cijenom i narudžbom:

```html
<mat-form-field appearance="outline" class="full-width">
  <mat-label>Status</mat-label>
  <mat-select formControlName="status">
    <mat-option *ngFor="let s of statuses" [value]="s.value">
      {{ s.label }}
    </mat-option>
  </mat-select>
  <mat-error *ngIf="hasError('status', 'required')">
    Status je obavezan.
  </mat-error>
</mat-form-field>
```

HTML čita niz `statuses` sa komponente. Ako niza nema, spisak je prazan. U klasu, ispod `orders`, ide ovo. `OrderShipmentStatusType` je već uvezen. Cijeli niz je i u `RS1_Modul1_Vodic.md`, faza I3.

```ts
statuses = [
  { value: OrderShipmentStatusType.Kreirana, label: 'Kreirana' },
  { value: OrderShipmentStatusType.USkladistu, label: 'U skladištu' },
  { value: OrderShipmentStatusType.UDostavi, label: 'U dostavi' },
  { value: OrderShipmentStatusType.Dostavljena, label: 'Dostavljena' },
  { value: OrderShipmentStatusType.Otkazana, label: 'Otkazana' }
];
```

| `value` koji se šalje | Broj | `label` na ekranu |
|-----------------------|------|-------------------|
| `OrderShipmentStatusType.Kreirana` | 1 | Kreirana |
| `OrderShipmentStatusType.USkladistu` | 2 | U skladištu |
| `OrderShipmentStatusType.UDostavi` | 3 | U dostavi |
| `OrderShipmentStatusType.Dostavljena` | 4 | Dostavljena |
| `OrderShipmentStatusType.Otkazana` | 5 | Otkazana |

`[value]="s.value"` šalje broj `1`…`5`. `[value]="s.label"` šalje tekst `"Dostavljena"`. Backend očekuje broj. Tekst padne na 400.

`{{ s.label }}` je samo riječ koju korisnik vidi. U `patchValue` ide `status: shipment.status`, broj sa GET-a. Select sam nađe opciju sa istim brojem i pokaže njen label.

### Datumi

Cijela dva reda. Nisu polja. Nema `formControlName`, nema `mat-form-field`.

```html
<p>Datum slanja: {{ model?.shippedAtUtc | date:'dd.MM.yyyy' }}</p>
<p>Datum dostave: {{ (model?.deliveredAtUtc | date:'dd.MM.yyyy') || '-' }}</p>

<p>Ako status postane Dostavljena, datum dostave se postavlja automatski na serveru.</p>
```

`model` je objekat sa `getById`. `patchValue` u njega ne dira datume: oni nisu u `fb.group`, pa nisu ni u `form.value`, pa ih `save` ne šalje.

`model?.` jer je `model` prazan dok `forkJoin` ne završi. `date:'dd.MM.yyyy'` je isti pipe kao na listi. Zagrada oko datuma dostave i `|| '-'` rade isto kao na listi: `null` postane crta, postojeći datum postane `13.10.2026`, ne ISO string.

Dok stojiš na formi i u selectu odabereš Dostavljena, crta na ekranu ostane. `<p>` i dalje čita stari `model` sa GET-a. Novi datum vidiš na listi, nakon snimanja. Server ga upiše. Forma ga ne računa.

Ne pravi disabled input za datum. Isključena kontrola ispadne iz `form.value`, a `getRawValue()` bi je vratio u JSON. `UpdateOrderShipmentCommand` nema `shippedAtUtc` ni `deliveredAtUtc`.

### Zašto Sačuvaj ne reaguje

Dugme je ugašeno čim je `form.invalid`. Najčešće je jedno ime pogrešno, pa se vrijednost nikad ne upiše u kontrolu, a `Validators.required` drži tu kontrolu praznom.

| U HTML-u | Posljedica |
|----------|------------|
| `formControlName="ShippingCost"` | kontrole `shippingCost` nema u vezi. Cijena ostane `null`. Sačuvaj je ugašen |
| `formControlName="categoryId"` | to je polje proizvoda. Ovdje je `orderId` |
| `hasError('maxlength(20)')` | greška se ne prikaže. Ključ je `maxlength` |
| nema niza `statuses` | status spisak je prazan |
| `[value]="s.label"` | snimanje pošalje tekst i backend vrati 400 |

Cijena u HTML-u se zove `shippingCost`. To ime ostaje, jer `update` šalje `shippingCost`. GET po id-u u ovom API-ju vraća `shippingPrice` (`ShippingPrice` na DTO-u). Sučelje u TypeScriptu to polje često zove `shippingCost`, pa `shipment.shippingCost` u kodu postoji, a u JSON-u ga nema. Input cijene ostane prazan i Sačuvaj opet ostane ugašen.

Cijeli `patchValue`:

```ts
const cijena =
  (shipment as { shippingPrice?: number }).shippingPrice ?? shipment.shippingCost;

this.form.patchValue({
  shipmentNumber: shipment.shipmentNumber,
  shippingCost: cijena,
  status: shipment.status,
  orderId: shipment.orderId
});
```

`orderId` sa GET-a jeste `orderId`. Njega ne preimenuješ. `status` je broj `1`…`5`, ne riječ `Kreirana`.

## Uređivanje, CSS

Isti postupak kao dodavanje. Kopiraj **isti** `products-add.component.scss` u:

`posiljka-edit/posiljka-edit.component.scss`

Ako si add SCSS već kopirala, možeš kopirati taj fajl u edit. Sadržaj je isti.

Ne mijenjaš ikonu korpe u `edit`. Na ispitu ostaje.

---

## Redoslijed na ispitu

1. Listu CSS ne otvaraj radi pisanja.
2. U `posiljke.component.html` uradi četiri izmjene iz dijela 2.
3. Kopiraj `products-add.component.scss` u `posiljka-add.component.scss`.
4. Zamijeni `posiljka-add.component.html` cijelim kodom iz dijela 1.
5. Kopiraj isti SCSS u `posiljka-edit.component.scss`.
6. Zamijeni `posiljka-edit.component.html` cijelim kodom iz dijela 1.

Metode koje HTML zove (`onCreate`, `onEdit`, `onDelete`, `onOrderFilterChange`, `onSubmit`, `onCancel`, `orders`, `form`, `statuses`, `model`) pišeš u `.ts` fajlovima. One su u `RS1_Modul1_Vodic.md`, faze G, H i I. Bez njih šablon ne zna šta da učita, ali sam HTML izgleda kao u dijelu 1.
