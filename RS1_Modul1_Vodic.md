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

| HTTP | Ruta | Akcija |
|------|------|--------|
| GET | `/OrderShipments` | List |
| GET | `/OrderShipments/{id}` | GetById |
| POST | `/OrderShipments` | Create |
| PUT | `/OrderShipments/{id}` | Update |
| DELETE | `/OrderShipments/{id}` | Delete |

**Ne nastavljaj frontend dok ovih pet ne radi u Swaggeru.**

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

1. Obriši niz `items = [...]` s komentarom „obrisati ovo".
2. Klasa treba naslijediti:

```ts
export class PosiljkeComponent
  extends BaseListPagedComponent<ListOrderShipmentsQueryDto, ListOrderShipmentsRequest>
  implements OnInit
```

3. U konstruktoru: `this.request = new ListOrderShipmentsRequest();`
   - Po želji: `this.request.paging.pageSize = 10;` da se paginacija vidi (seed ima 12 zapisa). Nije obavezno, ali je pametno na ispitu.
4. `ngOnInit`: `this.initList();` — to zove `loadPagedData()`.
5. Implementiraj `loadPagedData()` kao Products: `startLoading()`, `api.list(this.request).subscribe`, u `next` → `handlePageResult(response)` + `stopLoading()`, u `error` → `stopLoading(...)` + toast.

`displayedColumns` već postoji i odgovara tabeli. Ostavi ga.

`items` više ne deklariraš. Dolazi iz `BaseListComponent`, a `handlePageResult` ga puni iz `response.items`. Ako ostaviš lokalni niz, on sakrije bazni i tabela ostane na hardkodu.

`onCreate()` ostavi prazan. HTML već zove `(click)="onCreate()"`. Navigaciju dopisuješ u koraku G5.

Fajl: `src/app/modules/admin/posiljke/posiljke.component.ts`

Importi su `../../../`, ne `../../../../`. Pošiljke su u `modules/admin/posiljke`, a Products je jedan folder dublje (`catalogs/products`).

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

**Zašto `pageSize = 10`:** `PageRequest` ima default `pageSize = 1000`. Seed ima 12 pošiljki, pa bi bez ove linije sve stalo na jednu stranu i paginator izgleda kao da ne radi. Sa 10 vidiš 10 redova i drugu stranu.

**Zašto `super()`:** bazna klasa ima konstruktor. Bez `super()` TypeScript ne kompajlira klasu koja `extends`.

**Šta `initList` radi:** zove `loadData()`, a `BaseListPagedComponent` to preusmjerava na tvoj `loadPagedData()`. Zato u `ngOnInit` ne zoveš `loadPagedData()` direktno, nego `initList()`, kao Products.

#### Korak G3: Filter po narudžbi

1. Injektuj `OrdersApiService` (već postoji).
2. Niz `orders: ListOrdersQueryDto[] = []`.
3. U `ngOnInit` (pored `initList`) učitaj narudžbe:

```ts
this.ordersApi.list({ paging: largePaging }).subscribe({
  next: (res) => this.orders = res.items
});
```

`largePaging` je iz `core/models/paging/paging-utils.ts` — pageSize 100, dovoljno za dropdown.

4. U HTML, u `.actions-container` (SCSS već ima `.search-field`), dodaj `mat-select`:

- label: npr. „Narudžba"
- prva opcija: „Sve narudžbe" s vrijednošću `null` ili prazno
- ostale: `*ngFor="let o of orders"` → tekst `o.referenceNumber`, vrijednost `o.id`

5. Na promjenu:

```ts
onOrderFilterChange(): void {
  this.request.paging.page = 1; // OBAVEZNO
  this.loadPagedData();
}
```

`[(ngModel)]="request.orderId"` je OK za filter (nije Reactive Form; forma je add/edit). `FormsModule` je već u `SharedModule`, ne dodaješ ga.

**Zašto page = 1?** Ako si na stranici 3, pa filtriraš na 2 rezultata, stranica 3 više ne postoji — vidiš praznu tabelu i misliš da filter ne radi.

U `posiljke.component.ts` dodaj import i polja na klasu iz koraka G2. `ngOnInit` i dalje prvo zove `initList()`.

```ts
import { ListOrdersQueryDto } from '../../../api-services/orders/orders-api.models';
import { OrdersApiService } from '../../../api-services/orders/orders-api.service';
import { largePaging } from '../../../core/models/paging/paging-utils';
```

```ts
private ordersApi = inject(OrdersApiService);

orders: ListOrdersQueryDto[] = [];

ngOnInit(): void {
  this.initList();

  this.ordersApi.list({ paging: largePaging }).subscribe({
    next: (res) => this.orders = res.items
  });
}

onOrderFilterChange(): void {
  this.request.paging.page = 1;
  this.loadPagedData();
}
```

U `posiljke.component.html`, unutar `.actions-container`, **prije** dugmeta „Nova pošiljka":

```html
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
```

**Zašto `(ngModelChange)`, a ne samo klik:** handler čita `request.orderId`. `ngModelChange` se okine tek kad je nova vrijednost već upisana, pa `list` pošalje taj `orderId`. „Sve narudžbe" stavlja `null`, a `buildHttpParams` preskače `null`, pa backend vrati sve pošiljke.

