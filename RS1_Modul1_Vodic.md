# RS1 — Modul 1 — Kompletni vodič za pripremu ispita

> **Napomena:** Ovaj dokument je učeni materijal, ne gotovo rješenje. Cilj je da razumiješ logiku i sama napišeš kod na ispitu.

---

## Sadržaj

1. [Uvod — šta je Modul 1?](#uvod--šta-je-modul-1)
2. [Kako je organizovan tvoj projekat?](#kako-je-organizovan-tvoj-projekat)
3. [Mapa pojmova — šta znači šta u ovom projektu](#mapa-pojmova--šta-znači-šta-u-ovom-projektu)
4. [Opšta strategija za ispit](#opšta-strategija-za-ispit)
5. [Zadatak 1 — OrderShipment (Pošiljke) CRUD](#zadatak-1--ordershipment-pošiljke-crud)
6. [Zadatak 2 — kako pristupiti drugom zadatku](#zadatak-2--kako-pristupiti-drugom-zadatku)
7. [Rečnik pojmova](#rečnik-pojmova)
8. [Kako razmišljati na ispitu — kratka šema](#kako-razmišljati-na-ispitu--kratka-šema)

---

## Uvod — šta je Modul 1?

Na ispitu iz **Razvoja softvera I (RS1)** prvi modul obično sadrži **dva zadatka**. Materijali koje si poslala pokrivaju **Zadatak 1** u potpunosti — upravljanje pošiljkama (OrderShipment).

Zadatak 1 traži da implementiraš **kompletan CRUD** (Create, Read, Update, Delete) za entitet **Pošiljka**, i to na **dva mjesta**:

| Sloj | Tehnologija | Šta radiš |
|------|-------------|-----------|
| **Backend** | .NET Web API + CQRS | API koji čita/piše u bazu |
| **Frontend** | Angular | Stranice koje korisnik vidi i koristi |

**Važno:** U ovom projektu **nema** klasičnih Windows Forms (ComboBox, DataGridView). Umjesto toga koristiš **Angular Material** (`mat-table`, `mat-select`, itd.). Logika je ista, samo su drugačiji nazivi — objašnjeno u [Mapa pojmova](#mapa-pojmova--šta-znači-šta-u-ovom-projektu).

### Šta starter projekat već ima (ne moraš raditi)

Prema tekstu zadatka, ovo **već postoji**:

- Entitet `OrderShipmentEntity` i enum `OrderShipmentStatusType`
- EF konfiguracija, `DbSet`, migracija i testni podaci (seed)
- Stavka **Pošiljke** u sidebaru
- Prazne Angular komponente: lista, dodavanje, uređivanje
- Registrovane rute u admin modulu

### Šta **ti** moraš napraviti

| Backend | Frontend |
|---------|----------|
| CQRS klase (Command, Handler, Validator, Query, DTO) | API servis + model fajlovi |
| `OrderShipmentsController` | Logika komponenti |
| | Reactive Forms, paginacija, pretraga, toast, modal |

---

## Kako je organizovan tvoj projekat?

U folderu `2026-02-16` imaš **dva odvojena projekta**:

```
2026-02-16/
├── rs1_backend-2025-26/     ← Backend (.NET)
└── rs1-frontend-2025-26/    ← Frontend (Angular)
```

### Backend — gdje šta tražiti

| Šta tražiš | Gdje je | Putanja (relativno od backend roota) |
|------------|---------|--------------------------------------|
| **Model (entitet)** | Domain sloj | `Market.Domain/Entities/Sales/OrderShipmentEntity.cs` |
| **Enum statusa** | Domain sloj | `Market.Domain/Entities/Sales/OrderShipmentStatusType.cs` |
| **DbContext** | Infrastructure | `Market.Infrastructure/Database/DatabaseContext.cs` |
| **Interfejs baze** | Application | `Market.Application/Abstractions/IAppDbContext.cs` |
| **CQRS (tvoj kod)** | Application | `Market.Application/Modules/` — **ovdje kreiraš novi folder** |
| **Kontroler (tvoj kod)** | API | `Market.API/Controllers/` |
| **Primjer CQRS-a** | Application | `Market.Application/Modules/Catalog/Products/` |
| **Primjer kontrolera** | API | `Market.API/Controllers/ProductsController.cs` |
| **Paginacija** | Application | `Market.Application/Common/BasePagedQuery.cs`, `PageResult.cs` |
| **Validacija** | Application | npr. `CreateProductCommandValidator.cs` |

**Napomena o Repository-ju:** U ovom projektu **nema** zasebnog Repository sloja. Umjesto toga Handler direktno koristi `IAppDbContext` — to je tvoja „veza s bazom".

### Frontend — gdje šta tražiti

| Šta tražiš | Gdje je | Putanja |
|------------|---------|---------|
| **Lista pošiljki** | Admin modul | `src/app/modules/admin/posiljke/posiljke.component.*` |
| **Dodavanje** | Admin modul | `src/app/modules/admin/posiljke/posiljka-add/` |
| **Uređivanje** | Admin modul | `src/app/modules/admin/posiljke/posiljka-edit/` |
| **Rute** | Admin routing | `src/app/modules/admin/admin-routing-module.ts` |
| **API servisi (tvoj kod)** | api-services | `src/app/api-services/order-shipments/` — **kreiraš** |
| **Primjer API servisa** | api-services | `src/app/api-services/products/` |
| **Primjer liste s paginacijom** | Admin | `src/app/modules/admin/catalogs/products/products.component.ts` |
| **Toast** | Core | `src/app/core/services/toaster.service.ts` |
| **Modal za brisanje** | Shared | `src/app/modules/shared/services/dialog-helper.service.ts` |
| **Bazna klasa za listu** | Core | `src/app/core/components/base-classes/base-list-paged-component.ts` |
| **Bazna klasa za formu** | Core | `src/app/core/components/base-classes/base-form-component.ts` |

### Koji projekat otvoriti u Visual Studio / VS Code?

- **Backend kod** → otvori `rs1_backend-2025-26/rs1_backend-2026-02-16.sln` u Visual Studio
- **Frontend kod** → otvori folder `rs1-frontend-2025-26` u VS Code ili Cursor
- Za testiranje pokrećeš **oba** istovremeno (API + `ng serve`)

---

## Mapa pojmova — šta znači šta u ovom projektu

Ako si na predavanjima čula ComboBox, DataGridView ili Repository, evo kako to odgovara **ovom** ispitu:

| Pojam iz predavanja / starijih zadataka | U tvom projektu |
|----------------------------------------|-----------------|
| Model | `OrderShipmentEntity` (C# klasa u Domain sloju) |
| Forma | Angular komponenta (`posiljka-add`, `posiljka-edit`) |
| DataGridView | `mat-table` u HTML-u |
| ComboBox | `mat-select` (padajući meni) |
| Data Binding | `[(ngModel)]`, `formControlName`, `{{ item.shipmentNumber }}` |
| Repository | **Nema** — koristiš `IAppDbContext` u Handleru |
| Event Handler | Metoda u `.ts` fajlu, npr. `(click)="onDelete(item)"` |
| Validacija na formi | Angular `Validators` u Reactive Form |
| Validacija na serveru | FluentValidation u `*Validator.cs` |

---

## Opšta strategija za ispit

### Redoslijed rada (preporučeno)

```
1. Pročitaj cijeli zadatak (označi ključne riječi)
2. Pogledaj entitet u Domain sloju (koja polja postoje?)
3. Backend: Query za listu → test u Swaggeru
4. Backend: ostali Query/Command → Controller → Swagger
5. Frontend: API model + servis
6. Frontend: lista (najvažnija stranica)
7. Frontend: dodavanje → uređivanje → brisanje
8. Testiraj cijeli tok ručno
```

### Zašto prvo backend?

Frontend **ne može** raditi bez API-ja. Ako napišeš Angular, a API ne postoji, nećeš znati da li je greška u frontendu ili backendu.

### Kako pronaći mjesto gdje pisati kod?

1. **Nađi sličan gotov modul** (npr. Products)
2. **Kopiraj strukturu foldera**, ne logiku — imena fajlova i klase prilagodi pošiljkama
3. **Prati lanac:** Entity → DTO → Query/Command → Handler → Controller → API servis → Komponenta

---

# Zadatak 1 — OrderShipment (Pošiljke) CRUD

---

## 1. Analiza zadatka

### Šta profesor traži?

Implementirati administratorski modul za upravljanje **pošiljkama** u Market aplikaciji. Korisnik (admin) treba moći:

| Operacija | Šta korisnik radi | Šta sistem mora uraditi |
|-----------|-------------------|-------------------------|
| **Lista (Read)** | Otvori „Pošiljke" u meniju | Prikaže tabelu sa paginacijom i filterom po narudžbi |
| **Dodavanje (Create)** | Klikne „Nova pošiljka" | Forma, validacija, automatski status i datum slanja |
| **Uređivanje (Update)** | Klikne ikonu olovke | Forma popunjena, može mijenjati status |
| **Brisanje (Delete)** | Klikne ikonu kante | Modal potvrde, brisanje, osvježavanje liste |

### Ključne riječi u tekstu zadatka

Kada vidiš ove riječi, znaš **šta** implementirati:

| Ključna riječ | Znači |
|---------------|-------|
| **CRUD** | Create, Read, Update, Delete — sve četiri operacije |
| **CQRS** | Odvojeni Command (pisanje) i Query (čitanje) na backendu |
| **Reactive Forms** | Angular forme s `FormGroup`, `Validators` |
| **Paginacija** | Lista se dijeli na stranice, ne prikazuje sve odjednom |
| **Toast** | Kratka poruka uspjeha/greške (zelena/crvena traka) |
| **Confirmation modal** | Dijalog „Da li ste sigurni?" prije brisanja |
| **Validacija backend i frontend** | I server i forma provjeravaju podatke |
| **dialogHelper** | Servis za prikaz modala (dozvoljeno u zadatku) |
| **Pretraga / filter** | Dropdown „Sve narudžbe" + pojedinačne narudžbe |
| **Automatski** | Ne unosi korisnik — postavljaš u Handleru |

### Polja entiteta (iz `OrderShipmentEntity`)

| Polje u bazi | Šta prikazati korisniku | Napomena |
|--------------|----------------------|----------|
| `ShipmentNumber` | Broj pošiljke | Korisnik unosi pri dodavanju |
| `ShippingCost` | Cijena dostave | Zaokruženo na **jednu decimalu** |
| `OrderId` | Narudžba (npr. ORD-0004) | Dropdown — veza na narudžbu |
| `Status` | Status (tekstualno) | Enum — pri dodavanju automatski **Kreirana** |
| `ShippedAtUtc` | Datum slanja | Automatski = današnji datum pri kreiranju |
| `DeliveredAtUtc` | Datum dostave | Prazan pri kreiranju; puni se kad status = **Dostavljena** |

### Statusi (`OrderShipmentStatusType`)

| Vrijednost enuma | Značenje |
|------------------|----------|
| Kreirana | Početni status pri dodavanju |
| USkladistu | U skladištu |
| UDostavi | U dostavi |
| Dostavljena | Dostavljeno — **automatski datum dostave** |
| Otkazana | Otkazano |

### Na šta studenti najčešće pogriješe?

1. **Hardkodirani podaci** — u `posiljke.component.ts` postoji niz `items = [...]` s komentarom „obrisati ovo". Moraš ga zamijeniti API pozivom.
2. **Zaborave paginaciju pri filtriranju** — kad promijeniš narudžbu u dropdownu, moraš resetovati na stranicu 1 i ponovo učitati podatke.
3. **Validacija samo na frontendu** — profesor traži i backend Validator.
4. **Datum dostave** — postavlja se samo kad status postane „Dostavljena", ne uvijek.
5. **Pogrešan redoslijed** — pišu frontend prije nego što API radi.
6. **Zaborave Controller** — naprave Handler, ali nema endpointa.
7. **DTO vs Entity** — vraćaju cijeli entitet umjesto DTO-a prilagođenog listi.
8. **Foreign Key** — šalju broj narudžbe (string) umjesto `OrderId` (broj).
9. **Format datuma** — na listi treba `dd.MM.yyyy`, ne sirovi ISO string.
10. **Dugme Sačuvaj disabled** — zaborave povezati `[disabled]="form.invalid"` na dugme.

---

## 2. Pronalazak odgovarajućih fajlova

### Korak po korak — „odakle krenuti?"

**A) Razumijevanje podataka**

1. Otvori `Market.Domain/Entities/Sales/OrderShipmentEntity.cs`
2. Otvori `OrderShipmentStatusType.cs`
3. Otvori `OrderEntity.cs` — vidi kako se zove broj narudžbe (`ReferenceNumber`)

**B) Backend — uzor za kopiranje strukture**

1. Otvori folder `Market.Application/Modules/Catalog/Products/`
2. Pogledaj podfoldere: `Commands/Create`, `Commands/Update`, `Commands/Delete`, `Queries/List`, `Queries/GetById`
3. Za svaki podfolder vidi koja 2–4 fajla postoje (Command, Handler, Validator, Dto...)

**C) Backend — gdje dodati novi modul**

Kreiraj logičnu putanju, npr.:

`Market.Application/Modules/Sales/OrderShipments/`

(sa istom strukturom podfoldera kao Products)

**D) Frontend — uzor**

1. `api-services/products/` — kako izgleda API servis
2. `modules/admin/catalogs/products/` — lista, add, edit
3. `modules/admin/posiljke/` — **tvoje prazne komponente**

**E) Gdje se dodaje nova klasa?**

| Tip klase | Lokacija |
|-----------|----------|
| Query DTO | `.../Queries/List/ListOrderShipmentsQueryDto.cs` |
| List Query | `.../Queries/List/ListOrderShipmentsQuery.cs` |
| List Handler | `.../Queries/List/ListOrderShipmentsQueryHandler.cs` |
| Create Command | `.../Commands/Create/CreateOrderShipmentCommand.cs` |
| Create Handler | `.../Commands/Create/CreateOrderShipmentCommandHandler.cs` |
| Create Validator | `.../Commands/Create/CreateOrderShipmentCommandValidator.cs` |
| Controller | `Market.API/Controllers/OrderShipmentsController.cs` |
| FE model | `api-services/order-shipments/order-shipments-api.models.ts` |
| FE servis | `api-services/order-shipments/order-shipments-api.service.ts` |

---

## 3. Koraci rješavanja — checklista

### FAZA A — Backend: Lista (Read)

#### Korak A1: List Query DTO

- **Otvori:** `ListProductsQueryDto.cs` kao uzor
- **Razmisli:** Koja polja treba tabela na listi? (broj pošiljke, broj narudžbe, status, cijena, datumi)
- **Zašto DTO?** Ne šalješ cijeli entitet klijentu — samo ono što treba za prikaz
- **Posebno:** Za broj narudžbe trebaš podatak iz povezane `Order` entiteta — tu ćeš koristiti navigaciono svojstvo ili join u upitu

#### Korak A2: List Query

- **Naslijedi** `BasePagedQuery<TvojDto>`
- **Dodaj** property za filter po narudžbi (npr. `OrderId` — nullable, kad je null = sve narudžbe)

#### Korak A3: List Query Handler

- **Otvori:** `ListProductsQueryHandler.cs`
- **Koristi:** `ctx.OrderShipments.AsNoTracking()`
- **Filter:** Ako je `OrderId` proslijeđen, dodaj `Where`
- **Projekcija:** `Select` u DTO — mapiraj status enum u čitljiv tekst ako treba na backendu, ili pošalji broj pa na frontendu formatiraj
- **Paginacija:** `PageResult<...>.FromQueryableAsync(...)` — **ne piši ručno skip/take** ako možeš koristiti postojeći helper
- **Sortiranje:** Odaberi smisleno (npr. po datumu slanja)

#### Korak A4: Controller — GET lista

- **Otvori:** `ProductsController.cs`
- **Napravi:** `OrderShipmentsController` s GET metodom koja prima query parametre
- **Test:** Pokreni API, otvori Swagger (`/swagger`), probaj GET endpoint

---

### FAZA B — Backend: GetById (za edit formu)

#### Korak B1: GetById Query + DTO + Handler

- **Zašto?** Edit forma mora učitati postojeće podatke
- **Handler:** Pronađi po `Id`, ako ne postoji baci `MarketNotFoundException`
- **DTO:** Sva polja koja forma treba, uključujući `OrderId` i `Status`

#### Korak B2: Controller — GET po id

- `GET /OrderShipments/{id}`

---

### FAZA C — Backend: Create

#### Korak C1: Create Command

- Polja koja korisnik šalje: `ShipmentNumber`, `ShippingCost`, `OrderId`
- **Ne šalješ** status ni datume — Handler ih postavlja

#### Korak C2: Create Validator

- **Otvori:** `CreateProductCommandValidator.cs` kao uzor
- **Provjeri:** obavezna polja, max dužina broja pošiljke (pogledaj `OrderShipmentEntity.Constraints`)
- **Provjeri:** `OrderId > 0`, `ShippingCost > 0`

#### Korak C3: Create Handler — poslovna logika

- **Provjeri** da narudžba postoji (`ctx.Orders`)
- **Kreiraj** novi `OrderShipmentEntity`
- **Postavi automatski:**
  - `Status = Kreirana`
  - `ShippedAtUtc = DateTime.UtcNow` (ili kako projekat radi s datumima)
  - `DeliveredAtUtc = null`
- **Sačuvaj:** `Add` + `SaveChangesAsync`
- **Vrati** novi `Id`

#### Korak C4: Controller — POST

---

### FAZA D — Backend: Update

#### Korak D1: Update Command + Validator + Handler

- Korisnik može mijenjati: broj, cijenu, narudžbu, **status**
- **Ključna logika:** Ako se status promijeni u `Dostavljena` → postavi `DeliveredAtUtc` na današnji datum
- **Razmisli:** Šta ako korisnik vrati status sa „Dostavljena" na nešto drugo? (Pročitaj zadatak — obično datum ostaje ili se briše; na ispitu prati tačan tekst)

#### Korak D2: Controller — PUT

- ID iz URL-a ima prednost nad ID u body-ju (vidi ProductsController)

---

### FAZA E — Backend: Delete

#### Korak E1: Delete Command + Handler

- **Otvori:** `DeleteProductCommandHandler.cs`
- Pronađi entitet po Id
- Ako ne postoji → `MarketNotFoundException`
- **Razmisli:** Da li je soft delete (`IsDeleted = true`) ili hard delete (`Remove`)? Pogledaj kako drugi moduli u projektu brišu zapise.

#### Korak E2: Controller — DELETE

---

### FAZA F — Frontend: API sloj

#### Korak F1: Models fajl

- **Otvori:** `products-api.models.ts` i `readme.md` u `api-services`
- Definiši: Request za listu, Response (PageResult), DTO za listu, Command za create/update, GetById DTO
- **Pravilo:** Tipovi moraju odgovarati backend DTO-ima (imena i tipovi polja)

#### Korak F2: Service fajl

- **Otvori:** `products-api.service.ts`
- Metode: `list`, `getById`, `create`, `update`, `delete`
- `baseUrl` = `/OrderShipments` (ili kako se zove tvoj Controller)
- **Bez** toast-a, **bez** subscribe — samo HTTP pozivi

---

### FAZA G — Frontend: Lista (`PosiljkeComponent`)

#### Korak G1: Ukloni hardkodirane podatke

- U `posiljke.component.ts` obriši niz `items = [...]`
- Naslijedi `BaseListPagedComponent` (kao Products)

#### Korak G2: Učitavanje podataka

- Injektuj API servis
- U `loadPagedData()` pozovi `api.list(this.request)`
- U `next` pozovi `handlePageResult(response)`

#### Korak G3: Filter po narudžbi (pretraga)

- Učitaj listu narudžbi preko `OrdersApiService` (već postoji u projektu)
- U HTML dodaj `mat-select` s opcijom „Sve narudžbe" (prazna vrijednost)
- Kad korisnik promijeni izbor → postavi `request.orderId` → `request.paging.page = 1` → `loadPagedData()`
- **Zašto page = 1?** Jer filter smanjuje broj stavki — stara stranica možda ne postoji

#### Korak G4: Paginacija u HTML-u

- Pogledaj `products.component.html` — kako su dugmad za stranice
- Poveži s `goToPage`, `nextPage`, `prevPage`

#### Korak G5: Akcije

- `onCreate()` → navigacija na `/admin/posiljke/add`
- `onEdit(item)` → navigacija na `/admin/posiljke/{id}/edit`
- `onDelete(item)` → vidi Fazu I

#### Korak G6: Formatiranje u templateu

- Cijena: jedna decimala
- Datum: pipe ili formatiranje u `dd.MM.yyyy`
- Status: badge s bojom (HTML već ima klase `status-{{ item.status }}`)

---

### FAZA H — Frontend: Dodavanje (`PosiljkaAddComponent`)

#### Korak H1: Reactive Form

- **Otvori:** `products-add.component.ts` i `product-form.service.ts`
- Napravi formu s poljima: broj pošiljke, cijena, narudžba (select)
- Validatori: `Validators.required`, min/max za cijenu

#### Korak H2: Učitaj narudžbe za dropdown

- Pozovi `OrdersApiService.list()` s velikim page size (pogledaj `largePaging` helper)

#### Korak H3: Dugme Sačuvaj

- `[disabled]="form.invalid || isLoading"`
- Info poruka: „Datum slanja i status se postavljaju automatski"

#### Korak H4: Submit

- Naslijedi `BaseFormComponent`
- U `save()` napravi Command objekt iz `form.value`
- Pozovi `api.create()`
- Uspjeh → `toaster.success(...)` + navigacija na listu
- Greška → `toaster.error(...)`

---

### FAZA I — Frontend: Uređivanje (`PosiljkaEditComponent`)

#### Korak I1: Učitaj podatke

- Iz rute uzmi `id` (`ActivatedRoute`)
- Pozovi `api.getById(id)`
- Popuni formu

#### Korak I2: Dodatno polje — Status

- Za razliku od Add forme, ovdje imaš dropdown za status
- Prikaži datume slanja i dostave kao **readonly** labele (ne input)

#### Korak I3: Logika statusa

- Info: „Ako se status promijeni u Dostavljeno, datum dostave se postavlja automatski"
- **Na frontendu** možeš prikazati poruku, ali **pravu logiku** radi backend Handler

#### Korak I4: Submit

- `api.update(id, command)` → toast → navigacija na listu

---

### FAZA J — Frontend: Brisanje

#### Korak J1: Modal potvrde

- **Otvori:** `products.component.ts` → metoda `onDelete`
- Koristi `dialogHelper.confirmDelete(item.shipmentNumber)` ili `confirmDelete` s imenom
- Tekst modala: „Da li ste sigurni da želite obrisati {naziv}?"

#### Korak J2: Ako korisnik potvrdi

- Pozovi `api.delete(id)`
- Uspjeh → toast + `loadPagedData()`
- Greška → toast s porukom

#### Korak J3: Ako korisnik otkaže

- Ništa — modal se sam zatvara

---

## 4. Objašnjenje pojmova (za Zadatak 1)

### LINQ

- **Šta je:** Način da pišeš upite nad kolekcijama/bazom u C#-u
- **Zašto:** U Handleru filtriraš, sortiraš i projiciraš podatke prije nego što ih pošalješ klijentu
- **Kada koristiti:** U svakom Query Handleru
- **Primjer (općenito, ne rješenje):** „Daj sve zapise gdje je polje X veće od 5, sortiraj po imenu"

### Lambda izrazi

- **Šta je:** Kratka funkcija: `x => x.Name`
- **Zašto:** Koristi se u LINQ-u: `.Where(x => x.OrderId == 3)`
- **Kada:** Kad filtriraš ili mapiraš u `Select`

### DbSet

- **Šta je:** „Tabela" u bazi dostupna kroz `IAppDbContext` — npr. `ctx.OrderShipments`
- **Zašto:** Preko njega čitaš i pišeš zapise
- **Kada:** U svakom Handleru koji radi s bazom

### Include

- **Šta je:** Učitava povezane entitete (npr. pošiljka + narudžba)
- **Zašto:** Kad ti treba `Order.ReferenceNumber` a imaš samo `OrderId`
- **Kada:** Kad navigaciono svojstvo nije automatski učitano
- **Alternativa u ovom projektu:** Često se koristi `Select` s join-om umjesto Include — pogledaj kako Products radi s `Category!.Name`

### Foreign Key (FK)

- **Šta je:** Broj koji povezuje dva entiteta — `OrderId` u pošiljci pokazuje na `Order.Id`
- **Zašto:** Baza zna kojoj narudžbi pripada pošiljka
- **Kada:** Kad šalješ `orderId` iz forme na backend

### Navigation Property

- **Šta je:** Objektni link — `OrderShipmentEntity.Order` vodi do `OrderEntity`
- **Zašto:** Možeš čitati podatke narudžbe bez ručnog join-a (uz Include ili Select)

### DTO (Data Transfer Object)

- **Šta je:** Klasa samo za prenos podataka API-jem
- **Zašto:** Ne izlažeš internu strukturu entiteta; šalješ samo potrebna polja
- **Kada:** Svaki Query i Command ima svoj DTO

### Validacija

- **Backend:** `AbstractValidator<T>` — FluentValidation, automatski se pokreće prije Handlera
- **Frontend:** `Validators.required`, `Validators.min` u Reactive Form
- **Zašto oba:** Frontend daje brz feedback; backend štiti API od loših podataka

### Event Handler (Angular)

- **Šta je:** Metoda koja se pozove na korisnikovu akciju
- **Primjer:** `(click)="onDelete(item)"` poziva metodu `onDelete`
- **Kada:** Na svakom dugmetu, submit forme, promjeni selecta

### Data Binding (Angular)

- **Šta je:** Povezivanje podataka iz komponente s prikazom
- **Jednosmjerno:** `{{ item.shipmentNumber }}` — iz koda u HTML
- **Dvosmjerno:** `[(ngModel)]` ili Reactive Forms `formControlName`

### ComboBox → mat-select

- **Šta je:** Padajući meni za izbor narudžbe ili statusa
- **Kada:** Filter na listi, polje Narudžba na formi, polje Status na edit formi

### DataGridView → mat-table

- **Šta je:** Tabela s kolonama i redovima
- **Kada:** Lista pošiljki — `mat-table` + `matColumnDef`

---

## 5. Vizuelni tok rješenja

### 5.1 Lista pošiljki (učitavanje)

```
Korisnik klikne "Pošiljke" u meniju
        ↓
Angular Router otvara PosiljkeComponent
        ↓
ngOnInit() → initList() → loadPagedData()
        ↓
OrderShipmentsApiService.list(request) — HTTP GET
        ↓
OrderShipmentsController prima ListOrderShipmentsQuery
        ↓
MediatR šalje query u ListOrderShipmentsQueryHandler
        ↓
Handler čita ctx.OrderShipments, filtrira, paginira, mapira u DTO
        ↓
Vraća PageResult (items, totalItems, totalPages)
        ↓
Komponenta: handlePageResult() → items se prikazuju u mat-table
```

**Šta se dešava u svakom koraku:**

1. **Router** — bira koja komponenta se prikazuje
2. **ngOnInit** — životni ciklus; dobar trenutak za učitavanje podataka
3. **API servis** — šalje HTTP zahtjev backendu
4. **Controller** — ulazna tačka API-ja; ne sadrži logiku, samo prosleđuje
5. **Handler** — prava poslovna logika i pristup bazi
6. **PageResult** — omot za listu + informacije o paginaciji
7. **Template** — Angular crta tabelu iz `items` niza

---

### 5.2 Dodavanje pošiljke

```
Korisnik klikne "Nova pošiljka"
        ↓
Router → PosiljkaAddComponent
        ↓
Učitaju se narudžbe za dropdown (OrdersApiService)
        ↓
Korisnik popuni formu
        ↓
Angular Validators provjeravaju polja (dugme disabled dok invalid)
        ↓
Korisnik klikne "Sačuvaj" → onSubmit() → save()
        ↓
HTTP POST /OrderShipments s CreateCommand
        ↓
ValidationBehavior pokreće CreateValidator
        ↓
CreateHandler: postavi status, datum slanja, snimi u bazu
        ↓
Vraća se novi Id
        ↓
toaster.success() + router.navigate na listu
        ↓
Lista se ponovo učitava — nova pošiljka je vidljiva
```

---

### 5.3 Uređivanje pošiljke

```
Korisnik klikne ikonu olovke na redu
        ↓
Router → /admin/posiljke/5/edit
        ↓
Edit komponenta čita id iz rute
        ↓
HTTP GET /OrderShipments/5 → popuni formu
        ↓
Korisnik mijenja podatke (npr. status → Dostavljena)
        ↓
HTTP PUT /OrderShipments/5
        ↓
UpdateHandler: ako je status Dostavljena → DeliveredAtUtc = danas
        ↓
toast + povratak na listu
```

---

### 5.4 Brisanje pošiljke

```
Korisnik klikne ikonu kante
        ↓
onDelete(item) → dialogHelper.confirmDelete(...)
        ↓
Prikazuje se modal "Da li ste sigurni...?"
        ↓
    ┌─────────────────┴─────────────────┐
    ↓                                   ↓
Korisnik klikne OTKAŽI          Korisnik klikne OBRIŠI
    ↓                                   ↓
Modal se zatvara                  HTTP DELETE /OrderShipments/{id}
Ništa se ne dešava                        ↓
                                  DeleteHandler briše zapis
                                        ↓
                                  toast uspjeh/greška
                                        ↓
                                  loadPagedData() — osvježi listu
```

---

## 6. Najčešće greške i debug

### Greške i kako ih izbjeći

| Greška | Simptom | Rješenje |
|--------|---------|----------|
| CORS / API ne radi | Network error u browseru | Provjeri da li backend radi; provjeri `environment.apiUrl` |
| 404 Not Found | Endpoint ne postoji | Provjeri ime Controllera i rutu; Swagger lista |
| 400 Bad Request | Validacija pala | Pročitaj response body; uskladi FE i BE tipove |
| Prazna tabela | Nema greške, nema podataka | Swagger GET — vraća li podatke? |
| Filter ne radi | Uvijek iste stavke | Da li šalješ `orderId` u query parametrima? |
| Paginacija „pukne" | Prazna stranica nakon filtera | Resetuj `page` na 1 |
| Datum pogrešan | Pomak za sat/dan | Backend koristi UTC — formatiraj na prikazu |
| Dugme uvijek disabled | Ne možeš sačuvati | `form.invalid`? Koja polja failaju? |
| Edit ne učitava | Prazna forma | Da li čitaš `id` iz rute? Da li GET vraća podatke? |

### Kako debugovati — redoslijed

1. **Swagger** — testiraj backend izolovan od frontenda
2. **Browser DevTools → Network** — vidi koji HTTP poziv pada i šta vraća
3. **Console** — Angular greške (često binding ili undefined)
4. **Breakpoint** u Handleru — ako imaš vremena na ispitu
5. **Uporedi s Products modulom** — „šta Products ima a ja nemam?"

### Checklist prije predaje

- [ ] Swagger: lista, getById, create, update, delete — svi rade
- [ ] Lista koristi API, nema hardkoda
- [ ] Paginacija mijenja stranice
- [ ] Filter po narudžbi radi i resetuje stranicu
- [ ] Add: automatski status i datum (provjeri u bazi / Swagger response)
- [ ] Edit: status Dostavljena postavlja datum dostave
- [ ] Delete: modal + toast + osvježena lista
- [ ] Validacija na formi i na backendu
- [ ] Toast na svakoj akciji (uspjeh i greška)

---

# Zadatak 2 — kako pristupiti drugom zadatku

U materijalima koje si poslala detaljno je opisan **Zadatak 1** (OrderShipment). Tekst **Zadatka 2** nije uključen u slike — ali metodologija je **ista**.

Kad dobiješ Zadatak 2 na ispitu:

## 1. Analiza (isto kao Zadatak 1)

- Podvuci ključne riječi: CRUD? Filter? Posebna poslovna logika?
- Identificiraj entitet — koja Entity klasa?
- Šta već postoji u starteru, šta moraš kreirati?

## 2. Pronađi uzor

- Uvijek prvo nađi **najsličniji gotov modul** u projektu
- Zadatak 1 (Pošiljke) će ti nakon rješavanja biti najbliži uzor
- Prije toga: Products ili Orders

## 3. Isti koraci

| Faza | Akcija |
|------|--------|
| Backend | Entity → DTO → Query/Command → Handler → Validator → Controller |
| Test | Swagger |
| Frontend | models → service → komponente |
| UI | forma, tabela, toast, modal ako traže brisanje |

## 4. Razlika može biti samo u

- Drugom entitetu
- Drugim poljima za validaciju
- Drugoj poslovnoj logici (npr. „ako je X, postavi Y")
- Drugom filteru (ne po narudžbi nego po nečem trećem)

**Savjet:** Kad dobiješ tekst Zadatka 2, prođi kroz ovaj dokument i za svaku sekciju Zadatka 1 upiši šta je analogno u Zadatku 2. To je najbrži način da ne zapneš.

---

# Rečnik pojmova

| Pojam | Jednostavno objašnjenje |
|-------|-------------------------|
| **API** | Most između frontenda i backenda — URL na koji šalješ zahtjeve |
| **Endpoint** | Jedan URL + HTTP metod (npr. GET `/OrderShipments`) |
| **CQRS** | Odvojeno čitanje (Query) i pisanje (Command) |
| **Command** | Nalog za promjenu podataka (create, update, delete) |
| **Query** | Zahtjev za čitanje podataka |
| **Handler** | Klasa koja izvršava Command ili Query |
| **MediatR** | Biblioteka koja povezuje Controller → Handler (`ISender.Send`) |
| **Controller** | Prima HTTP, šalje Command/Query u MediatR |
| **FluentValidation** | Biblioteka za pravila validacije na backendu |
| **Reactive Forms** | Angular forme s eksplicitnom kontrolom i validacijom |
| **Observable** | Angular/RxJS „stream" — rezultat HTTP poziva |
| **subscribe** | „Kad stigne odgovor, uradi ovo" |
| **inject** | Moderni način da komponenta dobije servis |
| **PageResult** | Objekat: lista stavki + ukupan broj + broj stranica |
| **Seed** | Početni testni podaci u bazi |
| **Swagger** | Web stranica za testiranje API-ja u browseru |

---

# Kako razmišljati na ispitu — kratka šema

```
┌─────────────────────────────────────────────────────────────┐
│  KORAK 1: Pročitaj zadatak 2 puta. Označi:                  │
│  • Koji entitet?                                            │
│  • Koje operacije (CRUD)?                                   │
│  • Šta je automatsko?                                       │
│  • Šta traže za UI (paginacija, filter, toast, modal)?      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  KORAK 2: Otvori Entity klasu — koja polja postoje?         │
│  Otvori enum ako postoji. Ne izmišljaj polja.               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  KORAK 3: Nađi uzor (Products). Pogledaj strukturu foldera. │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  KORAK 4: Backend — prvo LISTA u Swaggeru                   │
│  Tek kad lista radi → create → update → delete              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  KORAK 5: Frontend — API servis → lista → add → edit → del  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  KORAK 6: Ručni test cijelog toka kao korisnik              │
└─────────────────────────────────────────────────────────────┘
```

### Mantra za ispit

> **Ne pišem kod naslijpo. Svaku liniju znam zašto postoji.**

> **Ako nešto ne radi — prvo Swagger, pa Network tab, pa uporedi s Products.**

> **Profesor ne traži dizajn — traži funkcionalnost.**

---

## Dodatni resursi u tvom projektu

Ove datoteke su ti namijenjene kao pomoć (ne kopiraj slijepo na ispitu):

| Fajl | Za šta |
|------|--------|
| `rs1-frontend-2025-26/src/app/api-services/readme.md` | Pravila za API servise |
| `rs1-frontend-2025-26/.../products.component.ts` | Uzor za listu, delete, paginaciju |
| `rs1-frontend-2025-26/.../products-add.component.ts` | Uzor za add formu |
| `rs1_backend-2025-26/.../ProductsController.cs` | Uzor za kontroler |
| `rs1_backend-2025-26/.../ListProductsQueryHandler.cs` | Uzor za listu s filterom |

---

*Dokument kreiran za pripremu RS1 ispita — Modul 1. Ažuriraj sekciju Zadatka 2 kad dobiješ puni tekst zadatka.*
