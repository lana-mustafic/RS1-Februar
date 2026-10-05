# RS1 — Modul 1 — Kompletni vodič (februarski ispit)

> **Cilj ovog dokumenta:** Da razumiješ *logiku* rješavanja, a ne da slijepo kopiraš gotov kod.
> **Pravilo:** Prvo čitaj, razumij, zatim sama piši. Koristi postojeće primjere u **ovom** projektu kao „udžbenik", ne kao rješenje.

---

## Sadržaj

1. [Uvod — šta je Modul 1?](#1-uvod--šta-je-modul-1)
2. [Šta ovaj vodič NIJE](#2-šta-ovaj-vodič-nije)
3. [Priprema okruženja na ispitu](#3-priprema-okruženja-na-ispitu)
4. [Šta starter već ima, a šta ti moraš napraviti](#4-šta-starter-već-ima-a-šta-ti-moraš-napraviti)
5. [Kako je organizovan projekat](#5-kako-je-organizovan-projekat)
6. [Mapa pojmova](#6-mapa-pojmova)
7. [Kako čitati zadatak](#7-kako-čitati-zadatak)
8. [Opšta strategija](#8-opšta-strategija)
9. [Backend — korak po korak](#9-backend--korak-po-korak)
10. [Frontend — korak po korak](#10-frontend--korak-po-korak)
11. [Vizuelni tok rješenja](#11-vizuelni-tok-rješenja)
12. [Kako testirati](#12-kako-testirati)
13. [Najčešće greške i debug](#13-najčešće-greške-i-debug)
14. [Završna checklista prije predaje](#14-završna-checklist-prije-predaje)
15. [Kako razmišljati na ispitu](#15-kako-razmišljati-na-ispitu)
16. [Rečnik pojmova](#16-rečnik-pojmova)

---

## 1. Uvod — šta je Modul 1?

Na **februarskom** ispitu iz Razvoja softvera I, **Modul 1** je administratorski **CRUD za pošiljke**.

U starter projektu to je eksplicitno označeno:

- Sidebar: **„Pošiljke (Modul 1)"** → ruta `/admin/posiljke`
- Na listi piše: **„Ovdje raditi ispitni zadatak - prvi modul"**

**CRUD** znači:

| Slovo | Operacija | Šta korisnik radi |
|-------|-----------|-------------------|
| **C**reate | Dodavanje | Klikne „Nova pošiljka", popuni formu, sačuva |
| **R**ead | Čitanje | Vidi tabelu pošiljki + učita jednu pošiljku za edit |
| **U**pdate | Izmjena | Klikne olovku, mijenja podatke (uključujući status) |
| **D**elete | Brisanje | Klikne kantu, potvrdi u modalu, zapis nestane s liste |

Radiš **dva sloja iste funkcionalnosti**:

| Sloj | Tehnologija | Gdje pišeš |
|------|-------------|------------|
| **Backend** | .NET Web API + CQRS | Visual Studio, solution `rs1_backend-2026-02-16.sln` |
| **Frontend** | Angular + Reactive Forms | VS Code / Cursor, folder `rs1-frontend-2025-26` |

**U ovom projektu nema Windows Forms.** Umjesto `DataGridView` koristiš `mat-table`, umjesto `ComboBox` koristiš `mat-select`. Logika je ista, samo su drugi nazivi.

### Entitet koji radiš

Radiš entitet **`OrderShipmentEntity`** (pošiljka vezana za narudžbu).

Polja koja već postoje u bazi / klasi:

| Polje | Tip | Šta znači |
|-------|-----|-----------|
| `ShipmentNumber` | `string` | Broj pošiljke, npr. `SHP-00001`. Max **20** karaktera. |
| `Status` | enum `OrderShipmentStatusType` | Stanje pošiljke |
| `ShippingCost` | `decimal` | Cijena dostave |
| `OrderId` | `int` | Strani ključ na narudžbu |
| `Order` | navigacija | Veza na `OrderEntity` — iz nje čitaš `ReferenceNumber` (npr. `ORD-0001`) |
| `ShippedAtUtc` | `DateTime` | Datum slanja |
| `DeliveredAtUtc` | `DateTime?` | Datum dostave; prazan dok pošiljka nije dostavljena |

Iz `BaseEntity` već dobijaš: `Id`, `IsDeleted`, `CreatedAtUtc`, `ModifiedAtUtc`. **Ne pišeš ih ponovo.**

### Statusi (`OrderShipmentStatusType`)

| Vrijednost | Broj | Tekst za korisnika |
|------------|------|--------------------|
| `Kreirana` | 1 | Kreirana |
| `USkladistu` | 2 | U skladištu |
| `UDostavi` | 3 | U dostavi |
| `Dostavljena` | 4 | Dostavljena |
| `Otkazana` | 5 | Otkazana |

CSS u starteru već ima klase `status-1` … `status-5`. Zato status na listi treba ostati **broj**, a pored njega pošalješ i čitljiv naziv.

### Poslovna pravila koja profesor traži

Ovo su pravila iz zadatka za **ovaj** ispit — zapamti ih, jer se ne vide samo iz entiteta:

1. **Lista** ima paginaciju i **filter po narudžbi** (dropdown „Sve narudžbe" + pojedinačne narudžbe).
2. **Dodavanje:** korisnik unosi broj pošiljke, cijenu dostave i narudžbu. **Status se automatski postavlja na `Kreirana`.** **Datum slanja se automatski postavlja na današnji datum.** Datum dostave ostaje prazan.
3. **Uređivanje:** korisnik može mijenjati i **status**. Ako status postane **`Dostavljena`**, sistem automatski postavlja datum dostave.
4. **Brisanje:** confirmation modal („Da li ste sigurni?"), zatim brisanje, toast i osvježavanje liste.
5. **Validacija i na backendu i na frontendu.**
6. **Reactive Forms** za add/edit.
7. **Toast** za uspjeh i grešku.
8. Cijena dostave na prikazu: **jedna decimala**.
9. Datum na listi: format **`dd.MM.yyyy`**.

### Obavezni obrasci (crveni okvir na ispitu)

- Backend: **CQRS** (Command / Query / Handler / Validator)
- Frontend: **Reactive Forms**
- **Toast** na akcijama
- **Paginacija** na listi
- **Modal** prije brisanja
- `dialogHelper` je dozvoljen
- Ne troši vrijeme na dizajn — HTML/CSS za listu već postoji

---

## 2. Šta ovaj vodič NIJE

Ovo je važno da ne izgubiš sate na ispitu.

### Ovo NIJE januarski ispit

Januarski ispit je bio **Dostavljač** (novi entitet, novi enum, migracija od nule).

U februarskom starteru **postoji leftover komponenta**:

`rs1-frontend-2025-26/src/app/modules/admin/catalogs/dostavljaci/`

Na njoj piše ista rečenica „Ovdje raditi ispitni zadatak - prvi modul", ali:

- **nije** u sidebaru
- **nije** u rutama
- **nije** februarski zadatak

**Ne radi Dostavljače.** Radi **Pošiljke**.

### Ovo NIJE Modul 2

Sidebar ima i **„Uplata (Modul 2)"**. To je drugi modul (master-detail uplate). **Ne radi ga u ovom vodiču.**

### Šta NE smiješ izmišljati

Ako to **ne piše** u februarskom zadatku i **nema** to u starteru za pošiljke, ne radi:

- novi entitet / novi enum / nova migracija za pošiljke (već postoje)
- jedinstveni kod, tip dostavljača, polje „Aktivan"
- FormArray / linije uplate
- cache (`ICatalogCacheVersionService`) — to je za katalog proizvoda
- „samo admin smije brisati" — to postoji u `DeleteProductCommandHandler`, ali **nije** zahtjev za pošiljke
- novi Repository sloj — ovaj projekat ga nema

---

## 3. Priprema okruženja na ispitu

### 3.1. Koji alati trebaju biti otvoreni?

| Alat | Za šta |
|------|--------|
| **Visual Studio 2022** | Backend (`rs1_backend-2026-02-16.sln`) |
| **VS Code / Cursor** | Frontend (`rs1-frontend-2025-26`) |
| **SSMS** | Baza (provjera podataka) |
| **Browser** | Angular app + Swagger |

### 3.2. Baza i connection string

Otvori:

`rs1_backend-2025-26/Market.API/appsettings.json`

Trenutno izgleda ovako (bitan je `ConnectionStrings:Main`):

```
Server=10.10.10.18,1433;Database=_broj_indeksa2026-02-16c;...
```

**Šta uraditi:**

1. U SSMS-u kreiraj bazu imenom **svog indeksa** (kako profesor kaže na ispitu).
2. U `appsettings.json` zamijeni `Database=_broj_indeksa2026-02-16c` **svojim** imenom baze.
3. Server, user `sa` i lozinka `test` ostaju kako piše u fajlu, osim ako profesor ne kaže drugačije.

Kad pokreneš API, projekat **sam** radi migracije i seed. Seed već ubacuje **12 pošiljki** (`SHP-00001` … `SHP-00012`). To ti treba za test liste.

### 3.3. Portovi

| Šta | Adresa |
|-----|--------|
| Backend API + Swagger | `http://localhost:7001` (vidi `launchSettings.json`) |
| Frontend | `http://localhost:4200` |
| Frontend zove API | `environment.ts` → `apiUrl: 'http://localhost:7001'` |

### 3.4. Redoslijed pokretanja

1. **Prvo backend** — u Visual Studiju pokreni `Market.API` (profil `http`). Treba se otvoriti Swagger.
2. **Zatim frontend** — u folderu `rs1-frontend-2025-26`:
   - ako `npm` ne radi u PowerShellu, ukucaj `cmd` pa Enter, zatim:
   - `npm install`
   - `npm start` ili `npx ng serve`
3. Uloguj se u admin panel (staff nalog).

### 3.5. Nalozi za test (iz seeda)

Write endpointi u projektu koriste policy **`Staff`** (Admin, Manager, Employee). Fallback policy zahtijeva prijavljenog korisnika.

| Email | Lozinka | Uloga |
|-------|---------|-------|
| `admin@market.local` | `Admin123!` | Admin |
| `manager@market.local` | `Manager123!` | Manager |
| `employee@market.local` | `Employee123!` | Employee |
| `string` | `string` | Employee — zgodno za Swagger |

Za Swagger: klikni **Authorize**, pa `POST /Auth/login`, pa ubaci token.

### 3.6. NPM / Angular CLI u učionici

Ako PowerShell blokira skripte:

```
cmd
npm install
npm start
```

Ako `ng` nije prepoznat, koristi `npx ng ...`.

---

## 4. Šta starter već ima, a šta ti moraš napraviti

Ovo je najvažnija tabla u cijelom vodiču. **Ne radi stvari koje već postoje.**

### Već postoji — NE kreiraš iz nule

| Šta | Gdje |
|-----|------|
| Entitet `OrderShipmentEntity` | `Market.Domain/Entities/Sales/OrderShipmentEntity.cs` |
| Enum `OrderShipmentStatusType` | `Market.Domain/Entities/Sales/OrderShipmentStatusType.cs` |
| `DbSet<OrderShipmentEntity> OrderShipments` | `DatabaseContext.cs` i `IAppDbContext.cs` |
| EF konfiguracija (tabela, max length, FK) | `OrderShipmentConfiguration.cs` |
| Migracija tabele `OrderShipments` | `Market.Infrastructure/Migrations/` |
| Seed 12 pošiljki | `DynamicDataSeeder.cs` → `SeedOrderShipmentsAsync` |
| Stavka u sidebaru | `admin-layout.component.html` |
| Rute `posiljke`, `posiljke/add`, `posiljke/:id/edit` | `admin-routing-module.ts` |
| Komponente registrovane u `AdminModule` | `admin-module.ts` |
| Prazna lista s hardkodiranim redovima i gotovom tabelom | `posiljke.component.*` |
| Prazan add | `posiljka-add.component.ts/html` — HTML kaže `posiljka-add works!` |
| Prazan edit | `posiljka-edit.component.ts/html` — HTML kaže `posiljka-edit works!` |
| CSS za status badge-ove i search polje | `posiljke.component.scss` |
| API za narudžbe (za dropdown) | `OrdersApiService` već postoji |

### Ti moraš napraviti

**Backend**

- CQRS folder `Market.Application/Modules/Sales/OrderShipments/`
- List, GetById, Create, Update, Delete (Query/Command + Handler + Validator gdje treba + DTO)
- `OrderShipmentsController`

**Frontend**

- `src/app/api-services/order-shipments/` (models + service)
- Logika liste: ukloni hardkod, poveži API, paginacija, filter, delete
- Add forma (HTML + TS + SCSS — SCSS fajl u starteru **ne postoji**, iako ga `styleUrl` već referencira)
- Edit forma (isto)

### Šta je namjerno „pokvareno" / prazno

Starter ti ostavlja tragove šta tabela očekuje. U `posiljke.component.ts` stoji:

```ts
// hardkodirano - obrisati ovo
items = [ { shipmentNumber, orderReferenceNumber, status, statusNaziv, shippingCost, shippedAtUtc, deliveredAtUtc }, ... ]
```

To je **hint za oblik DTO-a**, ne podaci koje ostavljaš. Moraš to zamijeniti API-jem.

---

## 5. Kako je organizovan projekat

### 5.1. Dva odvojena projekta

```
2026-02-16/
├── rs1_backend-2025-26/     ← Visual Studio solution
└── rs1-frontend-2025-26/    ← Angular aplikacija
```

### 5.2. Backend slojevi

| Projekt | Uloga | Šta diraš na Modulu 1 |
|---------|-------|------------------------|
| **Market.Domain** | Entiteti, enumi | **Samo čitaš** `OrderShipmentEntity` i enum. Ne mijenjaš. |
| **Market.Application** | CQRS | **Ovdje pišeš** novi modul |
| **Market.Infrastructure** | Baza, EF, seed | **Ne diraš** (već ima config, DbSet, migraciju, seed) |
| **Market.API** | Kontroleri | **Pišeš** `OrderShipmentsController` |
| **Market.Shared** | Opcije, ErrorDto | Rijetko diraš |

**Nema klasičnog Repository-ja.** Handler koristi `IAppDbContext` — to je veza s bazom.

MediatR i FluentValidation se **automatski registruju** iz Application assembly-ja (`DependencyInjection.cs`). Kad napraviš Handler i Validator, **ne dodaješ ih ručno u DI**.

### 5.3. Frontend struktura

| Folder | Uloga |
|--------|-------|
| `src/app/api-services/` | Tanki HTTP servisi, 1:1 s kontrolerom. **Ovdje kreiraš** `order-shipments/` |
| `src/app/modules/admin/posiljke/` | Tvoje komponente za Modul 1 |
| `src/app/modules/admin/catalogs/products/` | **Najbolji uzor** za CRUD |
| `src/app/core/components/base-classes/` | `BaseListPagedComponent`, `BaseFormComponent` |
| `src/app/core/services/toaster.service.ts` | Toast |
| `src/app/modules/shared/services/dialog-helper.service.ts` | Modal |
| `src/app/modules/shared/components/fit-paginator-bar/` | Paginacija UI |

### 5.4. Gdje šta tražiti — brza mapa

| Šta tražiš | Putanja |
|------------|---------|
| Entitet pošiljke | `Market.Domain/Entities/Sales/OrderShipmentEntity.cs` |
| Enum statusa | `Market.Domain/Entities/Sales/OrderShipmentStatusType.cs` |
| Entitet narudžbe (`ReferenceNumber`) | `Market.Domain/Entities/Sales/OrderEntity.cs` |
| `IAppDbContext` | `Market.Application/Abstractions/IAppDbContext.cs` |
| Uzor CQRS liste | `Market.Application/Modules/Catalog/Products/Queries/List/` |
| Uzor Create | `.../Products/Commands/Create/` |
| Uzor Update | `.../Products/Commands/Update/` |
| Uzor Delete | `.../Products/Commands/Delete/` |
| Uzor GetById | `.../Products/Queries/GetById/` |
| Uzor kontrolera | `Market.API/Controllers/ProductsController.cs` |
| Paginacija backend | `Market.Application/Common/BasePagedQuery.cs`, `PageResult.cs` |
| Tvoj novi CQRS | `Market.Application/Modules/Sales/OrderShipments/` ← **kreiraš** |
| Tvoj kontroler | `Market.API/Controllers/OrderShipmentsController.cs` ← **kreiraš** |
| Lista UI | `src/app/modules/admin/posiljke/posiljke.component.*` |
| Add UI | `.../posiljke/posiljka-add/` |
| Edit UI | `.../posiljke/posiljka-edit/` |
| Uzor API servisa | `src/app/api-services/products/` |
| Pravila API servisa | `src/app/api-services/readme.md` |
| Uzor liste | `.../catalogs/products/products.component.ts` |
| Uzor forme | `.../products-add/`, `product-form.service.ts` |
| Narudžbe za dropdown | `src/app/api-services/orders/orders-api.service.ts` |

### 5.5. Referentni primjer — kopiraj OBRASAC, ne sadržaj

Prije nego napišeš ijedan fajl za pošiljke, otvori **Products** i skiciraj strukturu:

```
Market.Application/Modules/Catalog/Products/
├── Commands/
│   ├── Create/   CreateProductCommand.cs
│   │             CreateProductCommandHandler.cs
│   │             CreateProductCommandValidator.cs
│   ├── Update/   UpdateProductCommand.cs
│   │             UpdateProductCommandHandler.cs
│   │             UpdateProductCommandValidator.cs
│   └── Delete/   DeleteProductCommand.cs
│                 DeleteProductCommandHandler.cs
└── Queries/
    ├── List/     ListProductsQuery.cs
    │             ListProductsQueryDto.cs
    │             ListProductsQueryHandler.cs
    └── GetById/  GetProductByIdQuery.cs
                  GetProductByIdQueryDto.cs
                  GetProductByIdQueryHandler.cs
```

Tvoja kopija strukture:

```
Market.Application/Modules/Sales/OrderShipments/
├── Commands/Create|Update|Delete
└── Queries/List|GetById
```

Imena mijenjaš (`Product` → `OrderShipment`), polja mijenjaš prema entitetu, **cache i admin-only logiku ne kopiraš**.

---

## 6. Mapa pojmova

Ako si na vježbama čula WinForms pojmove:

| Pojam s vježbi | U OVOM projektu |
|----------------|-----------------|
| Model | `OrderShipmentEntity` |
| Forma | Angular komponenta `posiljka-add` / `posiljka-edit` |
| DataGridView | `mat-table` |
| ComboBox | `mat-select` + `mat-option` |
| Data Binding | `{{ item.shipmentNumber }}`, `formControlName`, `[(ngModel)]` za filter |
| Repository | **Nema** — `IAppDbContext` u Handleru |
| Event Handler | metoda u `.ts`, npr. `(click)="onDelete(item)"` |
| MessageBox | `ToasterService` + `DialogHelperService` |
| Validacija forme | Angular `Validators` |
| Validacija servera | FluentValidation `*Validator.cs` |

---

## 7. Kako čitati zadatak

### 7.1. Prva tri pitanja

1. **Koji entitet?** → `OrderShipmentEntity` / Pošiljka
2. **Koje operacije?** → CRUD + paginacija + filter po narudžbi
3. **Šta je automatsko?** → status `Kreirana`, datum slanja, datum dostave kad je status `Dostavljena`

### 7.2. Ključne riječi

| Riječ u zadatku | Šta znači za tebe |
|-----------------|-------------------|
| CRUD | List, GetById, Create, Update, Delete |
| CQRS | Odvojeni Query (čitanje) i Command (pisanje) |
| Reactive Forms | `FormGroup`, `formControlName`, `Validators` |
| paginacija | `BasePagedQuery` / `PageResult` + `BaseListPagedComponent` + `app-fit-paginator-bar` |
| toast | `ToasterService.success()` / `.error()` |
| dialogHelper / modal | `DialogHelperService.confirmDelete(...)` |
| validacija backend i frontend | Validator klasa + Angular Validators |
| filter / pretraga po narudžbi | `OrderId` na List Query + `mat-select` |
| automatski | postavljaš u **Handleru**, ne u formi |

### 7.3. Na šta studenti najčešće pogriješe (općenito)

- Krenu frontend prije nego API radi u Swaggeru
- Ostanu hardkodirani `items` u listi
- Kopiraju `ICatalogCacheVersionService` iz Products
- Zaborave Controller
- Šalju `ORD-0001` umjesto `orderId: 4`
- Validacija samo na frontendu
- Filter ne resetuje `page` na 1
- CSS badge ne radi jer pošalju string `"Kreirana"` umjesto broja `1`
- Rade u folderu `dostavljaci/` umjesto `posiljke/`
- Prave novi entitet i migraciju iako već postoje

---

## 8. Opšta strategija

```
1. Pročitaj zadatak 2 puta. Označi: entitet, CRUD, šta je automatsko, UI zahtjevi.
2. Otvori OrderShipmentEntity + enum + OrderEntity. Ne izmišljaj polja.
3. Otvori Products modul — to je tvoj obrazac foldera.
4. Backend LISTA → Swagger.
5. Backend GetById, Create, Update, Delete → Swagger svaki.
6. Frontend API servis.
7. Frontend lista (najvažnija stranica).
8. Frontend add → edit → delete.
9. Ručni test kao korisnik.
```

**Zašto prvo backend?** Frontend bez API-ja ne možeš pouzdano testirati. Ako oboje pišeš odjednom, ne znaš gdje je greška.

**Lanac:**

```
Entity (već postoji)
  → DTO / Command
    → Query ili Command
      → Handler (+ Validator)
        → Controller
          → Angular models + api service
            → komponenta
```

---

## 9. Backend — korak po korak

> U Application projektu `GlobalUsings.cs` uvozi Catalog entitete, ali **ne** Sales. U svakom novom fajlu koji koristi `OrderShipmentEntity` / `OrderEntity` / enum dodaj:
>
> `using Market.Domain.Entities.Sales;`

Ne trebaš dirati `Program.cs`, `DependencyInjection.cs`, DbContext ni migracije.

---

### FAZA 0 — Pročitaj podatke (ne pišeš kod)

#### Korak 0.1: Entitet

- **Otvori:** `Market.Domain/Entities/Sales/OrderShipmentEntity.cs`
- **Pogledaj:** property-je i `Constraints.ShipmentNumberMaxLength = 20`
- **Zašto:** DTO, forma i validator moraju pratiti ova polja, ne izmišljena

#### Korak 0.2: Enum

- **Otvori:** `OrderShipmentStatusType.cs`
- **Zapamti:** `Kreirana = 1` … `Otkazana = 5`
- **Zašto:** CSS klase su `status-1` … `status-5`; create handler koristi `Kreirana`

#### Korak 0.3: Narudžba

- **Otvori:** `OrderEntity.cs`
- **Bitno polje:** `ReferenceNumber` (npr. `ORD-0001`) — to prikazuješ u tabeli i dropdownu
- **Ne prikazuješ** `OrderId` korisniku kao sirovi broj ako možeš prikazati `ReferenceNumber`

#### Korak 0.4: Da li je DbSet spreman?

- **Otvori:** `IAppDbContext.cs` → vidiš `DbSet<OrderShipmentEntity> OrderShipments`
- **Otvori:** `DatabaseContext.cs` → isto
- **Znači:** u handleru pišeš `ctx.OrderShipments` — kao `ctx.Products`

#### Korak 0.5: Soft delete (da razumiješ brisanje)

- **Otvori:** `Market.Infrastructure/Database/DatabaseConfiguration.cs`
- Kad uradiš `ctx.OrderShipments.Remove(entity)` + `SaveChangesAsync`, projekat **ne briše red fizički**. Pretvara Delete u `IsDeleted = true`.
- Globalni filter sakriva obrisane redove iz svih upita.
- **Šta ti radiš:** u Delete handleru radiš `Remove` kao Products. Ne radiš ručno `IsDeleted = true` osim ako baš želiš — `Remove` je konzistentan s projektom.

#### Korak 0.6: Napravi folder

U Visual Studiju, u `Market.Application/Modules/Sales/`:

```
OrderShipments/
  Commands/Create
  Commands/Update
  Commands/Delete
  Queries/List
  Queries/GetById
```

Ista hijerarhija kao Products, samo drugi naziv.

**Provjera:** Solution se i dalje builda. Još nemaš klase, samo foldere.

---

### FAZA A — Lista (Read + paginacija + filter)

Ovo radiš prvo. Kad ovo radi u Swaggeru, imaš 50% backenda.

#### Korak A1: List DTO

- **Otvori uzor:** `ListProductsQueryDto.cs`
- **Gdje kreirati:** `.../OrderShipments/Queries/List/ListOrderShipmentsQueryDto.cs`
- **Zašto DTO?** Ne vraćaš cijeli entitet (ne trebaš `IsDeleted`, navigaciju, interne stvari). Vraćaš ono što tabela treba.

Starter tabela očekuje otprilike:

| Kolona u HTML-u | Property u DTO-u | Odakle |
|-----------------|------------------|--------|
| Broj pošiljke | `ShipmentNumber` | entitet |
| Narudžba | `OrderReferenceNumber` | `Order.ReferenceNumber` |
| Status (badge) | `Status` | enum kao broj |
| Status (tekst) | `StatusNaziv` | mapiranje enuma u tekst |
| Cijena | `ShippingCost` | entitet |
| Datum slanja | `ShippedAtUtc` | entitet |
| Datum dostave | `DeliveredAtUtc` | entitet |
| (skriveno, za edit/delete) | `Id` | `BaseEntity` |

JSON ide u **camelCase**, pa Angular vidi `shipmentNumber`, `orderReferenceNumber`, `statusNaziv`...

**Šta NE radiš:** ne stavljaš cijeli `Order` objekat u DTO.

Primjer obrasca:

```csharp
namespace Market.Application.Modules.Sales.OrderShipments.Queries.List;

public sealed class ListOrderShipmentsQueryDto
{
    public required int Id { get; init; }
    public required string ShipmentNumber { get; init; }
    public required string OrderReferenceNumber { get; init; }
    public required OrderShipmentStatusType Status { get; init; }
    public required string StatusNaziv { get; init; }
    public required decimal ShippingCost { get; init; }
    public required DateTime ShippedAtUtc { get; init; }
    public required DateTime? DeliveredAtUtc { get; init; }
}
```

`using Market.Domain.Entities.Sales;` treba zbog enuma.

**Provjera:** build prolazi.

#### Korak A2: List Query

- **Otvori uzor:** `ListProductsQuery.cs`
- **Šta vidiš:** nasljeđuje `BasePagedQuery<ListProductsQueryDto>` i ima `Search`
- **Šta ti treba:** umjesto teksta `Search`, filter **`OrderId`** (nullable). Kad je `null` → sve narudžbe.

```csharp
namespace Market.Application.Modules.Sales.OrderShipments.Queries.List;

public sealed class ListOrderShipmentsQuery : BasePagedQuery<ListOrderShipmentsQueryDto>
{
    public int? OrderId { get; init; }
}
```

`BasePagedQuery<T>` već implementira `IRequest<PageResult<T>>` i ima `Paging`. **Ne dodaješ** `IRequest` ručno.

**Zašto `int?`:** dropdown „Sve narudžbe" ne šalje ID. Filter postoji samo kad je broj > 0.

#### Korak A3: List Handler

- **Otvori uzor:** `ListProductsQueryHandler.cs`
- **Šta kopiraš kao obrazac:**
  - konstruktor prima `IAppDbContext ctx`
  - `AsNoTracking()` jer samo čitaš
  - opcionalni `Where`
  - `Select` u DTO
  - `PageResult<...>.FromQueryableAsync(...)` — **ne piši ručno Skip/Take**

**Šta prilagodiš:**

1. `ctx.OrderShipments` umjesto `ctx.Products`
2. Filter: ako `request.OrderId` ima vrijednost, `Where(x => x.OrderId == request.OrderId)`
3. Sort: npr. `OrderByDescending(x => x.ShippedAtUtc)` (najnovije gore)
4. U `Select`:
   - `OrderReferenceNumber = x.Order!.ReferenceNumber` — isto kao Products radi `Category!.Name`. Kad koristiš `Select`, **ne treba** `Include`.
   - `StatusNaziv` mapiraj ternarnim izrazima (EF to pretvara u `CASE WHEN`)

**Šta NE kopiraš iz Products:** cache, `ToLower()` search po imenu (ovdje nije tekstualna pretraga).

```csharp
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Queries.List;

public sealed class ListOrderShipmentsQueryHandler(IAppDbContext ctx)
    : IRequestHandler<ListOrderShipmentsQuery, PageResult<ListOrderShipmentsQueryDto>>
{
    public async Task<PageResult<ListOrderShipmentsQueryDto>> Handle(
        ListOrderShipmentsQuery request, CancellationToken ct)
    {
        var q = ctx.OrderShipments.AsNoTracking();

        if (request.OrderId.HasValue && request.OrderId.Value > 0)
        {
            q = q.Where(x => x.OrderId == request.OrderId.Value);
        }

        var projected = q
            .OrderByDescending(x => x.ShippedAtUtc)
            .Select(x => new ListOrderShipmentsQueryDto
            {
                Id = x.Id,
                ShipmentNumber = x.ShipmentNumber,
                OrderReferenceNumber = x.Order!.ReferenceNumber,
                Status = x.Status,
                StatusNaziv =
                    x.Status == OrderShipmentStatusType.Kreirana ? "Kreirana" :
                    x.Status == OrderShipmentStatusType.USkladistu ? "U skladištu" :
                    x.Status == OrderShipmentStatusType.UDostavi ? "U dostavi" :
                    x.Status == OrderShipmentStatusType.Dostavljena ? "Dostavljena" :
                    x.Status == OrderShipmentStatusType.Otkazana ? "Otkazana" :
                    x.Status.ToString(),
                ShippingCost = x.ShippingCost,
                ShippedAtUtc = x.ShippedAtUtc,
                DeliveredAtUtc = x.DeliveredAtUtc
            });

        return await PageResult<ListOrderShipmentsQueryDto>
            .FromQueryableAsync(projected, request.Paging, ct);
    }
}
```

**Provjera:** build. Još nema endpoint — to je sljedeći korak, ili možeš prvo završiti cijeli controller na kraju Faze A. Najbrže je odmah dodati GET u kontroler.

#### Korak A4: Controller — GET lista

- **Otvori uzor:** `Market.API/Controllers/ProductsController.cs`
- **Gdje:** `Market.API/Controllers/OrderShipmentsController.cs`
- **Ime klase:** `OrderShipmentsController` → ruta postaje `/OrderShipments` zbog `[Route("[controller]")]`

Za sada samo lista. Ostale metode dodaješ u sljedećim fazama.

```csharp
using Market.Application.Modules.Sales.OrderShipments.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class OrderShipmentsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = "Staff")]
    public async Task<PageResult<ListOrderShipmentsQueryDto>> List(
        [FromQuery] ListOrderShipmentsQuery query,
        CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
```

**Zašto `[FromQuery]`?** Angular šalje `?orderId=3&paging.page=1&paging.pageSize=10`. Bez `[FromQuery]` model se ne veže.

**Zašto `Staff`, a ne `AllowAnonymous` kao Products lista?** Pošiljke su admin modul. Staff je sigurniji i dovoljan jer si već ulogovana. Možeš i `AllowAnonymous` ako želiš lakši Swagger — oba rade ako pošalješ token. Bitno: **FallbackPolicy zahtijeva login**, pa bez `[AllowAnonymous]` moraš biti autorizovana.

**Kako testirati:**

1. Pokreni API
2. Swagger → Authorize (login `string` / `string`)
3. `GET /OrderShipments`
4. Očekuješ `items` (seed ima 12), `totalItems`, `totalPages`
5. Probaj `orderId` jedne narudžbe — lista se smanji
6. Probaj `paging.page=1&paging.pageSize=5` — vidiš 5 redova i `totalPages` > 1

Ako je prazno: seed se nije pokrenuo ili gledaš krivu bazu. Provjeri `appsettings.json` i tabelu `OrderShipments` u SSMS-u.

---

### FAZA B — GetById (za edit formu)

#### Korak B1: DTO

Edit forma treba **sva polja koja korisnik mijenja**, plus readonly datume.

Obavezno uključi `OrderId` i `Status` kao brojeve — forma ih veže na `mat-select`.

```csharp
public sealed class GetOrderShipmentByIdQueryDto
{
    public required int Id { get; init; }
    public required string ShipmentNumber { get; init; }
    public required int OrderId { get; init; }
    public required string OrderReferenceNumber { get; init; }
    public required OrderShipmentStatusType Status { get; init; }
    public required decimal ShippingCost { get; init; }
    public required DateTime ShippedAtUtc { get; init; }
    public required DateTime? DeliveredAtUtc { get; init; }
}
```

#### Korak B2: Query

```csharp
public sealed class GetOrderShipmentByIdQuery : IRequest<GetOrderShipmentByIdQueryDto>
{
    public int Id { get; set; }
}
```

#### Korak B3: Handler

- **Otvori uzor:** `GetProductByIdQueryHandler.cs`
- **Šta kopiraš:** `Where(x => x.Id == request.Id)` + `Select` + `FirstOrDefaultAsync`
- Ako je `null` → `throw new MarketNotFoundException(...)` — middleware vraća 404

**Ne koristi** `Find` pa zatim ručno mapiranje. `Select` je konzistentniji s projektom: jedan upit, DTO se puni u bazi, uključujući `OrderReferenceNumber` preko `x.Order!.ReferenceNumber`. `Include` nije potreban.

Fajl: `Market.Application/Modules/Sales/OrderShipments/Queries/GetById/GetOrderShipmentByIdQueryHandler.cs`

```csharp
namespace Market.Application.Modules.Sales.OrderShipments.Queries.GetById;

public sealed class GetOrderShipmentByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetOrderShipmentByIdQuery, GetOrderShipmentByIdQueryDto>
{
    public async Task<GetOrderShipmentByIdQueryDto> Handle(
        GetOrderShipmentByIdQuery request,
        CancellationToken cancellationToken)
    {
        var q = context.OrderShipments
            .Where(x => x.Id == request.Id);

        var dto = await q
            .Select(x => new GetOrderShipmentByIdQueryDto
            {
                Id = x.Id,
                ShipmentNumber = x.ShipmentNumber,
                OrderId = x.OrderId,
                OrderReferenceNumber = x.Order!.ReferenceNumber,
                Status = x.Status,
                ShippingCost = x.ShippingCost,
                ShippedAtUtc = x.ShippedAtUtc,
                DeliveredAtUtc = x.DeliveredAtUtc
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (dto == null)
        {
            throw new MarketNotFoundException($"Order shipment with Id {request.Id} not found.");
        }

        return dto;
    }
}
```

**Zašto `x.Order!`:** isto kao `Category!.Name` u `GetProductByIdQueryHandler`. EF to pretvara u JOIN. `OrderId` je obavezan, pa ako pošiljka postoji, postoji i narudžba.

**Zašto ne `Find`:** `Find` vrati cijeli entitet, pa bi `OrderReferenceNumber` morala puniti naknadno. `Select` radi projekciju odmah.

#### Korak B4: Controller

```csharp
[HttpGet("{id:int}")]
[Authorize(Policy = "Staff")]
public async Task<GetOrderShipmentByIdQueryDto> GetById(int id, CancellationToken ct)
{
    return await sender.Send(new GetOrderShipmentByIdQuery { Id = id }, ct);
}
```

**Test:** `GET /OrderShipments/1` → vidiš jedan objekat. `GET /OrderShipments/99999` → 404.

---

### FAZA C — Create

#### Korak C1: Command

Korisnik šalje **samo ono što unosi**:

- `ShipmentNumber`
- `ShippingCost`
- `OrderId`

**Ne šalje** `Status`, `ShippedAtUtc`, `DeliveredAtUtc` — to radi Handler.

```csharp
public class CreateOrderShipmentCommand : IRequest<int>
{
    public string ShipmentNumber { get; set; }
    public decimal ShippingCost { get; set; }
    public int OrderId { get; set; }
}
```

Povratni tip `int` = novi `Id`, kao kod Products.

#### Korak C2: Validator

- **Otvori uzor:** `CreateProductCommandValidator.cs`
- Naslijedi `AbstractValidator<CreateOrderShipmentCommand>`
- Pravila iz entiteta i zadatka:

| Polje | Pravilo |
|-------|---------|
| `ShipmentNumber` | `NotEmpty`, `MaximumLength(OrderShipmentEntity.Constraints.ShipmentNumberMaxLength)` |
| `ShippingCost` | `GreaterThan(0)` |
| `OrderId` | `GreaterThan(0)` |

Koristi `Constraints` iz entiteta — jedan izvor istine, ne hardkodiraj `20` na tri mjesta. `FluentValidation` je već u global usings, ali `OrderShipmentEntity` nije, pa treba `using Market.Domain.Entities.Sales`.

Validator se **sam** pokreće kroz `ValidationBehavior` prije Handlera. Ako padne, API vrati 400. **Ne zoveš validator ručno.** MediatR ga nađe jer je u istom assemblyju i nasljeđuje `AbstractValidator<T>`.

Fajl: `Market.Application/Modules/Sales/OrderShipments/Commands/Create/CreateOrderShipmentCommandValidator.cs`

```csharp
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Create;

public sealed class CreateOrderShipmentCommandValidator : AbstractValidator<CreateOrderShipmentCommand>
{
    public CreateOrderShipmentCommandValidator()
    {
        RuleFor(x => x.ShipmentNumber)
            .NotEmpty().WithMessage("Shipment number is required.")
            .MaximumLength(OrderShipmentEntity.Constraints.ShipmentNumberMaxLength)
            .WithMessage($"Shipment number cannot exceed {OrderShipmentEntity.Constraints.ShipmentNumberMaxLength} characters.");

        RuleFor(x => x.ShippingCost)
            .GreaterThan(0).WithMessage("Shipping cost must be greater than 0.");

        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("OrderId must be greater than 0.");
    }
}
```

**Zašto `Constraints.ShipmentNumberMaxLength`:** u entitetu je `20`. Ako profesor promijeni dužinu, mijenjaš je na jednom mjestu. `MaximumLength(20)` bi se razišao od baze.

**Šta validator ne radi:** ne provjerava da li `OrderId` postoji u bazi. To je posao Handlera (`MarketNotFoundException` → 404). Validator samo gleda oblik zahtjeva (prazno, predugo, `0`) i vraća 400.

#### Korak C3: Handler — poslovna logika

- **Otvori uzor:** `CreateProductCommandHandler.cs`
- **Šta gledaš:** provjera da FK postoji (`ProductCategories`), kreiranje entiteta, `Add`, `SaveChangesAsync`, `return Id`
- **Šta NE kopiraš:** `ICatalogCacheVersionService`, `BumpVersionAsync`, provjeru unique Name, `StockQuantity = 0` / `IsEnabled = true` (to su polja proizvoda)

**Šta ti radiš:**

1. Nađi narudžbu: `ctx.Orders.FirstOrDefaultAsync(x => x.Id == request.OrderId)`
2. Ako nema → `MarketNotFoundException`
3. Napravi `OrderShipmentEntity` s:
   - `ShipmentNumber = request.ShipmentNumber.Trim()`
   - `ShippingCost = request.ShippingCost`
   - `OrderId = request.OrderId`
   - `Status = OrderShipmentStatusType.Kreirana` ← **automatski**
   - `ShippedAtUtc = DateTime.UtcNow` ← **automatski**
   - `DeliveredAtUtc = null`
4. `ctx.OrderShipments.Add(entity)`
5. `await ctx.SaveChangesAsync(ct)`
6. `return entity.Id`

`CreatedAtUtc` i `IsDeleted` postavlja `ApplyAuditAndSoftDelete`. Ne diraj ih.

Fajl: `Market.Application/Modules/Sales/OrderShipments/Commands/Create/CreateOrderShipmentCommandHandler.cs`

```csharp
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Create;

public sealed class CreateOrderShipmentCommandHandler(IAppDbContext ctx)
    : IRequestHandler<CreateOrderShipmentCommand, int>
{
    public async Task<int> Handle(CreateOrderShipmentCommand request, CancellationToken ct)
    {
        var order = await ctx.Orders
            .FirstOrDefaultAsync(x => x.Id == request.OrderId, ct);

        if (order is null)
        {
            throw new MarketNotFoundException($"Order with Id {request.OrderId} not found.");
        }

        var entity = new OrderShipmentEntity
        {
            ShipmentNumber = request.ShipmentNumber.Trim(),
            ShippingCost = request.ShippingCost,
            OrderId = request.OrderId,
            Status = OrderShipmentStatusType.Kreirana,
            ShippedAtUtc = DateTime.UtcNow,
            DeliveredAtUtc = null
        };

        ctx.OrderShipments.Add(entity);
        await ctx.SaveChangesAsync(ct);

        return entity.Id;
    }
}
```

**Zašto provjera narudžbe:** `OrderId` u validatoru samo mora biti veći od 0. Ovdje gledaš da taj red stvarno postoji. Nema ga → 404, isto kao `ProductCategory` u uzoru.

**Zašto nema cache-a i unique provjere:** pošiljke nisu katalog. Zadatak ne traži jedinstven broj pošiljke ni `BumpVersionAsync`.

**Zašto ne diraš `CreatedAtUtc` i `IsDeleted`:** `DatabaseContext.SaveChangesAsync` zove `ApplyAuditAndSoftDelete` i sam upisuje audit polja prije snimanja.

#### Korak C4: Controller POST

- **Otvori:** `ProductsController.Create`
- Isti obrazac: `CreatedAtAction(nameof(GetById), new { id }, new { id })`
- `[Authorize(Policy = "Staff")]`

**Test u Swaggeru:**

```json
{
  "shipmentNumber": "SHP-TEST-01",
  "shippingCost": 7.5,
  "orderId": 1
}
```

Provjeri odgovor (novi id), zatim `GET` po tom id-u: status mora biti `1` (Kreirana), `shippedAtUtc` popunjen, `deliveredAtUtc` null.

Ako pošalješ `orderId: 0` ili prazan broj pošiljke → 400 (validator).
Ako pošalješ nepostojeći `orderId` → 404.

---

### FAZA D — Update

#### Korak D1: Command

- **Otvori uzor:** `UpdateProductCommand.cs`
- `Id` ima `[JsonIgnore]` — ID dolazi iz URL-a, ne iz body-ja. Controller radi `command.Id = id`.

Korisnik na edit formi može mijenjati: broj, cijenu, narudžbu, **status**.

```csharp
public sealed class UpdateOrderShipmentCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public string ShipmentNumber { get; set; }
    public decimal ShippingCost { get; set; }
    public int OrderId { get; set; }
    public OrderShipmentStatusType Status { get; set; }
}
```

`IRequest<Unit>` = nema povratnog tijela (HTTP 204), kao Products.

#### Korak D2: Validator

- **Otvori uzor:** `UpdateProductCommandValidator.cs` i `ChangeOrderStatusCommandValidator.cs` (`IsInEnum`)
- Ista pravila kao Create, plus `Id > 0`. Status mora biti validan enum (`IsInEnum()`).

| Polje | Pravilo |
|-------|---------|
| `Id` | `GreaterThan(0)` |
| `ShipmentNumber` | `NotEmpty`, `MaximumLength(OrderShipmentEntity.Constraints.ShipmentNumberMaxLength)` |
| `ShippingCost` | `GreaterThan(0)` |
| `OrderId` | `GreaterThan(0)` |
| `Status` | `IsInEnum()` |

`Id` dolazi iz rute (`command.Id = id` u kontroleru), ali validator ga i dalje provjerava. `0` ili negativan id ne smije doći do handlera.

Fajl: `Market.Application/Modules/Sales/OrderShipments/Commands/Update/UpdateOrderShipmentCommandValidator.cs`

```csharp
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Update;

public sealed class UpdateOrderShipmentCommandValidator : AbstractValidator<UpdateOrderShipmentCommand>
{
    public UpdateOrderShipmentCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0.");

        RuleFor(x => x.ShipmentNumber)
            .NotEmpty().WithMessage("Shipment number is required.")
            .MaximumLength(OrderShipmentEntity.Constraints.ShipmentNumberMaxLength)
            .WithMessage($"Shipment number cannot exceed {OrderShipmentEntity.Constraints.ShipmentNumberMaxLength} characters.");

        RuleFor(x => x.ShippingCost)
            .GreaterThan(0).WithMessage("Shipping cost must be greater than 0.");

        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("OrderId must be greater than 0.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid shipment status.");
    }
}
```

**Zašto `IsInEnum()`:** `OrderShipmentStatusType` ima vrijednosti 1–5. JSON može poslati `0` ili `99` i to se i dalje veže na enum. `IsInEnum()` to odbija sa 400. Isto kao `NewStatus` u `ChangeOrderStatusCommandValidator`.

**Šta validator ne radi:** ne postavlja `DeliveredAtUtc` i ne provjerava da li pošiljka ili narudžba postoje. To radi handler.

#### Korak D3: Handler

- **Otvori uzor:** `UpdateProductCommandHandler.cs`
- Učitaj entitet po `Id` (**bez** `AsNoTracking` — trebaš ga mijenjati)
- Ako nema → 404
- Provjeri da nova narudžba postoji
- Upisi polja s forme
- **Ključna logika zadatka:**

```
Ako je Status == Dostavljena i DeliveredAtUtc još nema vrijednost
    → DeliveredAtUtc = DateTime.UtcNow
```

Ako je već bilo `Dostavljena` i datum postoji, **ne prepisuj** datum. Ako korisnik vrati status na nešto drugo, zadatak to obično ne nalaže eksplicitno — najsigurnije je datum dostave ostaviti kako jeste, osim ako na papiru piše da se briše.

- `SaveChangesAsync`
- `return Unit.Value`

**Šta NE kopiraš:** unique name, cache, disable kategorije.

`ShippedAtUtc` se ne dira. Postavljen je pri kreiranju i nije na edit formi.

Fajl: `Market.Application/Modules/Sales/OrderShipments/Commands/Update/UpdateOrderShipmentCommandHandler.cs`

```csharp
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Update;

public sealed class UpdateOrderShipmentCommandHandler(IAppDbContext ctx)
    : IRequestHandler<UpdateOrderShipmentCommand, Unit>
{
    public async Task<Unit> Handle(UpdateOrderShipmentCommand request, CancellationToken ct)
    {
        var entity = await ctx.OrderShipments
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
        {
            throw new MarketNotFoundException($"Order shipment with Id {request.Id} not found.");
        }

        var order = await ctx.Orders
            .FirstOrDefaultAsync(x => x.Id == request.OrderId, ct);

        if (order is null)
        {
            throw new MarketNotFoundException($"Order with Id {request.OrderId} not found.");
        }

        entity.ShipmentNumber = request.ShipmentNumber.Trim();
        entity.ShippingCost = request.ShippingCost;
        entity.OrderId = request.OrderId;
        entity.Status = request.Status;

        if (request.Status == OrderShipmentStatusType.Dostavljena && entity.DeliveredAtUtc is null)
        {
            entity.DeliveredAtUtc = DateTime.UtcNow;
        }

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
```

**Zašto nema `AsNoTracking`:** praćeni entitet EF upoređuje sa bazom. `SaveChangesAsync` vidi izmjenu i radi `UPDATE`. Sa `AsNoTracking` izmjene se ne snime.

**Zašto `entity.DeliveredAtUtc is null`:** prvi put kad status postane `Dostavljena`, upiše se trenutni UTC datum. Drugi save, dok je datum već tu, uslov padne i stari datum ostaje. Povratak na `UDostavi` ili `Otkazana` ovaj `if` ne dira, pa se datum ne briše.

**Šta ne kopiraš iz uzora:** `AnyAsync` za isto ime, `ICatalogCacheVersionService`, `BumpVersionAsync` i provjeru `IsEnabled` na kategoriji. Pošiljka nema ta pravila.

#### Korak D4: Controller PUT

```csharp
[HttpPut("{id:int}")]
[Authorize(Policy = "Staff")]
public async Task Update(int id, UpdateOrderShipmentCommand command, CancellationToken ct)
{
    command.Id = id; // ID iz rute ima prednost
    await sender.Send(command, ct);
}
```

**Test:** PUT s `"status": 4`. GET ponovo — `deliveredAtUtc` više nije null.

---

### FAZA E — Delete

#### Korak E1: Command

Kao `DeleteProductCommand`: samo `Id`, `IRequest<Unit>`. Nema body-ja. Kontroler u koraku E3 pravi command iz id-a u ruti: `new DeleteOrderShipmentCommand { Id = id }`.

`IRequest<Unit>` znači da handler ne vraća podatak. DELETE odgovor je 204, isto kao kod proizvoda.

Fajl: `Market.Application/Modules/Sales/OrderShipments/Commands/Delete/DeleteOrderShipmentCommand.cs`

```csharp
namespace Market.Application.Modules.Sales.OrderShipments.Commands.Delete;

public sealed class DeleteOrderShipmentCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
```

#### Korak E2: Handler

- **Otvori:** `DeleteProductCommandHandler.cs`
- Uzmi samo: nađi po Id, ako nema → 404, `Remove`, `SaveChangesAsync`
- **Preskoči:** `if (!appCurrentUser.IsAdmin)`, cache bump

Zbog soft-delete interceptor-a, red ostaje u bazi s `IsDeleted = true`, a lista ga više ne vraća. To je OK.

Fajl: `Market.Application/Modules/Sales/OrderShipments/Commands/Delete/DeleteOrderShipmentCommandHandler.cs`

```csharp
namespace Market.Application.Modules.Sales.OrderShipments.Commands.Delete;

public sealed class DeleteOrderShipmentCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DeleteOrderShipmentCommand, Unit>
{
    public async Task<Unit> Handle(DeleteOrderShipmentCommand request, CancellationToken ct)
    {
        var entity = await ctx.OrderShipments
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
        {
            throw new MarketNotFoundException($"Order shipment with Id {request.Id} not found.");
        }

        ctx.OrderShipments.Remove(entity);
        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
```

**Zašto `Remove`, a red ostaje:** `ApplyAuditAndSoftDelete` u `SaveChangesAsync` vidi `EntityState.Deleted`, promijeni ga u `Modified` i postavi `IsDeleted = true`. SQL je `UPDATE`, ne `DELETE`.

**Zašto lista i drugi DELETE ne vide red:** globalni filter je `IsDeleted == false`. Soft-obrisana pošiljka ne ulazi u upite, pa ponovni DELETE iste pošiljke vraća 404.

**Šta ne kopiraš:** `IAppCurrentUser` i `if (!appCurrentUser.IsAdmin)` — to pravilo je samo za proizvode. `ICatalogCacheVersionService` i `BumpVersionAsync` isto. Konstruktor prima samo `IAppDbContext`.

#### Korak E3: Controller DELETE

```csharp
[HttpDelete("{id:int}")]
[Authorize(Policy = "Staff")]
public async Task Delete(int id, CancellationToken ct)
{
    await sender.Send(new DeleteOrderShipmentCommand { Id = id }, ct);
}
```

**Test:** DELETE postojeći id → 204. GET lista više ga nema. DELETE isti id opet → 404.

---

### FAZA Backend — kontroler na kraju

Kompletan kontroler treba imati 5 akcija, po uzoru na Products:

| HTTP | Ruta | Akcija | Odgovor |
|------|------|--------|---------|
| GET | `/OrderShipments` | List | 200, `PageResult` |
| GET | `/OrderShipments/{id}` | GetById | 200 ili 404 |
| POST | `/OrderShipments` | Create | 201, tijelo `{ id }` |
| PUT | `/OrderShipments/{id}` | Update | 204 |
| DELETE | `/OrderShipments/{id}` | Delete | 204 |

**Ne nastavljaj frontend dok ovih pet ne radi u Swaggeru.**

Korak A4 ima samo `List`. Kad su handleri gotovi, cijeli fajl `Market.API/Controllers/OrderShipmentsController.cs` izgleda ovako. Ime klase daje rutu `/OrderShipments`. Sve akcije su `Staff`. U Swaggeru prvo Authorize, login `string` / `string`.

```csharp
using Market.Application.Modules.Sales.OrderShipments.Commands.Create;
using Market.Application.Modules.Sales.OrderShipments.Commands.Delete;
using Market.Application.Modules.Sales.OrderShipments.Commands.Update;
using Market.Application.Modules.Sales.OrderShipments.Queries.GetById;
using Market.Application.Modules.Sales.OrderShipments.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class OrderShipmentsController(ISender sender) : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = "Staff")]
    public async Task<PageResult<ListOrderShipmentsQueryDto>> List(
        [FromQuery] ListOrderShipmentsQuery query,
        CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }

    [HttpGet("{id:int}")]
    [Authorize(Policy = "Staff")]
    public async Task<GetOrderShipmentByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetOrderShipmentByIdQuery { Id = id }, ct);
    }

    [HttpPost]
    [Authorize(Policy = "Staff")]
    public async Task<ActionResult> Create(CreateOrderShipmentCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "Staff")]
    public async Task Update(int id, UpdateOrderShipmentCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "Staff")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteOrderShipmentCommand { Id = id }, ct);
    }
}
```

**Šta provjeriš u Swaggeru, redom:**

1. `GET /OrderShipments` → `items` (seed ima 12), `totalItems`, `totalPages`.
2. `GET /OrderShipments/1` → jedan objekat. `GET /OrderShipments/99999` → 404.
3. `POST` sa `shipmentNumber`, `shippingCost`, `orderId` → 201 i `{ id }`. Novi GET: status `1`, `deliveredAtUtc` prazan.
4. `PUT /OrderShipments/{id}` sa istim poljima plus `status` → 204. Id u body-ju se ignoriše jer kontroler upiše id iz rute.
5. `DELETE /OrderShipments/{id}` → 204. Lista ga više nema. Isti DELETE opet → 404.

`Update` i `Delete` nemaju `return`. To je 204, kao kod Products. `Create` mora `CreatedAtAction`, da Angular dobije `{ id }` i lokaciju novog resursa.

---

## 10. Frontend — korak po korak

Rute, sidebar i deklaracije komponenti **već postoje**. Ne dodaješ rutu. Ne dodaješ stavku menija. Ne registruješ komponentu u `AdminModule`.

Add/edit HTML je prazan. Lista ima vizuelnu tabelu i hardkod.

---

### FAZA F — API sloj

- **Otvori:** `src/app/api-services/readme.md` — pravila
- **Otvori uzor:** `products-api.models.ts` i `products-api.service.ts`
- **Gdje kreirati folder:** `src/app/api-services/order-shipments/`

**Pravila koja studenti krše:**

- nema `subscribe` u servisu
- nema toast-a u servisu
- nema filtera/mapiranja
- `providedIn: 'root'`
- `baseUrl = ${environment.apiUrl}/OrderShipments` — ime mora biti **isto** kao controller

#### Korak F1: Models

Prati backend DTO-e, **camelCase**:

```ts
import { PageResult } from '../../core/models/paging/page-result';
import { BasePagedQuery } from '../../core/models/paging/base-paged-query';

export enum OrderShipmentStatusType {
  Kreirana = 1,
  USkladistu = 2,
  UDostavi = 3,
  Dostavljena = 4,
  Otkazana = 5
}

export class ListOrderShipmentsRequest extends BasePagedQuery {
  orderId?: number | null;
}

export interface ListOrderShipmentsQueryDto {
  id: number;
  shipmentNumber: string;
  orderReferenceNumber: string;
  status: OrderShipmentStatusType;
  statusNaziv: string;
  shippingCost: number;
  shippedAtUtc: string;
  deliveredAtUtc: string | null;
}

export interface GetOrderShipmentByIdQueryDto {
  id: number;
  shipmentNumber: string;
  orderId: number;
  orderReferenceNumber: string;
  status: OrderShipmentStatusType;
  shippingCost: number;
  shippedAtUtc: string;
  deliveredAtUtc: string | null;
}

export type ListOrderShipmentsResponse = PageResult<ListOrderShipmentsQueryDto>;

export interface CreateOrderShipmentCommand {
  shipmentNumber: string;
  shippingCost: number;
  orderId: number;
}

export interface UpdateOrderShipmentCommand {
  shipmentNumber: string;
  shippingCost: number;
  orderId: number;
  status: OrderShipmentStatusType;
}
```

Datumi s API-ja dolaze kao ISO string, zato su `string` na frontendu.

#### Korak F2: Service

Kopiraj `ProductsApiService` 1:1, zamijeni ime i tipove. Metode: `list`, `getById`, `create`, `update`, `delete`.

Za `list` koristi `buildHttpParams(request)` — on pretvara `paging.page` u query string. Ako `orderId` bude `null`, **preskače se** (to želiš za „Sve narudžbe").

**Provjera:** Angular se kompajlira. Još ne vidiš podatke na ekranu.

Fajl: `src/app/api-services/order-shipments/order-shipments-api.service.ts`

Modeli iz koraka F1 idu u `order-shipments-api.models.ts` u istom folderu.

```ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListOrderShipmentsRequest,
  ListOrderShipmentsResponse,
  GetOrderShipmentByIdQueryDto,
  CreateOrderShipmentCommand,
  UpdateOrderShipmentCommand
} from './order-shipments-api.models';
import { buildHttpParams } from '../../core/models/build-http-params';

@Injectable({
  providedIn: 'root'
})
export class OrderShipmentsApiService {
  private readonly baseUrl = `${environment.apiUrl}/OrderShipments`;
  private http = inject(HttpClient);

  /**
   * GET /OrderShipments
   * Lista pošiljki. orderId se šalje samo kad nije null.
   */
  list(request?: ListOrderShipmentsRequest): Observable<ListOrderShipmentsResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListOrderShipmentsResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /OrderShipments/{id}
   */
  getById(id: number): Observable<GetOrderShipmentByIdQueryDto> {
    return this.http.get<GetOrderShipmentByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /OrderShipments
   */
  create(payload: CreateOrderShipmentCommand): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  /**
   * PUT /OrderShipments/{id}
   */
  update(id: number, payload: UpdateOrderShipmentCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * DELETE /OrderShipments/{id}
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

**Zašto `buildHttpParams`:** `{ orderId: 3, paging: { page: 1, pageSize: 10 } }` postaje `?orderId=3&paging.page=1&paging.pageSize=10`. To se poklapa sa `[FromQuery] ListOrderShipmentsQuery` na backendu. `null` i `undefined` se preskaču, pa „Sve narudžbe" ne šalje `orderId`.

**Šta ne smije u servis:** `subscribe`, toast, filter po statusu, mapiranje datuma. Servis samo šalje HTTP i vraća `Observable`. Komponenta se pretplaćuje.

**`create` vraća `Observable<number>`** kao Products. Komponenta taj broj ne mora čitati: nakon uspjeha ide toast i povratak na listu. Tijelo odgovora je zapravo `{ id }`, jer kontroler radi `CreatedAtAction`.

---

### FAZA G — Lista (`PosiljkeComponent`)

#### Korak G1: Šta otvoriti

| Fajl | Zašto |
|------|-------|
| `posiljke.component.ts` | ovdje pišeš logiku |
| `posiljke.component.html` | tabela već postoji; dodaš filter, paginator, click handlere |
| `products.component.ts` | uzor nasljeđivanja i `loadPagedData` |
| `products.component.html` | uzor `app-fit-paginator-bar`, `(click)="onEdit"` |
| `posiljke.component.scss` | već ima `.search-field` i `.status-badge` — ne treba novi dizajn |

#### Korak G2: TS — ukloni hardkod

Jedan fajl: `src/app/modules/admin/posiljke/posiljke.component.ts`.

HTML u ovom koraku ne diraš. Tabela već čita `items`:

```html
<table mat-table [dataSource]="items">
```

Starter taj niz drži u samoj komponenti, šest izmišljenih redova. Cilj koraka: obrišeš taj niz, klasa naslijedi `BaseListPagedComponent`, a `loadPagedData()` napuni `items` iz API-ja. Filter, paginator u HTML-u i navigacija dolaze u G3, G4 i G5. Ovdje samo lista.

##### Starter, cijeli fajl

Ovo zatičeš. `ngOnInit` i `onCreate` su prazni. Tabela prikazuje ovih šest objekata i nikad ne zove backend.

```ts
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-posiljke',
  standalone: false,
  templateUrl: './posiljke.component.html',
  styleUrl: './posiljke.component.scss'
})
export class PosiljkeComponent implements OnInit {

  // hardkodirano - obrisati ovo
  items = [
    { id: 1, shipmentNumber: 'SHP-00001', orderReferenceNumber: 'ORD-0001', status: 4, statusNaziv: 'Dostavljena', shippingCost: 12.50, shippedAtUtc: '02.02.2026', deliveredAtUtc: '04.02.2026' },
    { id: 2, shipmentNumber: 'SHP-00002', orderReferenceNumber: 'ORD-0002', status: 3, statusNaziv: 'U dostavi',   shippingCost: 8.00,  shippedAtUtc: '07.02.2026', deliveredAtUtc: null },
    { id: 3, shipmentNumber: 'SHP-00003', orderReferenceNumber: 'ORD-0003', status: 1, statusNaziv: 'Kreirana',    shippingCost: 15.00, shippedAtUtc: '12.02.2026', deliveredAtUtc: null },
    { id: 4, shipmentNumber: 'SHP-00004', orderReferenceNumber: 'ORD-0004', status: 2, statusNaziv: 'U skladištu', shippingCost: 10.00, shippedAtUtc: '15.02.2026', deliveredAtUtc: null },
    { id: 5, shipmentNumber: 'SHP-00005', orderReferenceNumber: 'ORD-0005', status: 5, statusNaziv: 'Otkazana',    shippingCost: 9.50,  shippedAtUtc: '10.02.2026', deliveredAtUtc: null },
    { id: 6, shipmentNumber: 'SHP-00006', orderReferenceNumber: 'ORD-0001', status: 4, statusNaziv: 'Dostavljena', shippingCost: 20.00, shippedAtUtc: '03.02.2026', deliveredAtUtc: '05.02.2026' },
  ];

  displayedColumns: string[] = [
    'shipmentNumber',
    'orderReferenceNumber',
    'status',
    'shippingCost',
    'shippedAtUtc',
    'deliveredAtUtc',
    'actions'
  ];

  ngOnInit(): void {
  }

  onCreate(): void {
  }
}
```

`inject` je uvezen, a niko ga još ne koristi. To ostaje: u novom fajlu `inject` vuče API servis i toaster.

##### Šta brišeš

Cijeli blok od komentara do zatvorene uglaste zagrade, uključujući komentar:

```ts
  // hardkodirano - obrisati ovo
  items = [
    { id: 1, shipmentNumber: 'SHP-00001', /* ... */ },
    // ... ostalih pet objekata
  ];
```

`items` poslije ovog koraka **nigdje ne pišeš**. Ni `items = []`, ni `items: ListOrderShipmentsQueryDto[] = []`. Prazan lokalni niz je ista greška kao hardkod: Angular vidi tvoje polje, a polje iz baze ostaje skriveno.

`displayedColumns` ostaje. Imena se poklapaju s `matColumnDef` u HTML-u (`shipmentNumber`, `orderReferenceNumber`, `status`, `shippingCost`, `shippedAtUtc`, `deliveredAtUtc`, `actions`). Ako preimenuješ kolonu, tabela izgubi tu kolonu.

##### Zašto lokalni `items` sakrije bazu

`BaseListComponent` već ima niz. Ti ga nasljeđuješ, ne deklariraš ponovo.

```ts
export abstract class BaseListComponent<TItem> extends BaseComponent {
  items: TItem[] = [];

  protected abstract loadData(): void;

  protected initList(): void {
    this.loadData();
  }
}
```

Isto ime u djetetu sakrije isto ime u roditelju. `handlePageResult` upisuje u **bazni** `items`. Tabela čita `items` na komponenti. Ako tvoj lokalni niz i dalje postoji, tabela čita njega, a API odgovor ode u polje koje HTML ne vidi. Ekran ostane na šest starter redova (`SHP-00001` … `SHP-00006`, datumi već upisani kao `02.02.2026`).

##### Klasa

Starter:

```ts
export class PosiljkeComponent implements OnInit {
```

Poslije G2:

```ts
export class PosiljkeComponent
  extends BaseListPagedComponent<ListOrderShipmentsQueryDto, ListOrderShipmentsRequest>
  implements OnInit {
```

Dva generička tipa, redom:

| Tip | Šta je | Zašto |
|-----|--------|-------|
| `ListOrderShipmentsQueryDto` | jedan red tabele | to postaje `TItem`, dakle tip od `items` |
| `ListOrderShipmentsRequest` | query koji šalješ (`paging` + `orderId`) | to postaje `TRequest`, dakle tip od `this.request` |

Oba tipa su iz koraka F1, fajl `order-shipments-api.models.ts`. `ListOrderShipmentsRequest` već `extends BasePagedQuery`, pa `new ListOrderShipmentsRequest()` sam napravi `paging`.

Uzor je Products, ista dva mjesta, druga imena:

```ts
export class ProductsComponent
  extends BaseListPagedComponent<ListProductsQueryDto, ListProductsRequest>
  implements OnInit {
```

##### Importi — tri tačke, ne četiri

Pošiljke su u `modules/admin/posiljke`. Products je jedan folder dublje: `modules/admin/catalogs/products`.

```
src/app/modules/admin/posiljke/posiljke.component.ts
        ../            → admin
        ../../         → modules
        ../../../      → app     ← ovo treba tebi

src/app/modules/admin/catalogs/products/products.component.ts
        ../../../../   → app     ← ovo ima Products
```

Ako kopiraš import iz Products i ostaviš četiri `../`, TypeScript ne nađe fajl. Tvoji importi:

```ts
import { Component, inject, OnInit } from '@angular/core';
import {
  ListOrderShipmentsQueryDto,
  ListOrderShipmentsRequest
} from '../../../api-services/order-shipments/order-shipments-api.models';
import { OrderShipmentsApiService } from '../../../api-services/order-shipments/order-shipments-api.service';
import { BaseListPagedComponent } from '../../../core/components/base-classes/base-list-paged-component';
import { ToasterService } from '../../../core/services/toaster.service';
```

`Router`, `OrdersApiService` i `DialogHelperService` ovdje ne dodaješ. Router je G5, narudžbe za dropdown su G3, dijalog brisanja je faza J.

##### Cijeli fajl poslije G2

Ovo je cijeli `posiljke.component.ts` na kraju ovog koraka. Ništa ispod `onCreate` još ne postoji.

```ts
import { Component, inject, OnInit } from '@angular/core';
import {
  ListOrderShipmentsQueryDto,
  ListOrderShipmentsRequest
} from '../../../api-services/order-shipments/order-shipments-api.models';
import { OrderShipmentsApiService } from '../../../api-services/order-shipments/order-shipments-api.service';
import { BaseListPagedComponent } from '../../../core/components/base-classes/base-list-paged-component';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-posiljke',
  standalone: false,
  templateUrl: './posiljke.component.html',
  styleUrl: './posiljke.component.scss'
})
export class PosiljkeComponent
  extends BaseListPagedComponent<ListOrderShipmentsQueryDto, ListOrderShipmentsRequest>
  implements OnInit {

  private api = inject(OrderShipmentsApiService);
  private toaster = inject(ToasterService);

  displayedColumns: string[] = [
    'shipmentNumber',
    'orderReferenceNumber',
    'status',
    'shippingCost',
    'shippedAtUtc',
    'deliveredAtUtc',
    'actions'
  ];

  constructor() {
    super();
    this.request = new ListOrderShipmentsRequest();
    this.request.paging.pageSize = 10;
  }

  ngOnInit(): void {
    this.initList();
  }

  protected loadPagedData(): void {
    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load shipments');
        this.toaster.error('Failed to load shipments');
        console.error('Load shipments error:', err);
      }
    });
  }

  onCreate(): void {
  }
}
```

##### Odakle se kopira obrazac

Iz `products.component.ts` prepisuješ konstruktor, `ngOnInit` i `loadPagedData`. Imena tipova i servisa mijenjaš. Router, edit, delete i search ostaju u Productsu — njih ovdje ne kopiraš.

```ts
constructor() {
  super();
  this.request = new ListProductsRequest();
}

ngOnInit(): void {
  this.initList();
}

protected loadPagedData(): void {
  this.startLoading();

  this.api.list(this.request).subscribe({
    next: (response) => {
      this.handlePageResult(response);
      this.stopLoading();
    },
    error: (err) => {
      this.stopLoading('Failed to load products');
      console.error('Load products error:', err);
    }
  });
}
```

Jedina razlika u `error` grani: uz `stopLoading` dodaš i `this.toaster.error(...)`, da korisnik vidi poruku, a ne samo crveni tekst u konzoli.

##### Šta koja linija radi

**`private api` i `private toaster`.** `inject(...)` uzme servis koji je već `providedIn: 'root'`. Ne dodaješ ih u konstruktor i ne registruješ u modulu. `api.list` je metoda iz koraka F2.

**Konstruktor.** Bazna klasa ima svoj konstruktor, zato prva linija mora biti `super()`. Bez nje TypeScript ne kompajlira klasu koja `extends`.

```ts
export abstract class BaseListPagedComponent<TItem, TRequest extends BasePagedQuery>
  extends BaseListComponent<TItem> {

  constructor() {
    super();
  }

  request!: TRequest;
```

`request!: TRequest` znači „ovo polje će postojati, a ja ga ne inicijaliziram ovdje". Zato ga ti praviš u svom konstruktoru:

```ts
this.request = new ListOrderShipmentsRequest();
this.request.paging.pageSize = 10;
```

`ListOrderShipmentsRequest` nasljeđuje `BasePagedQuery`, a taj konstruktor sam napravi `paging`:

```ts
export class BasePagedQuery {
  paging: PageRequest;

  constructor() {
    this.paging = new PageRequest();
  }
}
```

`PageRequest` ima dva polja. Defaulti su stranica 1 i **1000** redova:

```ts
export class PageRequest {
  page: number;
  pageSize: number;

  constructor(page: number = 1, pageSize: number = 1000) {
    this.page = page;
    this.pageSize = pageSize;
  }
}
```

`page` je broj strane (1, 2, 3). `pageSize` je koliko redova stane na jednu stranu. Seed ima 12 pošiljki. Sa defaultom 1000 sve stane na stranu 1 i paginator izgleda kao da ne radi. `pageSize = 10` pokaže 10 redova i drugu stranu s preostala 2.

Linija `this.request.paging.page = 10` je druga stvar: to traži **desetu stranu**. Na njoj nema redova, tabela ostane prazna. Pišeš `pageSize`, ne `page`.

**`ngOnInit` zove `initList()`, ne `loadPagedData()`.** Lanac je već napisan u bazi. Ti ga ne prepisuješ.

```ts
// BaseListComponent
protected initList(): void {
  this.loadData();
}

// BaseListPagedComponent — preusmjeri loadData na tvoju metodu
protected override loadData(): void {
  this.loadPagedData();
}
```

```
ngOnInit()
  └─ this.initList()                 // BaseListComponent
       └─ this.loadData()            // override u BaseListPagedComponent
            └─ this.loadPagedData()  // tvoja metoda, abstract dok je ne napišeš
```

`loadPagedData` je `protected abstract` u bazi. Dok ga ne implementiraš, klasa se ne kompajlira. Zato je u tvom fajlu `protected loadPagedData(): void`.

**`loadPagedData`, red po red.**

```ts
protected loadPagedData(): void {
  this.startLoading();

  this.api.list(this.request).subscribe({
    next: (response) => {
      this.handlePageResult(response);
      this.stopLoading();
    },
    error: (err) => {
      this.stopLoading('Failed to load shipments');
      this.toaster.error('Failed to load shipments');
      console.error('Load shipments error:', err);
    }
  });
}
```

`startLoading` i `stopLoading` su na `BaseComponent`. Prvi upali `isLoading`. Drugi ga ugasi. Ako predaš string, upiše ga u `errorMessage`.

```ts
export abstract class BaseComponent {
  isLoading = false;
  errorMessage: string | null = null;

  startLoading(): void {
    this.isLoading = true;
    this.errorMessage = null;
  }

  stopLoading(error?: string): void {
    this.isLoading = false;
    if (error) this.errorMessage = error;
  }
}
```

`this.api.list(this.request)` vrati `Observable`. `subscribe` je u komponenti, ne u servisu. `this.request` u tom trenutku nosi `paging.page = 1` i `paging.pageSize = 10`. `buildHttpParams` iz F2 to pretvori u `?paging.page=1&paging.pageSize=10`.

U `next`, `handlePageResult` prepiše tri polja s odgovora. Tu se `items` napuni. Ti tu metodu ne pišeš.

```ts
protected handlePageResult(result: PageResult<TItem>) {
  this.items = result.items;
  this.totalItems = result.totalItems;
  this.totalPages = result.totalPages;
}
```

`items` hrani tabelu. `totalItems` i `totalPages` hrane paginator iz G4. Zato ih već sada moraš dobiti, iako HTML paginatora još nema.

Poslije toga `stopLoading()` bez argumenta: spinner se gasi, `errorMessage` ostaje `null`.

U `error` grani isto gasiš loading, inače spinner ostane zauvijek. `stopLoading('Failed to load shipments')` upiše tekst u `errorMessage`. `toaster.error(...)` pokaže crveni toast. `console.error` ostavi objekat greške u konzoli, jer toast ne pokazuje status kod ni tijelo odgovora.

**`onCreate` ostaje prazan.** HTML već ima dugme:

```html
<button mat-raised-button color="primary" (click)="onCreate()">
```

Ako metodu obrišeš, template se ne kompajlira. Tijelo (`this.router.navigate(...)`) dopisuješ u G5.

##### Provjera

1. `ng serve` prođe. Nema greške „Property items does not exist" i nema „loadPagedData is abstract".
2. Ulogovan otvori `/admin/posiljke`.
3. Network: `GET http://localhost:7001/OrderShipments?paging.page=1&paging.pageSize=10`.
4. Tabela ima 10 redova iz seeda (`SHP-00001` …), ne onih 6 s datumom već napisanim kao `02.02.2026`.
5. Druga strana još nema dugme — paginator dodaješ u G4. Podaci su ipak već odsječeni na 10, jer si `pageSize` poslala u query-ju.

Ako i dalje vidiš tačno šest starter redova, lokalni `items` nije obrisan. Ako je tabela prazna, a u konzoli nema greške, provjeri da nisi slučajno postavila `paging.page = 10`.

#### Korak G3: Filter po narudžbi

Dva fajla. Klasa iz G2 ostaje. Ovdje joj dodaš dropdown narudžbi i ponovno učitavanje liste kad se odabir promijeni.

| Fajl | Šta radiš |
|------|-----------|
| `posiljke.component.ts` | uvezeš postojeći `OrdersApiService`, napuniš `orders`, na promjenu resetuješ stranicu i zoveš `loadPagedData()` |
| `posiljke.component.html` | u `.actions-container`, prije dugmeta „Nova pošiljka", dodaš `mat-select` |

SCSS ne diraš. `.search-field` već postoji i širok je 280px. `FormsModule` ne dodaješ. `OrdersApiService` ne praviš — narudžbe su tuđi modul i servis je već u projektu.

Filter nije Reactive Form. `formControlName` i `FormGroup` ostaju za add/edit (faza H i I). Na listi je `[(ngModel)]` dovoljan.

##### Šta već postoji, pa ne kreiraš

`orderId` na requestu si napisala u F1. Dropdown samo upisuje broj u to polje:

```ts
export class ListOrderShipmentsRequest extends BasePagedQuery {
  orderId?: number | null;
}
```

Dok je `orderId` `undefined` ili `null`, prvi `GET /OrderShipments` ide bez tog parametra i backend vrati sve pošiljke.

Narudžbe čitaš iz servisa koji je već `providedIn: 'root'`:

```ts
list(request?: ListOrdersRequest): Observable<ListOrdersResponse> {
  const params = request ? buildHttpParams(request as any) : undefined;

  return this.http.get<ListOrdersResponse>(this.baseUrl, {
    params,
  });
}
```

`baseUrl` je `${environment.apiUrl}/Orders`. Jedan red dropdowna je `ListOrdersQueryDto`. Tebi trebaju samo dva polja:

```ts
export interface ListOrdersQueryDto {
  id: number;
  referenceNumber: string | null;
  // user, orderedAtUtc, status, totalAmount, note — dropdown ih ne prikazuje
}
```

`id` ide u `[value]`. `referenceNumber` ide u tekst opcije (`ORD-0001`). Ako staviš `referenceNumber` u `[value]`, backend dobije string umjesto `orderId` i filter ne suzi listu.

`largePaging` je gotova konstanta, stranica 1 i 100 redova. Za ispitni seed (šest narudžbi) to je dovoljno. Ne praviš svoj `PageRequest`.

```ts
export const largePaging: PageRequest = new PageRequest(1, 100);
```

`ngModel` radi jer `SharedModule` već eksportuje `FormsModule`, a admin modul taj shared već uvozi. U `posiljke.component.ts` nema `imports: [FormsModule]`. Komponenta je `standalone: false`.

##### Cijeli `posiljke.component.ts` poslije G3

Ovo je G2 plus tri importa, `ordersApi`, niz `orders`, prošireni `ngOnInit` i `onOrderFilterChange`. `loadPagedData` se ne mijenja: i dalje šalje `this.request`, a u njemu sad može stajati `orderId`.

```ts
import { Component, inject, OnInit } from '@angular/core';
import {
  ListOrderShipmentsQueryDto,
  ListOrderShipmentsRequest
} from '../../../api-services/order-shipments/order-shipments-api.models';
import { OrderShipmentsApiService } from '../../../api-services/order-shipments/order-shipments-api.service';
import { ListOrdersQueryDto } from '../../../api-services/orders/orders-api.models';
import { OrdersApiService } from '../../../api-services/orders/orders-api.service';
import { BaseListPagedComponent } from '../../../core/components/base-classes/base-list-paged-component';
import { largePaging } from '../../../core/models/paging/paging-utils';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-posiljke',
  standalone: false,
  templateUrl: './posiljke.component.html',
  styleUrl: './posiljke.component.scss'
})
export class PosiljkeComponent
  extends BaseListPagedComponent<ListOrderShipmentsQueryDto, ListOrderShipmentsRequest>
  implements OnInit {

  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private toaster = inject(ToasterService);

  orders: ListOrdersQueryDto[] = [];

  displayedColumns: string[] = [
    'shipmentNumber',
    'orderReferenceNumber',
    'status',
    'shippingCost',
    'shippedAtUtc',
    'deliveredAtUtc',
    'actions'
  ];

  constructor() {
    super();
    this.request = new ListOrderShipmentsRequest();
    this.request.paging.pageSize = 10;
  }

  ngOnInit(): void {
    this.initList();

    this.ordersApi.list({ paging: largePaging }).subscribe({
      next: (res) => this.orders = res.items
    });
  }

  protected loadPagedData(): void {
    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load shipments');
        this.toaster.error('Failed to load shipments');
        console.error('Load shipments error:', err);
      }
    });
  }

  onOrderFilterChange(): void {
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  onCreate(): void {
  }
}
```

Importi i dalje imaju tri `../`. `orders` i `paging-utils` su pod `src/app`, isto kao API pošiljki.

`orders` je obično polje na tvojoj klasi. Nije `items`. `items` i dalje puni samo `handlePageResult` iz odgovora pošiljki. Ako dropdown vežeš na `items`, tabela i select dijele isti niz i jedno pregazi drugo.

##### Dva poziva u `ngOnInit`

`initList()` ostaje prvi. On ide lancem iz G2 i odmah učita pošiljke bez `orderId`.

Drugi `subscribe` je odvojen. Dropdown ne čeka listu, lista ne čeka dropdown.

```ts
ngOnInit(): void {
  this.initList();

  this.ordersApi.list({ paging: largePaging }).subscribe({
    next: (res) => this.orders = res.items
  });
}
```

`{ paging: largePaging }` je objekat s jednim poljem. `largePaging` je već `PageRequest(1, 100)`, pa ne pišeš `new PageRequest` ni `new ListOrdersRequest`. `buildHttpParams` to pretvori u:

```
GET http://localhost:7001/Orders?paging.page=1&paging.pageSize=100
```

`res` je `PageResult<ListOrdersQueryDto>`. Niz za `*ngFor` je `res.items`, ne cijeli `res`. Ako upišeš `this.orders = res`, select nema `id` ni `referenceNumber` na elementima i opcije budu prazne.

Zašto poseban poziv, a ne kolona iz tabele: red pošiljke ima `orderReferenceNumber`, ali samo za pošiljke na trenutnoj strani. Sa `pageSize = 10` prva strana nema svih 12, a dropdown mora ponuditi narudžbu i kad na toj strani nema njenih pošiljki. `OrdersApiService.list` vrati narudžbe, ne pošiljke.

Ako ovaj poziv padne, `orders` ostane `[]`. Select pokaže samo „Sve narudžbe". Lista pošiljki i dalje radi, jer je drugi `subscribe`. U Networku tražiš `GET /Orders`.

##### `onOrderFilterChange`

```ts
onOrderFilterChange(): void {
  this.request.paging.page = 1;
  this.loadPagedData();
}
```

`page`, ne `pageSize`. `pageSize` ostaje 10 iz konstruktora. Ovdje vraćaš broj strane na 1.

Bez tog reset-a: stojiš na strani 3 (`paging.page = 3`), odabereš narudžbu koja ima 2 pošiljke. Strana 3 više ne postoji. `handlePageResult` dobije prazan `items`. Tabela je prazna i izgleda kao da filter ne radi. Sa `page = 1` isti filter vrati ta dva reda.

`loadPagedData()` šalje cijeli `this.request`. Poslije odabira u njemu su `orderId`, `paging.page = 1` i `paging.pageSize = 10`.

##### HTML — gdje se lijepi

Starter, samo dugme:

```html
<div class="actions-container">
  <button mat-raised-button color="primary" (click)="onCreate()">
    <mat-icon>add</mat-icon>
    Nova pošiljka
  </button>
</div>
```

Poslije G3 select je **prije** dugmeta, unutar istog diva. `.actions-container` je flex s razmakom 16px, zato polje i dugme stoje u jednom redu. Klasa `search-field` je obavezna: bez nje nema širine 280px iz SCSS-a.

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

`[(ngModel)]="request.orderId"` radi dvije stvari. Kad se select otvori, prikaže vrijednost koja već stoji na requestu (`undefined` na početku, pa „Sve narudžbe"). Kad korisnik odabere opciju, upiše `o.id` (broj) u `request.orderId`.

`(ngModelChange)` se okine tek nakon tog upisa. Zato handler smije odmah čitati `this.request.orderId` i poslati ga u `list`. Ako umjesto toga staviš `(click)` na `mat-select`, klik se desi prije nego što je nova vrijednost upisana, pa `loadPagedData` pošalje stari `orderId`.

„Sve narudžbe" ima `[value]="null"`. To upiše `null` u `request.orderId`. `buildHttpParams` preskače `null` i prazan string:

```ts
if (value === null || value === undefined) {
  return;
}
```

Zato „Sve narudžbe" da URL bez `orderId`, a backend vrati sve. Odabir `ORD-0001` (id npr. `1`) da:

```
GET http://localhost:7001/OrderShipments?orderId=1&paging.page=1&paging.pageSize=10
```

To se poklapa s `[FromQuery] ListOrderShipmentsQuery` iz faze A.

##### Provjera

Otvori `/admin/posiljke` ulogovana. U Networku su dva poziva:

1. `GET /OrderShipments?paging.page=1&paging.pageSize=10` — nema `orderId`, tabela ima 10 od 12.
2. `GET /Orders?paging.page=1&paging.pageSize=100` — select se napuni sa `ORD-0001` … `ORD-0006`.

Seed veže po dvije pošiljke na svaku od tih šest narudžbi:

| Narudžba | Pošiljke |
|----------|----------|
| `ORD-0001` | `SHP-00001`, `SHP-00006` |
| `ORD-0002` | `SHP-00002`, `SHP-00009` |
| `ORD-0003` | `SHP-00003`, `SHP-00008` |
| `ORD-0004` | `SHP-00004`, `SHP-00010` |
| `ORD-0005` | `SHP-00005`, `SHP-00012` |
| `ORD-0006` | `SHP-00007`, `SHP-00011` |

Odaberi `ORD-0001`. URL dobije `orderId` i `paging.page=1`. U tabeli ostanu dvije pošiljke, obje s istim `orderReferenceNumber`. „Sve narudžbe" skine `orderId` i vrati punu listu.

Ako se lista ne suzi: u requestu gledaj da `orderId` bude broj (`o.id`), ne tekst `ORD-0001`. Ako je tabela prazna odmah nakon odabira, a u URL-u je `paging.page` veći od 1, reset na stranicu 1 nije upisan.

#### Korak G4: Paginacija u HTML-u

Jedna linija u `posiljke.component.html`. TypeScript se u ovom koraku ne mijenja: `loadPagedData`, `pageSize = 10` i `handlePageResult` su već iz G2, filter iz G3.

Ne praviš paginator, ne dodaješ `mat-paginator` i ne registruješ ništa u `AdminModule`. Komponenta `FitPaginatorBarComponent` je već deklarisana i eksportovana iz `SharedModule`, a admin modul taj shared već uvozi. Zato selector `app-fit-paginator-bar` radi u šablonu pošiljki.

Products na istom mjestu ima istu liniju. Kopiraš tag, ne cijeli HTML proizvoda.

##### Gdje stoji u starteru

Tabela je unutar kartice. Paginator ide u tu karticu, odmah ispod `</table>`, prije `</div>` koji zatvara `mat-elevation-z8`.

Starter, kraj fajla:

```html
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="7">
          Nema pošiljki.
        </td>
      </tr>
    </table>
  </div>
</div>
```

Poslije G4:

```html
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

Otvaranje te kartice, da vidiš par:

```html
  <div class="mat-elevation-z8">
    <table mat-table [dataSource]="items">
```

Redoslijed zatvaranja:

```
</table>
<app-fit-paginator-bar [vm]="this" />
</div>   ← kraj mat-elevation-z8
</div>   ← kraj .container
```

Ako bar staviš ispod cijelog `mat-elevation-z8`, klikovi i dalje rade, ali traka ispadne iz kartice. Kod Products je unutra. `colspan="7"` na praznom redu ostaje: sedam kolona je već u `displayedColumns`.

##### Šta je `[vm]="this"`

Bar ne zna za pošiljke. Prima bilo koju listu koja nasljeđuje `BaseListPagedComponent` i zove je `vm`.

```ts
export class FitPaginatorBarComponent {
  @Input({ required: true }) vm!: BaseListPagedComponent<any, any>;
}
```

`[vm]="this"` predaje **ovu** komponentu, `PosiljkeComponent`. Ona nasljeđuje tu bazu, pa input prihvata `this`. Nema polja koje se zove `vm`. `[vm]="vm"` je prazno i traka nema šta da čita.

`@Input({ required: true })` znači da tag bez `[vm]` ne kompajlira.

##### Šta traka čita i što zove

Cijeli `fit-paginator-bar.component.html`. Ovaj fajl ne mijenjaš. Ovde vidiš svaki izraz koji tvoja klasa mora imati.

```html
<div class="paginator-bar" *ngIf="vm.totalItems > 0">
  <div class="paginator-container">
    <div class="paginator-info">
      <mat-icon class="info-icon">info_outline</mat-icon>
      <span class="info-text">
        Stranica <strong>{{ vm.request.paging.page }}</strong> od
        <strong>{{ vm.totalPages || 1 }}</strong>
      </span>
      <span class="info-divider">•</span>
      <span class="info-total">
        Ukupno: <strong>{{ vm.totalItems }}</strong> zapisa
      </span>
    </div>

    <div class="paginator-actions">
      <div class="page-size-selector">
        <span class="selector-label">Po stranici:</span>
        <mat-form-field appearance="fill" class="page-size-field">
          <mat-select
            [value]="vm.request.paging.pageSize"
            (selectionChange)="vm.changePageSize($event.value)"
            [disabled]="vm.isLoading"
          >
            <mat-option [value]="5">5</mat-option>
            <mat-option [value]="10">10</mat-option>
            <mat-option [value]="20">20</mat-option>
            <mat-option [value]="50">50</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="nav-buttons">
        <button
          mat-stroked-button
          class="nav-btn prev-btn"
          (click)="vm.prevPage()"
          [disabled]="vm.request.paging.page <= 1 || vm.isLoading"
        >
          <mat-icon>chevron_left</mat-icon>
          <span>Prethodna</span>
        </button>

        <div class="page-indicator">
          {{ vm.request.paging.page }}
        </div>

        <button
          mat-stroked-button
          class="nav-btn next-btn"
          (click)="vm.nextPage()"
          [disabled]="(vm.totalPages && vm.request.paging.page >= vm.totalPages) || vm.isLoading"
        >
          <span>Sljedeća</span>
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>
  </div>
</div>
```

| Izraz na traci | Odakle na tvojoj klasi |
|----------------|------------------------|
| `vm.totalItems` | `handlePageResult` upiše `result.totalItems` |
| `vm.totalPages` | `handlePageResult` upiše `result.totalPages` |
| `vm.request.paging.page` | `PageRequest`, kreće od 1 |
| `vm.request.paging.pageSize` | u konstruktoru si stavila 10 |
| `vm.isLoading` | `startLoading` / `stopLoading` na `BaseComponent` |
| `vm.nextPage()` / `vm.prevPage()` / `vm.changePageSize()` | već napisane u `BaseListPagedComponent` |

`*ngIf="vm.totalItems > 0"` sakrije cijelu traku dok je ukupno 0. Prije odgovora API-ja `totalItems` jeste 0, pa se traka pojavi tek kad `handlePageResult` dobije broj. Prazan filter („nema pošiljki") isto sakrije traku. To nije greška u HTML-u.

Brojeve ne računaš u šablonu. `handlePageResult` iz G2 ih prepiše s odgovora:

```ts
protected handlePageResult(result: PageResult<TItem>) {
  this.items = result.items;
  this.totalItems = result.totalItems;
  this.totalPages = result.totalPages;
}
```

Seed ima 12 pošiljki, `pageSize` je 10. Backend vrati `totalItems = 12`, `totalPages = 2`, a `items` ima 10 redova. Traka piše **Stranica 1 od 2** i **Ukupno: 12 zapisa**.

Ako si zaboravila `this.request.paging.pageSize = 10`, default je 1000. Svih 12 stane na stranu 1, `totalPages` je 1, „Sljedeća" je ugašena. Traka se ipak vidi, jer je `totalItems` 12. Izgleda kao da paginacija ne radi.

##### Klik ne pišeš ti

Metode su u bazi. Svaka na kraju zove tvoj `loadPagedData()`, a on pošalje `this.request`.

```ts
goToPage(page: number): void {
  if (page < 1 || (this.totalPages && page > this.totalPages)) return;
  this.paging.page = page;
  this.loadPagedData();
}

nextPage() { this.goToPage(this.paging.page + 1); }
prevPage() { this.goToPage(this.paging.page - 1); }

changePageSize(size: number) {
  this.paging.pageSize = size;
  this.paging.page = 1;
  this.loadPagedData();
}
```

`get paging()` vraća `this.request.paging`, pa `this.paging.page = 2` i `this.request.paging.page = 2` diraju isto polje.

„Sljedeća" na strani 1 pozove `nextPage()` → `goToPage(2)`. Uslov prolazi jer je 2 manje ili jednako `totalPages`. Zatim:

```
GET http://localhost:7001/OrderShipments?paging.page=2&paging.pageSize=10
```

Tabela pokaže preostala 2 reda (`SHP-00011` i `SHP-00012` ako nema filtera). „Sljedeća" se ugasi jer je `page >= totalPages`. „Prethodna" zove `goToPage(1)` i vrati prvih 10.

„Po stranici: 20" zove `changePageSize(20)`. Ona stavi `pageSize = 20` i **vrati `page` na 1**, pa opet učita listu. Bez tog reset-a ostala bi na strani 2, a sa 20 redova strana 2 ne postoji i tabela bi bila prazna. Isti razlog kao `page = 1` u filteru iz G3.

Dok je `isLoading` true, oba dugmeta i select veličine su `[disabled]`. `startLoading()` na početku `loadPagedData` to upali, `stopLoading()` ugasi.

Filter iz G3 i ova traka dijele isti `request`. Odabir `ORD-0001` vrati 2 pošiljke, `totalPages` postane 1, „Sljedeća" se ugasi. „Sve narudžbe" vrati 12 i opet imaš dvije strane. Ništa novo u TS-u: `loadPagedData` već šalje cijeli request.

#### Korak G5: Akcije

Dva fajla. Rute, komponente i dugmad već postoje. Ovdje samo spojiš klik s `router.navigate`. Ne dodaješ rutu u `admin-routing-module.ts`, ne praviš `posiljke/:id/delete` i ne registruješ komponentu.

| Fajl | Šta radiš |
|------|-----------|
| `posiljke.component.ts` | `Router`, tijelo `onCreate` i `onEdit`. `onDelete` ostaje prazan |
| `posiljke.component.html` | `(click)` na olovku i kantu. Dugme „Nova pošiljka" već zove `onCreate()` |

Add i edit stranice su i dalje prazne (`posiljka-add works!` / `posiljka-edit works!`). Forma dolazi u fazi H i I. Uspjeh ovog koraka je da URL ode na `/admin/posiljke/add` ili `/admin/posiljke/5/edit` i da vidiš taj tekst. Kanta još ništa ne radi: tijelo `onDelete` je faza J.

##### Rute koje samo čitaš

`app-routing-module.ts` kači admin na prefiks `admin`:

```ts
{
  path: 'admin',
  canActivate: [myAuthGuard],
  data: myAuthData({ requireAuth: true, requireAdmin: true }),
  loadChildren: () =>
    import('./modules/admin/admin-module').then(m => m.AdminModule)
}
```

Djeca u `admin-routing-module.ts` nemaju `admin` u svom `path`. Zato je puna adresa `/admin` + dječija putanja. Pošiljke su već upisane, `add` prije `:id`:

```ts
{
  path: 'posiljke',
  component: PosiljkeComponent,
},
{
  path: 'posiljke/add',
  component: PosiljkaAddComponent,
},
{
  path: 'posiljke/:id/edit',
  component: PosiljkaEditComponent,
},
```

`posiljke/add` mora ostati iznad `posiljke/:id/edit`. Inače bi riječ `add` upala u `:id`. Tri komponente su već u `declarations` od `AdminModule`. Ne diraš ni routing ni modul.

Uzor je Products, ista tri segmenta, druga riječ:

```ts
onCreate(): void {
  this.router.navigate(['/admin/products/add']);
}

onEdit(product: ListProductsQueryDto): void {
  this.router.navigate(['/admin/products', product.id, 'edit']);
}
```

`onDelete` kod Products odmah otvara dijalog i zove API. To ne kopiraš. Ovdje metoda postoji i tijelo je prazno do faze J.

##### Cijeli `posiljke.component.ts` poslije G5

G3 plus `Router`. `loadPagedData`, filter i paginacija ostaju isti.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ListOrderShipmentsQueryDto,
  ListOrderShipmentsRequest
} from '../../../api-services/order-shipments/order-shipments-api.models';
import { OrderShipmentsApiService } from '../../../api-services/order-shipments/order-shipments-api.service';
import { ListOrdersQueryDto } from '../../../api-services/orders/orders-api.models';
import { OrdersApiService } from '../../../api-services/orders/orders-api.service';
import { BaseListPagedComponent } from '../../../core/components/base-classes/base-list-paged-component';
import { largePaging } from '../../../core/models/paging/paging-utils';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-posiljke',
  standalone: false,
  templateUrl: './posiljke.component.html',
  styleUrl: './posiljke.component.scss'
})
export class PosiljkeComponent
  extends BaseListPagedComponent<ListOrderShipmentsQueryDto, ListOrderShipmentsRequest>
  implements OnInit {

  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  orders: ListOrdersQueryDto[] = [];

  displayedColumns: string[] = [
    'shipmentNumber',
    'orderReferenceNumber',
    'status',
    'shippingCost',
    'shippedAtUtc',
    'deliveredAtUtc',
    'actions'
  ];

  constructor() {
    super();
    this.request = new ListOrderShipmentsRequest();
    this.request.paging.pageSize = 10;
  }

  ngOnInit(): void {
    this.initList();

    this.ordersApi.list({ paging: largePaging }).subscribe({
      next: (res) => this.orders = res.items
    });
  }

  protected loadPagedData(): void {
    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load shipments');
        this.toaster.error('Failed to load shipments');
        console.error('Load shipments error:', err);
      }
    });
  }

  onOrderFilterChange(): void {
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  onCreate(): void {
    this.router.navigate(['/admin/posiljke/add']);
  }

  onEdit(item: ListOrderShipmentsQueryDto): void {
    this.router.navigate(['/admin/posiljke', item.id, 'edit']);
  }

  onDelete(item: ListOrderShipmentsQueryDto): void {
  }
}
```

`ListOrderShipmentsQueryDto` je već uvezen od G2. Ima `id: number`, pa `item.id` u `onEdit` jeste broj iz reda tabele. `Router` dolazi iz `@angular/router`, ne iz relativne putanje. `inject(Router)` je isti obrazac kao `inject(OrderShipmentsApiService)`. `RouterModule` ne dodaješ u komponentu: aplikacija ga već ima preko `AppRoutingModule` i `AdminRoutingModule`.

`navigate` prima niz segmenata. Angular ih spoji kosom crtom. Vodeći `/` znači apsolutno od korijena, ne od trenutne rute `/admin/posiljke`.

| Poziv | URL | Ruta koja se pogodi |
|-------|-----|---------------------|
| `['/admin/posiljke/add']` | `/admin/posiljke/add` | `posiljke/add` |
| `['/admin/posiljke', 5, 'edit']` | `/admin/posiljke/5/edit` | `posiljke/:id/edit`, parametar `id` = `5` |

Tri segmenta u `onEdit` su namjerna. `item.id` stoji kao svoj element niza, pa se ne lijepi uz tekst. Jedan string `` `/admin/posiljke/${item.id}/edit` `` zna isto, ali Products ne radi tako i lakše je pogriješiti kosu crtu. Pišeš niz, kao u uzoru.

`['/posiljke/add']` nema `admin`, pa guard i layout admina se ne uključe i ruta ne postoji. `['admin/posiljke/add']` bez prvog `/` je relativno: sa stranice `/admin/posiljke` ode na `/admin/posiljke/admin/posiljke/add`.

##### HTML

Dugme u zaglavlju već ima handler. Ne dodaješ drugi `(click)`.

```html
<button mat-raised-button color="primary" (click)="onCreate()">
  <mat-icon>add</mat-icon>
  Nova pošiljka
</button>
```

Kolona `actions` već postoji u `displayedColumns` i u tabeli. Starter ima ikone bez poziva:

```html
<ng-container matColumnDef="actions">
  <th mat-header-cell *matHeaderCellDef>Akcije</th>
  <td mat-cell *matCellDef="let item">
    <button mat-icon-button color="primary" matTooltip="Uredi">
      <mat-icon>edit</mat-icon>
    </button>
    <button mat-icon-button color="warn" matTooltip="Obriši">
      <mat-icon>delete</mat-icon>
    </button>
  </td>
</ng-container>
```

Poslije G5, isti kontejner, samo `(click)`:

```html
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
```

Ime u šablonu je `item`, jer piše `*matCellDef="let item"`. `onEdit(row)` ne kompajlira: `row` postoji samo na `<tr mat-row *matRowDef="let row; ...">`, a dugmad su u ćeliji. `item` je jedan red iz `items`, dakle `ListOrderShipmentsQueryDto`.

`onDelete` mora stajati na klasi iako je prazan. Inače šablon prijavi da `onDelete` ne postoji i `ng serve` padne. Klik na kantu do faze J ne šalje `DELETE` i ne otvara modal.

##### Provjera

1. „Nova pošiljka" otvori `/admin/posiljke/add`. Na stranici piše `posiljka-add works!`.
2. Olovka na redu s `id` 5 otvori `/admin/posiljke/5/edit` i tekst `posiljka-edit works!`. Id uzmi iz Network odgovora liste, ne iz broja pošiljke `SHP-00005` (to nije `id`).
3. Kanta ne mijenja URL i ne baca grešku u konzoli.
4. Nazad na `/admin/posiljke`: lista, filter i paginator rade kao prije. Navigacija ih ne dira.

#### Korak G6: Formatiranje u templateu

| Polje | Kako |
|-------|------|
| Cijena | `{{ item.shippingCost \| number:'1.1-1' }} KM` (jedna decimala) |
| Datum slanja | `{{ item.shippedAtUtc \| date:'dd.MM.yyyy' }}` |
| Datum dostave | `{{ item.deliveredAtUtc \| date:'dd.MM.yyyy' }}` ili `'-'` ako je null |
| Status | ostavi postojeći HTML: `status-{{ item.status }}` + `{{ item.statusNaziv }}` |

Ako ostaviš sirovi ISO string, profesor vidi `2026-02-02T...` umjesto `02.02.2026`. `date` i `number` pipe su u `CommonModule`, koji lista već ima. Ne dodaješ import.

`number:'1.1-1'` znači najmanje jedna cifra prije tačke i tačno jedna iza. `8` postane `8.0`, `12.5` ostane `12.5`.

Status se ne dira. Klasa `status-1` … `status-5` već postoji u SCSS-u, a tekst dolazi iz `statusNaziv`.

U `posiljke.component.html` zamijeni tri ćelije:

```html
<ng-container matColumnDef="status">
  <th mat-header-cell *matHeaderCellDef>Status</th>
  <td mat-cell *matCellDef="let item">
    <span class="status-badge status-{{ item.status }}">
      {{ item.statusNaziv }}
    </span>
  </td>
</ng-container>

<ng-container matColumnDef="shippingCost">
  <th mat-header-cell *matHeaderCellDef>Cijena dostave</th>
  <td mat-cell *matCellDef="let item">
    <span style="font-weight: 600; color: #4976b5">
      {{ item.shippingCost | number:'1.1-1' }} KM
    </span>
  </td>
</ng-container>

<ng-container matColumnDef="shippedAtUtc">
  <th mat-header-cell *matHeaderCellDef>Datum slanja</th>
  <td mat-cell *matCellDef="let item">
    {{ item.shippedAtUtc | date:'dd.MM.yyyy' }}
  </td>
</ng-container>

<ng-container matColumnDef="deliveredAtUtc">
  <th mat-header-cell *matHeaderCellDef>Datum dostave</th>
  <td mat-cell *matCellDef="let item">
    {{ (item.deliveredAtUtc | date:'dd.MM.yyyy') || '-' }}
  </td>
</ng-container>
```

**Zašto ne `deliveredAtUtc || '-'` bez pipe-a:** kad datum postoji, izraz je truthy i Angular ispiše cijeli ISO string. Pipe prvo pretvori datum u `dd.MM.yyyy`. Ako je `null`, `date` vrati prazno, pa `|| '-'` pokaže crtu.

#### Korak G7: Brisanje (logika na listi)

Vidi Fazu J. Poziva se iz liste, ne iz posebne stranice.

Kanta već zove `onDelete(item)` iz koraka G5. Tu praznu metodu puniš u fazi J (`confirmDelete`, pa `api.delete`, pa `loadPagedData`). Ne praviš rutu `posiljke/:id/delete` i ne praviš novu komponentu. `admin-routing-module.ts` za pošiljke ima samo listu, add i edit.

Dok J nije gotov, klik na kantu ne radi ništa. Lista se i dalje može testirati.

**Kako testirati listu:**

1. Uloguj se i otvori `/admin/posiljke`.
2. Vidiš seed, ne 6 hardkodiranih redova iz startera. Seed ima **12** pošiljki, `SHP-00001` … `SHP-00012`.
3. Cijena ima jednu decimalu (`12.5 KM`), datumi su `dd.MM.yyyy`, prazan datum dostave je `-`.
4. Sa `pageSize = 10` prva strana ima 10 redova, druga 2. Paginator piše ukupno 12.
5. U Network tabu prvi poziv je `GET http://localhost:7001/OrderShipments?paging.page=1&paging.pageSize=10`. Nema `orderId`.
6. Odaberi jednu narudžbu. `paging.page` se vraća na 1, a URL dobije `orderId`. Prva narudžba u seedu ima dvije pošiljke (`SHP-00001` i `SHP-00006`), pa se lista smanji.
7. „Sve narudžbe" skine `orderId` iz query stringa i vrati svih 12.

Ako i dalje vidiš tačno onih 6 starter redova (`SHP-00001` … `SHP-00006` s datumima upisanim kao tekst), lokalni `items` nije obrisan i tabela ne čita API.

---

### FAZA H — Dodavanje (`PosiljkaAddComponent`)

Starter HTML je samo `<p>posiljka-add works!</p>`. TS je prazna klasa. SCSS fajl **ne postoji**, a `styleUrl` ga već zove — **kopiraj** `products-add.component.scss` u `posiljka-add.component.scss` (isti izgled form-card). Dizajn ne moraš raditi ručno.

Kopiraj cijeli fajl, ne piši CSS:

| Od | U |
|----|---|
| `src/app/modules/admin/catalogs/products/products-add/products-add.component.scss` | `src/app/modules/admin/posiljke/posiljka-add/posiljka-add.component.scss` |

`styleUrl: './posiljka-add.component.scss'` u starteru već pokazuje na taj fajl. Dok ga nema, `ng serve` padne na add ruti. Ruta `/admin/posiljke/add` i komponenta u modulu već postoje. Ne dodaješ rutu.

#### Korak H1: Uzor

Otvori ova tri fajla i gledaj obrazac, ne polja proizvoda:

| Fajl | Šta uzmeš |
|------|-----------|
| `products-add.component.ts` | `extends BaseFormComponent`, `initForm(false)`, prazan `loadData()`, `save()`, toast, `navigate` nazad |
| `products-add.component.html` | `form-card`, `[formGroup]`, `mat-form-field`, Sačuvaj / Odustani |
| `product-form.service.ts` | `FormBuilder` + `Validators`. Servis je `providers: [ProductFormService]` na komponenti, nema `providedIn: 'root'` |

Možeš formu praviti **u komponenti** (brže na ispitu) ili izdvojiti `PosiljkaFormService` ako želiš share s editom. Oba su OK. Products koristi form servis jer add i edit dijele ista polja. Kod pošiljki edit ima **dodatni status**, pa forma nije 100% ista — možeš dva `FormGroup`-a ili jedan servis s parametrom `isEdit`.

Na ispitu radi formu u `PosiljkaAddComponent`. Edit u fazi I dobije svoj `FormGroup` s poljem `status`. Ne troši vrijeme na servis.

Ako ipak hoćeš jedan servis, fajl `src/app/modules/admin/posiljke/posiljka-add/posiljka-form.service.ts`. `createForm(isEdit)` doda status samo na edit:

```ts
import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderShipmentStatusType } from '../../../../api-services/order-shipments/order-shipments-api.models';

@Injectable()
export class PosiljkaFormService {
  private fb = inject(FormBuilder);

  createForm(isEdit: boolean): FormGroup {
    const controls: Record<string, unknown> = {
      shipmentNumber: ['', [Validators.required, Validators.maxLength(20)]],
      shippingCost: [null, [Validators.required, Validators.min(0.01)]],
      orderId: [null, [Validators.required]]
    };

    if (isEdit) {
      controls['status'] = [OrderShipmentStatusType.Kreirana, [Validators.required]];
    }

    return this.fb.group(controls);
  }
}
```

Servis stavi u `providers` na add i na edit komponenti, kao `ProductFormService`. Bez toga `inject(PosiljkaFormService)` baci `NullInjectorError`. Koraci H2 i H3 pišu formu u komponenti, bez ovog servisa.

#### Korak H2: TS obrazac

1. `extends BaseFormComponent<GetOrderShipmentByIdQueryDto>`
2. `ngOnInit`: `this.initForm(false)` + učitaj narudžbe za dropdown (`OrdersApiService` + `largePaging`)
3. `loadData()` prazan (nije edit)
4. `initForm`: napravi `FormGroup` s poljima:

| Control | Validatori |
|---------|------------|
| `shipmentNumber` | `required`, `maxLength(20)` |
| `shippingCost` | `required`, `min(0.01)` |
| `orderId` | `required` |

**Nema** `status`, **nema** datuma — backend ih postavlja. U HTML stavi info tekst: „Status i datum slanja postavljaju se automatski." To nije form control. Tekst ide u korak H3.

5. `save()`:
   - ako `form.invalid` ili `isLoading` → return
   - sastavi `CreateOrderShipmentCommand` iz `form.value`
   - `api.create(command)`
   - uspjeh: `toaster.success(...)` + `router.navigate(['/admin/posiljke'])`
   - greška: `toaster.error(...)`

6. `onCancel()` → nazad na listu

Fajl: `src/app/modules/admin/posiljke/posiljka-add/posiljka-add.component.ts`

Importi su `../../../../` (četiri nivoa do `app`). `products-add` je jedan folder dublje, zato tamo piše pet.

`initForm(false)` na bazi samo postavi `isEditMode`. Formu praviš u `override`, pa zoveš `super.initForm(isEdit)`. Za `false` baza **ne** zove `loadData()`.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CreateOrderShipmentCommand,
  GetOrderShipmentByIdQueryDto
} from '../../../../api-services/order-shipments/order-shipments-api.models';
import { OrderShipmentsApiService } from '../../../../api-services/order-shipments/order-shipments-api.service';
import { ListOrdersQueryDto } from '../../../../api-services/orders/orders-api.models';
import { OrdersApiService } from '../../../../api-services/orders/orders-api.service';
import { BaseFormComponent } from '../../../../core/components/base-classes/base-form-component';
import { largePaging } from '../../../../core/models/paging/paging-utils';
import { ToasterService } from '../../../../core/services/toaster.service';

@Component({
  selector: 'app-posiljka-add',
  standalone: false,
  templateUrl: './posiljka-add.component.html',
  styleUrl: './posiljka-add.component.scss'
})
export class PosiljkaAddComponent
  extends BaseFormComponent<GetOrderShipmentByIdQueryDto>
  implements OnInit {

  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  orders: ListOrdersQueryDto[] = [];

  ngOnInit(): void {
    this.initForm(false);
    this.loadOrders();
  }

  protected loadData(): void {
  }

  protected override initForm(isEdit: boolean): void {
    super.initForm(isEdit);

    this.form = this.fb.group({
      shipmentNumber: ['', [Validators.required, Validators.maxLength(20)]],
      shippingCost: [null, [Validators.required, Validators.min(0.01)]],
      orderId: [null, [Validators.required]]
    });
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.startLoading();

    const command: CreateOrderShipmentCommand = {
      shipmentNumber: this.form.value.shipmentNumber,
      shippingCost: Number(this.form.value.shippingCost),
      orderId: Number(this.form.value.orderId)
    };

    this.api.create(command).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Pošiljka je sačuvana');
        this.router.navigate(['/admin/posiljke']);
      },
      error: (err) => {
        this.stopLoading();
        this.toaster.error('Greška pri snimanju pošiljke');
        console.error('Create shipment error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/posiljke']);
  }

  private loadOrders(): void {
    this.ordersApi.list({ paging: largePaging }).subscribe({
      next: (res) => this.orders = res.items,
      error: (err) => {
        this.toaster.error('Greška pri učitavanju narudžbi');
        console.error('Load orders error:', err);
      }
    });
  }
}
```

**Zašto `Number(...)`:** `input type="number"` u reactive formi često drži string. Backend `decimal` i `int` očekuju broj u JSON-u. `Number` to sredi prije `POST`.

**Zašto nema statusa u commandu:** `CreateOrderShipmentCommand` ima samo broj, cijenu i `orderId`. Handler sam stavlja `Kreirana`, `ShippedAtUtc = UtcNow` i `DeliveredAtUtc = null`.

**Dugme Sačuvaj** u HTML-u zove `onSubmit()`, ne `save()`. `onSubmit` u bazi radi `markAllAsTouched()` i odustane ako je forma nevalidna, pa tek onda zove `save()`.

#### Korak H3: HTML obrazac

Kopiraj strukturu `products-add.component.html`:

- `[formGroup]="form"` `(ngSubmit)="onSubmit()"`
- `mat-form-field` + `input` za broj pošiljke
- `input type="number" step="0.1"` za cijenu (jedna decimala)
- `mat-select` za narudžbu (`*ngFor` po `orders`, `[value]="o.id"`, tekst `o.referenceNumber`)
- dugme Sačuvaj: `[disabled]="form.invalid || isLoading"`
- dugme Odustani

`onSubmit()` već postoji u `BaseFormComponent` — on `markAllAsTouched` pa zove `save()`.

**Kako testirati:**

- Otvori Nova pošiljka — dropdown narudžbi nije prazan
- Prazna forma → Sačuvaj disabled
- Popuni, sačuvaj → toast + lista + novi red
- Swagger GET: status 1, datum slanja danas

---

### FAZA I — Uređivanje (`PosiljkaEditComponent`)

Isti problem: prazan HTML, nema SCSS. Kopiraj add SCSS / products-edit SCSS.

`styleUrl` već pokazuje na `posiljka-edit.component.scss`, a fajl ne postoji. Kopiraj jedan od ova dva, ne piši CSS:

| Od | U |
|----|---|
| `src/app/modules/admin/posiljke/posiljka-add/posiljka-add.component.scss` | `src/app/modules/admin/posiljke/posiljka-edit/posiljka-edit.component.scss` |

Ako add SCSS još nisi kopirala, uzmi `products-edit.component.scss` iz `catalogs/products/products-edit/`. Ruta `posiljke/:id/edit` već postoji.

#### Korak I1: Učitaj id iz rute

```ts
this.id = +this.route.snapshot.params['id'];
this.initForm(true);
```

Ruta je već `posiljke/:id/edit`. `+` pretvara string iz URL-a u broj. Za `/admin/posiljke/5/edit` je `id === 5`.

`initForm(true)` na bazi postavi `isEditMode` i **odmah zove `loadData()`**. Zato `FormGroup` napravi prije `super.initForm(isEdit)`, inače `patchValue` padne na prazan `form`.

#### Korak I2: `loadData()`

Kao products-edit: `forkJoin` pošiljka + lista narudžbi.

- `api.getById(this.id)`
- popuni formu (`patchValue`)
- ako 404: toast + nazad na listu

`forkJoin` čeka oba poziva. Dropdown i polja se pojave zajedno. Greška na bilo kom od njih ide u `error`: toast i `navigate` na listu. API za nepostojeći id vrati 404, a `HttpClient` to tretira kao grešku.

Status ide u formu jer ga edit šalje. Datume ne stavljaš u `FormGroup`. Ostanu na `this.model` i u koraku I3 se samo prikazuju.

Fajl: `src/app/modules/admin/posiljke/posiljka-edit/posiljka-edit.component.ts`

`save()` je prazan do koraka I4. Mora postojati jer je apstraktan na `BaseFormComponent`.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  GetOrderShipmentByIdQueryDto,
  OrderShipmentStatusType
} from '../../../../api-services/order-shipments/order-shipments-api.models';
import { OrderShipmentsApiService } from '../../../../api-services/order-shipments/order-shipments-api.service';
import { ListOrdersQueryDto } from '../../../../api-services/orders/orders-api.models';
import { OrdersApiService } from '../../../../api-services/orders/orders-api.service';
import { BaseFormComponent } from '../../../../core/components/base-classes/base-form-component';
import { largePaging } from '../../../../core/models/paging/paging-utils';
import { ToasterService } from '../../../../core/services/toaster.service';

@Component({
  selector: 'app-posiljka-edit',
  standalone: false,
  templateUrl: './posiljka-edit.component.html',
  styleUrl: './posiljka-edit.component.scss'
})
export class PosiljkaEditComponent
  extends BaseFormComponent<GetOrderShipmentByIdQueryDto>
  implements OnInit {

  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  id!: number;
  orders: ListOrdersQueryDto[] = [];

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.initForm(true);
  }

  protected override initForm(isEdit: boolean): void {
    this.form = this.fb.group({
      shipmentNumber: ['', [Validators.required, Validators.maxLength(20)]],
      shippingCost: [null, [Validators.required, Validators.min(0.01)]],
      orderId: [null, [Validators.required]],
      status: [OrderShipmentStatusType.Kreirana, [Validators.required]]
    });

    super.initForm(isEdit);
  }

  protected loadData(): void {
    this.startLoading();

    forkJoin({
      shipment: this.api.getById(this.id),
      orders: this.ordersApi.list({ paging: largePaging })
    }).subscribe({
      next: ({ shipment, orders }) => {
        this.model = shipment;
        this.orders = orders.items;
        this.form.patchValue({
          shipmentNumber: shipment.shipmentNumber,
          shippingCost: shipment.shippingCost,
          orderId: shipment.orderId,
          status: shipment.status
        });
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading();
        this.toaster.error('Pošiljka nije pronađena');
        console.error('Load shipment error:', err);
        this.router.navigate(['/admin/posiljke']);
      }
    });
  }

  protected save(): void {
  }

  onCancel(): void {
    this.router.navigate(['/admin/posiljke']);
  }
}
```

**Zašto `this.model`:** `GetOrderShipmentByIdQueryDto` ima `shippedAtUtc` i `deliveredAtUtc`. HTML u koraku I3 čita te datume sa modela. Nisu u formi, pa ih `save` ne pošalje i korisnik ih ne promijeni.

#### Korak I3: Dodatna polja u odnosu na Add

- `status` — `mat-select` s 5 opcija enuma (tekst: Kreirana, U skladištu, U dostavi, Dostavljena, Otkazana)
- Datum slanja i datum dostave: **readonly** (običan tekst / disabled field). Korisnik ih ne unosi.
- Info: „Ako status postane Dostavljena, datum dostave se postavlja automatski na serveru."

Pravu logiku **ne radi frontend**. Frontend samo šalje novi status.

`status` control već postoji u `initForm` iz koraka I2. Ovdje ga samo vežeš u HTML. Vrijednost opcije mora biti **broj** enuma (`1`…`5`), ne tekst. `UpdateOrderShipmentCommand.Status` i `IsInEnum()` očekuju taj broj.

U klasu dodaj niz. `OrderShipmentStatusType` je već uvezen:

```ts
statuses = [
  { value: OrderShipmentStatusType.Kreirana, label: 'Kreirana' },
  { value: OrderShipmentStatusType.USkladistu, label: 'U skladištu' },
  { value: OrderShipmentStatusType.UDostavi, label: 'U dostavi' },
  { value: OrderShipmentStatusType.Dostavljena, label: 'Dostavljena' },
  { value: OrderShipmentStatusType.Otkazana, label: 'Otkazana' }
];
```

U `posiljka-edit.component.html`, poslije polja za narudžbu, a prije dugmadi:

```html
<mat-form-field appearance="outline" class="full-width">
  <mat-label>Status</mat-label>
  <mat-select formControlName="status">
    <mat-option *ngFor="let s of statuses" [value]="s.value">
      {{ s.label }}
    </mat-option>
  </mat-select>
</mat-form-field>

<p>Datum slanja: {{ model?.shippedAtUtc | date:'dd.MM.yyyy' }}</p>
<p>Datum dostave: {{ (model?.deliveredAtUtc | date:'dd.MM.yyyy') || '-' }}</p>

<p>Ako status postane Dostavljena, datum dostave se postavlja automatski na serveru.</p>
```

Datumi su običan tekst sa `model`, ne `formControlName`. Disabled polje bi ispalo iz `form.value`, a `getRawValue()` bi ga poslalo backendu koji te datume na update-u ne prima. Handler sam upiše `DeliveredAtUtc` kad status postane `Dostavljena` i stari datum još ne postoji. Dok korisnik sjedi na formi, crta na ekranu ostaje dok se ne vrati na listu.

#### Korak I4: `save()`

`api.update(this.id, payload)` → toast → lista.

Payload mora imati `status` (broj).

**Kako testirati:**

- Klik olovke na `SHP-00003` (Kreirana)
- Forma popunjena, status = 1
- Promijeni u Dostavljena, sačuvaj
- Na listi badge zelen, datum dostave više nije `-`

---

### FAZA J — Brisanje

Radi se u `PosiljkeComponent`, ne na posebnoj ruti. Kanta već zove `onDelete(item)` iz koraka G5. Ovdje puniš tu metodu. Nema `posiljke/:id/delete`.

#### Korak J1: Modal

- **Otvori:** `products.component.ts` → `onDelete`
- **Otvori:** `dialog-helper.service.ts` → metoda `confirmDelete(itemName)`

`dialogHelper.product.confirmDelete` koristi prevod za proizvode (`PRODUCTS.DIALOGS.DELETE_MESSAGE`). Za pošiljke koristi **generičku** metodu `this.dialogHelper.confirmDelete(...)`. Ona već postoji, `providedIn: 'root'`. Ne praviš novi dijalog.

Generički ključ je `DIALOGS.MESSAGES.DELETE_CONFIRM`. Na bosanskom to je: Da li ste sigurni da želite obrisati „{{name}}"? `name` je `item.shipmentNumber`, npr. `SHP-00003`. Naslov je „Potvrdi Brisanje".

U `posiljke.component.ts` dodaj importe. Putanja je `../../../shared`, ne `../../../../` kao kod Products.

```ts
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton } from '../../../shared/models/dialog-config.model';
```

```ts
private dialogHelper = inject(DialogHelperService);

onDelete(item: ListOrderShipmentsQueryDto): void {
  this.dialogHelper.confirmDelete(item.shipmentNumber).subscribe(result => {
    if (result && result.button === DialogButton.DELETE) {
      this.performDelete(item);
    }
  });
}
```

`performDelete` pišeš u koraku J2. Dok je prazan, modal se otvori, a klik na Obriši ne zove API.

**Zašto `DialogButton.DELETE`:** dugme Otkaži vraća `DialogButton.CANCEL`. Samo `DELETE` smije ući u `if`. Zatvaranje modala bez tog dugmeta ostavlja `result` prazan, pa se brisanje ne desi.

#### Korak J2: Ako potvrdi

`api.delete(item.id)` → toast uspjeh → `loadPagedData()`.

Ovo je `performDelete`, metoda koju J1 zove samo poslije `DialogButton.DELETE`. `OrderShipmentsApiService` i `ToasterService` su već injektovani na listi.

```ts
private performDelete(item: ListOrderShipmentsQueryDto): void {
  this.startLoading();

  this.api.delete(item.id).subscribe({
    next: () => {
      this.toaster.success('Pošiljka je obrisana');
      this.loadPagedData();
    },
    error: (err) => {
      this.stopLoading();
      this.toaster.error('Greška pri brisanju pošiljke');
      console.error('Delete shipment error:', err);
    }
  });
}
```

`loadPagedData()` samo ponovo zove `GET /OrderShipments`. Soft-delete iz koraka E2 više ne vraća taj red, pa nestane iz tabele. Ne vadiš ga ručno iz `items`.

Na uspjehu nema `stopLoading()` prije reloada. `loadPagedData` sam pali i gasi loading. Na grešci mora `stopLoading()`, inače spinner ostane.

#### Korak J3: Ako otkaže

Ne zovi API. Modal se zatvara sam.

**Ne briši bez modala.** Profesor to eksplicitno traži. Kanta samo otvara dijalog. `api.delete` smije stajati u `performDelete`, a `performDelete` smije stati samo unutar `if`.

Otkaži zatvori dijalog sa `result.button === DialogButton.CANCEL`. Klik pored modala zatvori ga bez rezultata, pa je `result` prazan. Oba slučaja padnu na ovom uslovu i metoda se tu završi:

```ts
onDelete(item: ListOrderShipmentsQueryDto): void {
  this.dialogHelper.confirmDelete(item.shipmentNumber).subscribe(result => {
    if (result && result.button === DialogButton.DELETE) {
      this.performDelete(item);
    }
  });
}
```

Nema `else`. `api.delete` ostaje u `performDelete`. Lista se ne osvježava i red ostaje. U Network tabu nema `DELETE /OrderShipments/{id}`.

---

## 11. Vizuelni tok rješenja

### 11.1 Lista

```
Korisnik klikne „Pošiljke (Modul 1)" u sidebaru
        ↓
Router → PosiljkeComponent  (/admin/posiljke)
        ↓
ngOnInit → initList() → loadPagedData()
        ↓
OrderShipmentsApiService.list(request)   GET /OrderShipments?...
        ↓
OrderShipmentsController.List
        ↓
MediatR → ListOrderShipmentsQueryHandler
        ↓
ctx.OrderShipments (filter OrderId, sort, Select DTO, PageResult)
        ↓
handlePageResult() → items u mat-table
        ↓
app-fit-paginator-bar čita totalPages / totalItems
```

### 11.2 Dodavanje

```
„Nova pošiljka" → /admin/posiljke/add
        ↓
Učitaju se narudžbe (OrdersApiService.list)
        ↓
Korisnik unosi broj, cijenu, bira narudžbu
        ↓
Angular Validators (dugme disabled dok invalid)
        ↓
POST /OrderShipments
        ↓
CreateValidator → CreateHandler
        ↓
Status = Kreirana, ShippedAtUtc = UtcNow, DeliveredAtUtc = null
        ↓
toast + navigate na listu
```

### 11.3 Izmjena

```
Olovka → /admin/posiljke/{id}/edit
        ↓
GET /OrderShipments/{id} + lista narudžbi
        ↓
Forma popunjena; status se smije mijenjati
        ↓
PUT /OrderShipments/{id}
        ↓
Ako Status == Dostavljena i nema DeliveredAtUtc → postavi datum
        ↓
toast + lista
```

### 11.4 Brisanje

```
Kanta → dialogHelper.confirmDelete(shipmentNumber)
        ↓
OTKAŽI → ništa
OBRIŠI → DELETE /OrderShipments/{id}
        ↓
Remove → interceptor stavi IsDeleted = true
        ↓
toast + loadPagedData()  (red nestaje zbog global filtera)
```

---

## 12. Kako testirati

Testiraj **svaki sloj posebno**. Ne čekaj kraj.

### Backend (Swagger) — obavezno prije frontenda

| Test | Očekivano |
|------|-----------|
| GET lista | 12 seed zapisa (ako pageSize velik) |
| GET `paging.pageSize=5` | 5 itema, `totalPages` ≥ 3 |
| GET `orderId=` postojeći | manje itema, svi isti `orderReferenceNumber` |
| GET po id | jedan objekat s `orderId` |
| GET id 99999 | 404 |
| POST validan | 201 + id; GET pokazuje status 1 i datum slanja |
| POST bez broja / cijena 0 / orderId 0 | 400 |
| POST nepostojeći orderId | 404 |
| PUT status 4 | `deliveredAtUtc` popunjen |
| DELETE | 204; lista ga nema; ponovni DELETE 404 |

### Frontend — kao korisnik

1. Login staff nalogom.
2. Sidebar → Pošiljke (Modul 1).
3. Nema hardkodiranih 6 redova iz startera — vidiš seed / svoje podatke.
4. Paginacija mijenja stranice.
5. Filter narudžbe radi; „Sve narudžbe" vraća sve; nakon filtera si na stranici 1.
6. Nova pošiljka: dropdown pun, Sačuvaj disabled dok forma nije validna, poslije snimanja vidiš red, status Kreirana.
7. Edit: forma popunjena; Dostavljena upisuje datum dostave.
8. Delete: modal → otkaži (ostaje) → obriši (nestane + toast).
9. Cijena jedna decimala, datum `dd.MM.yyyy`, badge boja po statusu.

### Ako lista je prazna a Swagger radi

- Pogledaj Network: 401 (nisi ulogovana), 404 (pogrešan `baseUrl`), CORS (API nije upaljen).
- Uporedi URL: mora biti `http://localhost:7001/OrderShipments`, ne `/api/OrderShipments` (ovaj projekat nema `/api` prefiks).

---

## 13. Najčešće greške i debug

| Greška | Simptom | Šta uraditi |
|--------|---------|-------------|
| Hardkod ostao | Uvijek istih 6 redova, i kad API radi | Obriši `items = [...]`, naslijedi `BaseListPagedComponent` |
| Nema Controller-a | 404 u Swaggeru | Fajl u `Market.API/Controllers`, ime `OrderShipmentsController` |
| Handler nije nađen | runtime MediatR greška | klasa mora biti `IRequestHandler<...>`, Application projekat |
| Nestaje `using Sales` | CS0248 `OrderShipmentEntity` | `using Market.Domain.Entities.Sales;` |
| Kopiran cache | ne kompajlira ili nepotrebna zavisnost | nemoj `ICatalogCacheVersionService` |
| `orderId` string | 400 / prazan filter | dropdown `[value]="o.id"` (broj), ne `referenceNumber` |
| Badge bez boje | sivi tekst | `status` mora biti 1–5, ne ime enuma |
| Filter „prazna tabela" | page ostao 3 | `request.paging.page = 1` |
| Datum ružan | ISO u tabeli | `date:'dd.MM.yyyy'` |
| Cijena 12.50 vs 12.5 | zadatak traži 1 decimalu | `number:'1.1-1'` |
| Sačuvaj disabled | neki control invalid | `form.errors` u console / `get('shipmentNumber')?.errors` |
| Edit prazna forma | nisi učitala getById / krivi id iz rute | `ActivatedRoute` param `id` |
| 401 na POST | nisi Authorize u Swaggeru / nisi login u Angularu | staff nalog |
| Add nema stil | SCSS fajl ne postoji | kopiraj `products-add.component.scss` |
| Radiš Dostavljače | pogrešan folder | sidebar kaže **Pošiljke (Modul 1)** |
| Nova migracija | gubiš vrijeme | tabela već postoji |
| Validacija samo u Angularu | POST prolazi s cijenom 0 iz Postman-a | FluentValidation na Create/Update |
| Bind paging | sve na jednoj strani ili prazno | `buildHttpParams` + naslijedi `BasePagedQuery` |

### Redoslijed debuga na ispitu

1. **Swagger** — radi li backend sam?
2. **Network** — koji URL, koji status, koji JSON?
3. **Console** — Angular greška (`undefined`, binding)
4. **Uporedi s Products** — šta oni imaju, a ti nemaš? (`handlePageResult`, `initList`, `[FromQuery]`, `CreatedAtAction`...)

---

## 14. Završna checklista prije predaje

### Backend

- [ ] Folder `Modules/Sales/OrderShipments` s List, GetById, Create, Update, Delete
- [ ] List Query ima `OrderId?` i paginaciju preko `BasePagedQuery`
- [ ] List DTO ima polja koja tabela treba (`orderReferenceNumber`, `status`, `statusNaziv`...)
- [ ] Create **ne prima** status/datume; handler postavlja `Kreirana` + `ShippedAtUtc`
- [ ] Update postavlja `DeliveredAtUtc` kad je status `Dostavljena`
- [ ] Validator: obavezna polja, max 20, cijena > 0, OrderId > 0
- [ ] Handler provjerava da narudžba postoji
- [ ] Controller: 5 endpointa, ID iz rute na PUT
- [ ] Nisi dirala Domain entitet, enum, DbContext, migraciju (nije trebalo)
- [ ] Nisi kopirala catalog cache ni „samo admin briše"

### Frontend

- [ ] `api-services/order-shipments/` models + service, bez toast/subscribe u servisu
- [ ] `baseUrl` = `/OrderShipments`
- [ ] Lista bez hardkoda, `BaseListPagedComponent`, `app-fit-paginator-bar`
- [ ] Filter narudžbi + reset page
- [ ] `(click)` na edit/delete, `onCreate` navigira na add
- [ ] Cijena 1 decimala, datum `dd.MM.yyyy`, badge `status-{{ item.status }}`
- [ ] Add: Reactive Form, dropdown narudžbi, disabled Sačuvaj, toast
- [ ] Edit: getById, status select, datumi readonly, toast
- [ ] Delete: `confirmDelete` modal, zatim API, toast, reload
- [ ] SCSS za add/edit postoji (kopiran s products)

### Ručno

- [ ] Swagger 5/5 radi
- [ ] Tok u browseru: list → add → vidi se → edit status Dostavljena → datum se pojavi → delete s modalom
- [ ] Ne radiš u `dostavljaci/` i ne diraš Modul 2 (`uplate`)

---

## 15. Kako razmišljati na ispitu

```
┌─────────────────────────────────────────────────────────────┐
│  1. Pročitaj zadatak 2 puta.                                │
│     Entitet? CRUD? Šta je automatsko? UI (filter, modal)?   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Otvori Entity + enum. Šta VEĆ postoji?                  │
│     Ne pravi entitet/migraciju ako su već tu.               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Nađi uzor Products. Iscrtaj foldere na papiru.          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Backend LISTA → Swagger.                                │
│     Zatim GetById → Create → Update → Delete.               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. Frontend: models/service → lista → add → edit → delete. │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  6. Ručni test cijelog toka. Checklist.                     │
└─────────────────────────────────────────────────────────────┘
```

### Mantra

> Ne pišem kod naslijpo. Svaku klasu znam zašto postoji.

> Ako nešto ne radi — prvo Swagger, pa Network, pa uporedi s Products.

> Profesor ne traži dizajn. Traži: CQRS, formu, paginaciju, filter, toast, modal, automatski status i datume.

> Pošiljke su Modul 1. Uplate su Modul 2. Dostavljači nisu ovaj ispit.

### Mini-šema „šta otvorim kad zapnem"

| Problem | Otvori |
|---------|--------|
| Koja polja? | `OrderShipmentEntity.cs` |
| Kako izgleda Query? | `ListProductsQuery.cs` |
| Kako izgleda Handler liste? | `ListProductsQueryHandler.cs` |
| Kako izgleda Controller? | `ProductsController.cs` |
| Kako izgleda API servis? | `products-api.service.ts` + `readme.md` |
| Kako lista učitava? | `products.component.ts` |
| Kako forma? | `products-add.component.ts` |
| Kako modal? | `dialog-helper.service.ts` `confirmDelete` |
| Kako dropdown narudžbi? | `OrdersApiService.list` |

---

## 16. Rečnik pojmova

Pojmovi koji se **stvarno** koriste na ovom ispitu:

| Pojam | Jednostavno |
|-------|-------------|
| **Entity** | Klasa koja predstavlja tabelu. Ovdje `OrderShipmentEntity`. |
| **Enum** | Skup imenovanih brojeva. Ovdje `OrderShipmentStatusType`. |
| **DTO** | Objekat koji kaže koje podatke šaljemo klijentu. Nije entitet. |
| **CQRS** | Čitanje (Query) odvojeno od pisanja (Command). |
| **Query** | Zahtjev za čitanje (lista, getById). |
| **Command** | Nalog za promjenu (create, update, delete). |
| **Handler** | Klasa koja izvršava Query ili Command. Tu je poslovna logika. |
| **Validator** | FluentValidation pravila. Pokreće se sam prije Handlera. |
| **MediatR** | `sender.Send(...)` iz kontrolera pronalazi pravi Handler. |
| **Controller** | Ulaz HTTP-a. Bez logike — samo proslijedi. |
| **IAppDbContext** | Interfejs baze. Umjesto Repository-ja. `ctx.OrderShipments`. |
| **DbSet** | „Tabela" kroz koju radiš LINQ. |
| **FK / OrderId** | Broj koji veže pošiljku na narudžbu. |
| **Navigation property** | `entity.Order` — objekat povezane narudžbe. |
| **Select projekcija** | U Handleru odmah mapiraš u DTO. Tada `Include` nije potreban. |
| **PageResult** | Lista + `totalItems` + `totalPages`. |
| **BasePagedQuery** | Query koji već ima `Paging`. |
| **AsNoTracking** | Brže čitanje; ne pratiš izmjene. Samo u Query handlerima. |
| **Soft delete** | `Remove` postavlja `IsDeleted`; filter sakriva red. |
| **Seed** | Početni podaci. 12 pošiljki već postoji. |
| **Swagger** | UI za test API-ja na `/swagger`. |
| **Reactive Forms** | `FormGroup` + `Validators` + `formControlName`. |
| **BaseListPagedComponent** | Gotova paginacija: `handlePageResult`, `nextPage`... |
| **BaseFormComponent** | Gotov `onSubmit`, `hasError`, `initForm`. |
| **ToasterService** | Kratka poruka gore desno. |
| **DialogHelperService** | Modal potvrde. |
| **buildHttpParams** | Objekat → `?paging.page=1&orderId=3`. |
| **Staff policy** | Admin/Manager/Employee smiju write endpoint. |
| **camelCase** | JSON: `shipmentNumber`. C# property: `ShipmentNumber`. |

---

## Dodatni resursi u ovom projektu

| Fajl | Za šta |
|------|--------|
| `src/app/api-services/readme.md` | Pravila API servisa |
| `ProductsController.cs` | Uzor kontrolera |
| `ListProductsQueryHandler.cs` | Uzor liste s filterom i `Select` |
| `CreateProductCommandValidator.cs` | Uzor FluentValidation |
| `products.component.ts` | Uzor liste, delete, paginacije |
| `products-add.component.ts` | Uzor add forme |
| `orders-api.service.ts` | Gotov servis za dropdown narudžbi |
| `posiljke.component.html` | Gotova tabela — samo je poveži |

---

*Vodič je namijenjen pripremi RS1 ispita — Modul 1 (februar, entitet Pošiljka / OrderShipment). Modul 2 (Uplate) je odvojen dokument.*