**Zašto poseban poziv narudžbi:** dropdown treba `referenceNumber`, a lista pošiljki to ima samo za redove na trenutnoj strani. `OrdersApiService.list` puni sve narudžbe za filter. `largePaging` je stranica 1 i 100 redova.

#### Korak G4: Paginacija u HTML-u

Ispod `</table>`, unutar istog `mat-elevation` diva, dodaj paginator. Komponenta je već u `SharedModule` (`selector: app-fit-paginator-bar`). Ne registruješ je i ne pišeš vlastiti paginator.

`[vm]="this"` radi jer `PosiljkeComponent` nasljeđuje `BaseListPagedComponent`. Bar čita `request.paging`, `totalItems`, `totalPages` i `isLoading`, a klikovi zovu `goToPage`, `nextPage`, `prevPage` i `changePageSize`. Te metode već postoje u bazi i same zovu `loadPagedData()`.

U `posiljke.component.html` kraj tabele treba izgledati ovako:

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

Paginator mora ostati **unutar** `<div class="mat-elevation-z8">`, odmah poslije `</table>`, a **prije** zatvaranja tog diva. Ako ga staviš ispod cijelog `mat-elevation` diva, i dalje radi, ali ne sjedi u kartici kao kod Products.

Bar se ne vidi dok je `totalItems` 0. Sa `pageSize = 10` iz koraka G2 i 12 seed pošiljki vidiš „Stranica 1 od 2" i ukupno 12 zapisa. Klik na sljedeću stranu mijenja `paging.page` i ponovo zove listu.

#### Korak G5: Akcije

HTML trenutno ima dugmad **bez** `(click)`. Dodaj:

- olovka: `(click)="onEdit(item)"`
- kanta: `(click)="onDelete(item)"`

Rute već postoje u `admin-routing-module.ts`, ispod `path: 'admin'`:

| Akcija | `navigate` | Ruta |
|--------|------------|------|
| Nova pošiljka | `['/admin/posiljke/add']` | `posiljke/add` |
| Uredi | `['/admin/posiljke', item.id, 'edit']` | `posiljke/:id/edit` |

`onCreate` je prazan u starteru — samo dopuni navigaciju. Dugme „Nova pošiljka" već ima `(click)="onCreate()"`. Tijelo `onDelete` dolazi u fazi J; ovdje metoda mora postojati, inače se template ne kompajlira.

U `posiljke.component.ts` dodaj import i injektuj router. `ListOrderShipmentsQueryDto` je već uvezen u koraku G2.

```ts
import { Router } from '@angular/router';
```

```ts
private router = inject(Router);

onCreate(): void {
  this.router.navigate(['/admin/posiljke/add']);
}

onEdit(item: ListOrderShipmentsQueryDto): void {
  this.router.navigate(['/admin/posiljke', item.id, 'edit']);
}

onDelete(item: ListOrderShipmentsQueryDto): void {
}
```

Kolona akcija u `posiljke.component.html`:

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

**Zašto tri segmenta u `onEdit`:** `['/admin/posiljke', item.id, 'edit']` za id `5` postane `/admin/posiljke/5/edit`. To odgovara `path: 'posiljke/:id/edit'`. Ne slaži URL ručno kao string.

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

#### Korak I1: Učitaj id iz rute

```ts
this.id = +this.route.snapshot.params['id'];
this.initForm(true);
```

Ruta je već `posiljke/:id/edit`.

#### Korak I2: `loadData()`

Kao products-edit: možeš `forkJoin` pošiljka + lista narudžbi.

- `api.getById(this.id)`
- popuni formu (`patchValue` ili form servis s modelom)
- ako 404: toast + nazad na listu

#### Korak I3: Dodatna polja u odnosu na Add

- `status` — `mat-select` s 5 opcija enuma (tekst: Kreirana, U skladištu, U dostavi, Dostavljena, Otkazana)
- Datum slanja i datum dostave: **readonly** (običan tekst / disabled field). Korisnik ih ne unosi.
- Info: „Ako status postane Dostavljena, datum dostave se postavlja automatski na serveru."

Pravu logiku **ne radi frontend**. Frontend samo šalje novi status.

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

Radi se u `PosiljkeComponent`, ne na posebnoj ruti.

#### Korak J1: Modal

- **Otvori:** `products.component.ts` → `onDelete`
- **Otvori:** `dialog-helper.service.ts` → metoda `confirmDelete(itemName)`

`dialogHelper.product.confirmDelete` koristi prevod za proizvode. Za pošiljke koristi **generičku** metodu:

```ts
this.dialogHelper.confirmDelete(item.shipmentNumber).subscribe(result => {
  if (result && result.button === DialogButton.DELETE) {
    this.performDelete(item);
  }
});
```

To otvara modal „Da li ste sigurni...?" s imenom pošiljke.

#### Korak J2: Ako potvrdi

`api.delete(item.id)` → toast uspjeh → `loadPagedData()`.

#### Korak J3: Ako otkaže

Ne zovi API. Modal se zatvara sam.

**Ne briši bez modala.** Profesor to eksplicitno traži.

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
