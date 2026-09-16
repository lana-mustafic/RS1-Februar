# RS1 — Modul 2 — Kompletni vodič (februarski ispit)

> **Cilj ovog dokumenta:** Da razumiješ *logiku* rješavanja, a ne da slijepo kopiraš gotov kod.
> **Pravilo:** Prvo čitaj, razumij, zatim sama piši. Koristi postojeće fajlove u **ovom** projektu kao „udžbenik".
> **Pretpostavka:** Znaš osnove iz Modula 1 (CQRS, API servis, Reactive Forms, paginacija). Ovdje to koristiš, ali zadatak je **teži**.

---

## Sadržaj

1. [Uvod — šta je Modul 2?](#1-uvod--šta-je-modul-2)
2. [Šta ovaj vodič NIJE](#2-šta-ovaj-vodič-nije)
3. [Razlika između Modula 1 i Modula 2](#3-razlika-između-modula-1-i-modula-2)
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

## 1. Uvod — šta je Modul 2?

Na **februarskom** ispitu, Modul 2 je označen u sidebaru kao **„Uplata (Modul 2)"** i na listi piše:

> „Ovdje raditi ispitni zadatak - drugi modul"

Na papiru stoji otprilike: **„Zadatak 2 — Napredne funkcionalnosti — Upravljanje uplatama"**.

To **nije** drugi zadatak iz Modula 1. Modul 1 su **Pošiljke**. Modul 2 su **Uplate**.

### Šta radiš?

Administratorski modul u kojem korisnik:

1. **Vidi listu uplata** (broj uplate, broj narudžbe, datum kreiranja, ukupan iznos) s **paginacijom**.
2. **Kreira novu uplatu** na **master-detail** formi: jedna uplata (roditelj) + više **linija/stavki** (djeca).
3. Pri kreiranju, sistem **računa iznos** i **ažurira narudžbu** (koliko je plaćeno, koliki je dug, status `PartiallyPaid` ili `Paid`).

**Nema** uređivanja i **nema** brisanja uplata. Zadatak to eksplicitno kaže — ne troši vrijeme na Update/Delete.

### Master-detail, jednom rečenicom

Jedna uplata (`UplataEntity`) ima više linija (`UplataLinijaEntity`). U Angularu to je `FormGroup` + `FormArray`. U bazi to je relacija **1:N**. Jedan HTTP POST šalje cijelu uplatu odjednom.

---

## 2. Šta ovaj vodič NIJE

### Ovo NIJE januarski Modul 2

Januarski Modul 2 su bile **Fakture** (ulazna/izlazna, zalihe proizvoda).

U februarskom projektu **postoji** meni **Fakture**, ali to **nije** tvoj ispitni zadatak ovog modula.

**Ne radi Fakture. Radi Uplate.** Sidebar: **„Uplata (Modul 2)"**.

### Ovo NIJE Modul 1

Ne radi Pošiljke ovdje. Ne dodaješ edit/delete kolone „jer su bile u Modulu 1".

### Šta NE smiješ izmišljati

Ako to **ne piše** u februarskom zadatku:

- Update/Delete uplate
- Filter na listi uplata
- GetById za uplatu
- mijenjanje zaliha proizvoda (`StockQuantity`) — to je januarski ispit
- cache kataloga
- novi enum za način plaćanja (već postoji `NacinPlacanjaType`)
- novi `UplataEntity` od nule (već postoji — samo mu **nedostaju linije**)

---

## 3. Razlika između Modula 1 i Modula 2

| | Modul 1 (Pošiljke) | Modul 2 (Uplate) |
|---|-------------------|------------------|
| Operacije | Create, Read, Update, Delete | **Samo lista + Create** |
| Forma | Jednostavan `FormGroup` | `FormGroup` + **`FormArray`** |
| Novi entitet | Ne (već postojao) | **Da** — `UplataLinijaEntity` + migracija |
| Veza | FK na narudžbu | FK + **ažuriranje narudžbe** |
| Paginacija | Da | Da — u starteru je **pokvarena**, moraš je popraviti |
| Modal za brisanje | Da | **Ne treba** |
| Težina | CRUD obrazac | Poslovna logika u Handleru |

Ako si uradila Modul 1, već znaš CQRS i API servis. Ovdje je novi dio: **1:N**, **FormArray**, **računanje iznosa**, **promjena statusa narudžbe**.

---

## 4. Šta starter već ima, a šta ti moraš napraviti

### Već postoji

| Šta | Gdje |
|-----|------|
| `UplataEntity` (bez kolekcije linija) | `Market.Domain/Entities/Sales/UplataEntity.cs` |
| Enum `NacinPlacanjaType` (`Kes = 1`, `Kartica = 2`) | `NacinPlacanjaType.cs` |
| `OrderEntity` s `TotalAmount`, `TotalAmountPaid`, `BalanceDue`, `Status`, `PaidAtUtc` | `OrderEntity.cs` |
| `OrderStatusType.Paid = 3`, `PartiallyPaid = 6` | `OrderStatusType.cs` |
| `OrderItemEntity` (proizvod, količina, `UnitPrice`, popust, `Total`) | `OrderItemEntity.cs` |
| `DbSet<UplataEntity> Uplate` | `DatabaseContext` + `IAppDbContext` |
| EF config za uplatu | `UplataConfiguration.cs` |
| Lista CQRS | `Modules/Sales/Uplate/Queries/List/` |
| `UplateController` — **samo GET** | `Market.API/Controllers/UplateController.cs` |
| Endpoint narudžbi sa stavkama | `GET /Orders/with-items` |
| Seed 3 uplate **bez linija** | `DynamicDataSeeder.SeedUplateAsync` |
| Sidebar + rute `uplate` i `uplate/add` | admin layout / routing |
| Lista HTML (tabela, bez paginatora, bez edit/delete) | `uplate.component.html` |
| Add HTML (izgled forme, **bez** `formControlName`) | `uplata-add.component.html` |
| Add TS: `FormArray` skelet, prazan `ngOnInit` i `onSubmit` | `uplata-add.component.ts` |
| API servis: samo `list(pageNumber, pageSize)` s **pogrešnim** query parametrima | `uplate-api.service.ts` |
| Enum na FE | `uplate-api.models.ts` |

### Ti moraš napraviti / popraviti

**Backend**

- Novi entitet `UplataLinijaEntity`
- Kolekcija linija na `UplataEntity`
- EF konfiguracija + `DbSet` u Context i `IAppDbContext`
- Migracija (aplikacija sama radi `MigrateAsync` pri startu)
- `CreateUplataCommand` + Handler + Validator
- `POST` u `UplateController`

**Frontend**

- `CreateUplataCommand` u models + `create()` u servisu
- Popraviti listu: pravi `paging.page` / `paging.pageSize` + `app-fit-paginator-bar`
- Učitati narudžbe (`listWithItems`)
- Staviti `formControlName`, opcije za način plaćanja, validatore, submit + toast
- Uskladiti imena polja proizvoda s backend DTO-om (`productId` / `productName`)

### Šta je namjerno pokvareno (profesor to očekuje da vidiš)

1. `UplataEntity` **nema** kolekciju linija.
2. `narudzbe = []` i `ngOnInit` je prazan — dropdown narudžbi je prazan.
3. Lista zove `list(1, 100)` i šalje `Paging.PageNumber` — backend očekuje `Paging.Page`. Paginacija UI ne postoji.
4. `mat-select` za način plaćanja **nema** `mat-option`.
5. Inputi **nemaju** `formControlName`.
6. `onSubmit()` je prazan.
7. HTML koristi `item.product.id` i `item.product.name`, a backend za `GET /Orders/with-items` vraća `product.productId` i `product.productName`.

---

## 5. Kako je organizovan projekat

Isti dva foldera kao Modul 1:

```
2026-02-16/
├── rs1_backend-2025-26/
└── rs1-frontend-2025-26/
```

### Backend — gdje šta tražiti

| Šta | Putanja |
|-----|---------|
| Entitet uplate | `Market.Domain/Entities/Sales/UplataEntity.cs` |
| **Novi entitet linije** | isti folder — **kreiraš** `UplataLinijaEntity.cs` |
| Narudžba | `OrderEntity.cs` |
| Stavka narudžbe | `OrderItemEntity.cs` |
| Način plaćanja | `NacinPlacanjaType.cs` |
| Status narudžbe | `OrderStatusType.cs` |
| Cijena proizvoda | `Market.Domain/Entities/Catalog/ProductEntity.cs` → `Price` |
| `IAppDbContext` | `Market.Application/Abstractions/IAppDbContext.cs` |
| DbContext | `Market.Infrastructure/Database/DatabaseContext.cs` |
| Uzor 1:N EF | `OrderItemConfiguration.cs` (`HasOne` + `WithMany` + Cascade) |
| Lista uplata (gotova) | `Market.Application/Modules/Sales/Uplate/Queries/List/` |
| **Create (tvoj kod)** | `.../Uplate/Commands/Create/` ← **kreiraš** |
| Uzor složenog Create | `Modules/Sales/Orders/Commands/Create/CreateOrderCommandHandler.cs` |
| Narudžbe sa stavkama | `Modules/Sales/Orders/Queries/ListWithItems/` |
| Kontroler | `Market.API/Controllers/UplateController.cs` |
| Seed | `DynamicDataSeeder.cs` → `SeedUplateAsync` |

### Frontend — gdje šta tražiti

| Šta | Putanja |
|-----|---------|
| Lista | `src/app/modules/admin/uplate/uplate.component.*` |
| Add forma | `.../uplate/uplata-add/` |
| API uplata | `src/app/api-services/uplate/` |
| API narudžbi | `src/app/api-services/orders/` |
| Uzor paginacije | `catalogs/products/products.component.ts` + `app-fit-paginator-bar` |
| Toast | `core/services/toaster.service.ts` |
| `largePaging` | `core/models/paging/paging-utils.ts` |
| `buildHttpParams` | `core/models/build-http-params.ts` |

### Relacija koju moraš imati u glavi

```
Order (1) ──< (N) Uplata (1) ──< (N) UplataLinija
  │                                      │
  │                                      └──> Product
  └──< (N) OrderItem ──> Product
```

- Proizvod na liniji uplate **mora** biti jedan od proizvoda na **odabranoj narudžbi**.
- Iznos se računa iz **cijene proizvoda bez popusta**, ne iz `OrderItem.Total`.

---

## 6. Mapa pojmova

| Pojam s vježbi | U ovom projektu |
|----------------|-----------------|
| Forma | `uplate` (lista), `uplata-add` (master-detail) |
| ComboBox | `mat-select` (narudžba, proizvod, način plaćanja) |
| DataGridView | `mat-table` |
| BindingSource | `FormGroup` + `FormArray` |
| MessageBox | `ToasterService` |
| Repository | Nema — `IAppDbContext` |
| Master-detail | Uplata + linije; `FormArray` |

---

## 7. Kako čitati zadatak

Pročitaj tekst **tri puta**:

1. Šta korisnik vidi i klikće?
2. Koja polja su obavezna?
3. Šta se dešava **u pozadini** kad se uplata snimi?

Podvuci: *automatski*, *mora*, *nije potrebno*, *bez popusta*, *paginacija*.

### Lista (Read)

- Kolone: **broj uplate**, **broj narudžbe**, **datum kreiranja**, **ukupan iznos**.
- Paginacija (stranica + broj zapisa po stranici).
- Dugme **Nova uplata**.
- **Bez** edit/delete kolona.

### Forma (Create)

**Roditelj**

| Polje | Obavezno |
|-------|----------|
| Broj uplate | Da (max 20, vidi `Constraints`) |
| Narudžba | Da |
| Napomena | Ne (max 500) |

**Djeca (barem jedna stavka)**

| Polje | Obavezno | Napomena |
|-------|----------|----------|
| Proizvod | Da | Samo proizvodi **odabrane** narudžbe |
| Količina | Da | ≥ 1 |
| Način plaćanja | Da | `Kes` ili `Kartica` |

Korisnik dodaje/uklanja stavke dugmetom „Dodaj stavku".

### Poslovna logika pri Create

1. **UkupanIznos** = zbroj linija.
2. Iznos linije = **količina × jedinična cijena proizvoda, BEZ popusta**.
   - Uzmi `Product.Price` ili `OrderItem.UnitPrice`.
   - **Ne uzimaj** `OrderItem.Total` ni `DiscountAmount`.
3. Ažuriraj narudžbu:
   - `TotalAmountPaid` += `UkupanIznos`
   - `BalanceDue` = `TotalAmount` − `TotalAmountPaid`
   - ako `BalanceDue > 0` → `Status = PartiallyPaid`
   - ako `BalanceDue == 0` → `Status = Paid` (ako zadatak spominje datum plaćanja, postavi i `PaidAtUtc`)
4. **Merge linija:**
   - isti proizvod + **isti** način plaćanja → **saberi količine**, jedna linija
   - isti proizvod + **različit** način → **odvojene** linije

Ova logika ide u **Handler**, ne u Angular.

### Ključne riječi

| Riječ | Šta radiš |
|-------|-----------|
| Master-detail / linija uplate | Novi entitet + `FormArray` |
| PartiallyPaid / Paid | Mijenjaš `Order.Status` |
| BalanceDue | Računaš na backendu |
| Bez popusta | `Product.Price` / `UnitPrice`, ne `Total` |
| Nije potrebno edit/delete | Ne radiš to |
| Paginacija | Popravi starter — trenutno ne radi |

---

## 8. Opšta strategija

```
1. Pročitaj zadatak — posebno izračun i status narudžbe
2. Domain: UplataLinijaEntity + kolekcija na UplataEntity
3. Infrastructure: EF config + DbSet + migracija
4. Backend Create (najteži dio) → Swagger POST
5. Provjeri narudžbu u bazi / GET Orders/{id}
6. Frontend: popravi listu (paginacija)
7. Frontend: forma (binding, narudžbe, submit)
8. Ručni test cijelog toka
```

**Zašto prvo baza i Handler?** Bez tabele linija ne možeš snimiti stavke. Bez POST-a frontend nema kuda slati. Frontend **ne smije** sam mijenjati `TotalAmountPaid`.

---

## 9. Backend — korak po korak

U Application fajlovima koji koriste Sales entitete dodaj:

`using Market.Domain.Entities.Sales;`

MediatR/FluentValidation se registruju sami. Ne diraš `Program.cs`.

---

### FAZA A — Pročitaj postojeće (ne pišeš još)

#### Korak A1: `UplataEntity.cs`

Polja: `BrojUplate`, `OrderId`, `Order`, `Napomena`, `UkupanIznos`.

`Constraints`: `BrojUplateMaxLength = 20`, `NapomenaMaxLength = 500`.

**Nema linija.** To dodaješ.

Nasljeđuje `BaseEntity` → `Id`, `IsDeleted`, `CreatedAtUtc`, `ModifiedAtUtc`. Datum na listi dolazi iz `CreatedAtUtc` (handler ga mapira u `DatumKreiranja`).

#### Korak A2: `OrderEntity.cs`

Ovo **ti ažuriraš** u Create Handleru:

- `TotalAmount` — ukupan iznos narudžbe (ne diraj osim ako zadatak kaže)
- `TotalAmountPaid` — sabiraš uplate
- `BalanceDue` — preostali dug
- `Status` — `Paid` / `PartiallyPaid`
- `PaidAtUtc` — opciono kad je potpuno plaćeno
- `Items` — stavke narudžbe (da znaš koji proizvodi smiju na uplatu)

#### Korak A3: `OrderItemEntity.cs`

- `ProductId`, `Quantity`, `UnitPrice` (cijena bez popusta u trenutku narudžbe)
- `Total` = s popustom ← **ne koristi za uplatu**

#### Korak A4: Enumi

`NacinPlacanjaType`: `Kes = 1`, `Kartica = 2`.

`OrderStatusType`: `Paid = 3`, `PartiallyPaid = 6`.

#### Korak A5: Lista je već gotova

Otvori `ListUplateQueryHandler.cs`. Već radi `AsNoTracking`, sort po `CreatedAtUtc` descending, `Select` u DTO, `PageResult`.

**Ne diraj listu na backendu** osim ako nešto stvarno ne radi. Posao na listi je uglavnom **frontend paginacija**.

#### Korak A6: Uzor 1:N

Otvori `OrderItemEntity` + `OrderItemConfiguration`:

- `OrderId` + navigacija `Order`
- `WithMany(x => x.Items)`
- `OnDelete(Cascade)` kad se briše roditelj

Linija uplate prati isti obrazac prema `Uplata`.

---

### FAZA B — Domain: `UplataLinijaEntity`

#### Korak B1: Novi fajl

**Gdje:** `Market.Domain/Entities/Sales/UplataLinijaEntity.cs`

**Uzor:** `OrderItemEntity.cs`

**Šta treba imati:**

| Property | Tip | Zašto |
|----------|-----|--------|
| `UplataId` | `int` | FK na uplatu |
| `Uplata` | `UplataEntity?` | navigacija |
| `ProductId` | `int` | koji proizvod se plaća |
| `Product` | `ProductEntity?` | navigacija (opciono, korisno) |
| `Kolicina` | `decimal` ili `int` | uskladi s `OrderItem.Quantity` (`decimal`) |
| `NacinPlacanja` | `NacinPlacanjaType` | Keš / Kartica |
| `Iznos` | `decimal` | količina × cijena bez popusta — olakšava debug |

Naslijedi `BaseEntity`.

**Šta NE radiš:** ne praviš novi enum; ne praviš posebnu tabelu načina plaćanja.

Primjer obrasca:

```csharp
using Market.Domain.Common;
using Market.Domain.Entities.Catalog;

namespace Market.Domain.Entities.Sales;

public class UplataLinijaEntity : BaseEntity
{
    public required int UplataId { get; set; }
    public UplataEntity? Uplata { get; set; }

    public required int ProductId { get; set; }
    public ProductEntity? Product { get; set; }

    public required decimal Kolicina { get; set; }
    public required NacinPlacanjaType NacinPlacanja { get; set; }
    public required decimal Iznos { get; set; }
}
```

#### Korak B2: Kolekcija na `UplataEntity`

Kao `OrderEntity.Items`:

```csharp
public IReadOnlyCollection<UplataLinijaEntity> Linije { get; set; }
    = new List<UplataLinijaEntity>();
```

**Provjera:** build Domain projekta prolazi.

---

### FAZA C — Infrastructure: baza

#### Korak C1: `UplataLinijaConfiguration.cs`

**Gdje:** `Market.Infrastructure/Database/Configurations/Sales/`

**Uzor:** `OrderItemConfiguration.cs`

- Tabela npr. `UplataLinije`
- `HasOne(x => x.Uplata).WithMany(x => x.Linije).HasForeignKey(x => x.UplataId).OnDelete(Cascade)`
  - Cascade: linije žive i umiru s uplatom (nemaš Delete u zadatku, ali EF treba znati vezu)
- `HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(Restrict)`
  - Restrict: ne briši proizvod ako postoji linija

EF `ApplyConfigurationsFromAssembly` pokupi fajl sam — ne registruješ ručno.

#### Korak C2: `DbSet`

U **oba** mjesta:

- `DatabaseContext.cs`
- `IAppDbContext.cs`

```csharp
DbSet<UplataLinijaEntity> UplataLinije { get; }   // interfejs
public DbSet<UplataLinijaEntity> UplataLinije => Set<UplataLinijaEntity>(); // context
```

Bez `IAppDbContext` Handler ne vidi `ctx.UplataLinije`.

#### Korak C3: Migracija

Aplikacija pri startu radi `ctx.Database.MigrateAsync()` (`DatabaseInitializer.cs`). **Moraš dodati migraciju**, inače tabela ne postoji.

Iz foldera `rs1_backend-2025-26`:

```
dotnet ef migrations add AddUplataLinije --project Market.Infrastructure --startup-project Market.API
```

Zatim pokreni API — sam uradi update.

Ako `dotnet ef` nije prepoznat:

```
dotnet tool install --global dotnet-ef
```

**Šta NE radiš:** ne pišeš SQL ručno; ne brišeš stare migracije.

#### Korak C4: Seed — opciono

`SeedUplateAsync` pravi 3 uplate bez linija i hardkodira `UkupanIznos`. Ako je baza već seedana, `AnyAsync()` sprečava ponovni seed.

**Na ispitu:** ne gubi 20 minuta na seed. Lista i ovako ima 3 reda. Fokusiraj se da **novi POST** snimi linije i izračuna iznos. Seed doteraj samo ako stigneš.

**Provjera:** API se podigne bez greške; u SSMS-u vidiš tabelu `UplataLinije`.

---

### FAZA D — Create Command (srž zadatka)

**Gdje:** `Market.Application/Modules/Sales/Uplate/Commands/Create/`

Uzor strukture: `Products/Commands/Create/`  
Uzor logike s više entiteta: `CreateOrderCommandHandler.cs`  
**Ne kopiraj** 5% popusta iz Create Order u uplatu.

#### Korak D1: `CreateUplataCommand`

Jedan POST = cijela uplata.

```csharp
public class CreateUplataCommand : IRequest<int>
{
    public string BrojUplate { get; set; }
    public int OrderId { get; set; }
    public string? Napomena { get; set; }
    public List<CreateUplataCommandItem> Items { get; set; } = [];
}

public class CreateUplataCommandItem
{
    public int ProductId { get; set; }
    public decimal Kolicina { get; set; }
    public NacinPlacanjaType NacinPlacanja { get; set; }
}
```

Ime `Items` neka se poklapa s Angular `form.value.items`.

#### Korak D2: Validator

Uzor: `CreateProductCommandValidator.cs`  
Za listu: FluentValidation `RuleForEach`.

Pravila:

- `BrojUplate`: `NotEmpty`, `MaximumLength(UplataEntity.Constraints.BrojUplateMaxLength)`
- `OrderId`: `GreaterThan(0)`
- `Napomena`: `MaximumLength(500)` kad nije prazna
- `Items`: `NotEmpty()` — barem jedna stavka
- svaka stavka: `ProductId > 0`, `Kolicina >= 1`, `NacinPlacanja` `IsInEnum()`

Ovo hvata loš JSON. **Poslovna** pravila (proizvod mora biti na narudžbi) idu u Handler jer trebaš bazu.

#### Korak D3: Handler — redoslijed

Ovo je najvažniji kod Modula 2. Radi **jedan** `SaveChangesAsync` na kraju.

**1. Učitaj narudžbu sa stavkama i proizvodima**

```csharp
var order = await ctx.Orders
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .FirstOrDefaultAsync(o => o.Id == request.OrderId, ct);
```

Ako nema → `MarketNotFoundException`.

**2. Validiraj svaku stavku**

- `ProductId` mora postojati u `order.Items`
- količina ≥ 1
- ako zadatak kaže da ne smiješ platiti više nego što je naručeno: uporedi s `OrderItem.Quantity` (i eventualno već plaćenim — na ispitu obično stači „ne veće od količine na narudžbi")

Ako pravilo padne → `MarketBusinessRuleException("uplata.invalid-item", "poruka")` (409) ili `ValidationException` (400). Budi konzistentna.

**3. Spoji linije (merge)**

Grupiraj `request.Items` po `(ProductId, NacinPlacanja)` i saberi `Kolicina`.

LINQ ideja: `GroupBy(x => new { x.ProductId, x.NacinPlacanja })` pa `Sum` količine.

**4. Izračunaj iznos svake spojene linije**

Nađi `OrderItem` za taj `ProductId`.

```
cijena = item.Product.Price   // ili item.UnitPrice
iznos  = Round(kolicina * cijena)
```

`CreateOrderCommandHandler` ima `RoundMoney` na 2 decimale — možeš isti trik.

**Ne koristi** `item.Total`.

**5. `UkupanIznos` = zbroj `Iznos` svih linija**

**6. Kreiraj `UplataEntity`**

`BrojUplate.Trim()`, `OrderId`, `Napomena`, `UkupanIznos`.

Linije: ili `ctx.UplataLinije.Add(...)` uz postavljen `Uplata` navigacijski property, ili napuni listu i veži na `uplata.Linije`.

`CreatedAtUtc` postavlja audit u `SaveChanges`.

**7. Ažuriraj narudžbu**

```
order.TotalAmountPaid += ukupanIznos
order.BalanceDue = order.TotalAmount - order.TotalAmountPaid
```

- `BalanceDue > 0` → `PartiallyPaid`
- `BalanceDue == 0` → `Paid`, po potrebi `PaidAtUtc = DateTime.UtcNow`
- `BalanceDue < 0` → preplata; ako zadatak to zabranjuje, baci exception **prije** snimanja

**8. `await ctx.SaveChangesAsync(ct)` jednom**

Vraća `uplata.Id`.

Jedna transakcija: ako nešto baci exception prije Save, ništa se ne snimi. Ako baciš **poslije** Save, kasno je. Zato sve provjere idu **prije**.

**Šta NE kopiraš iz Products/Orders:**

- `ICatalogCacheVersionService`
- 5% popusta
- `StockQuantity`

#### Korak D4: POST u kontroler

Otvori `UplateController.cs` (sada samo GET). Dodaj kao `ProductsController.Create`:

```csharp
[HttpPost]
[Authorize(Policy = "Staff")]
public async Task<ActionResult<int>> Create(CreateUplataCommand command, CancellationToken ct)
{
    int id = await sender.Send(command, ct);
    return Ok(new { id }); // ili CreatedAtAction ako dodaš GetById — nije obavezan
}
```

GetById **nije** u zadatku. `Ok(new { id })` je dovoljno. `CreatedAtAction` traži GetById — ne komplikuj.

Lista GET već radi; ostavi je.

#### Korak D5: Test u Swaggeru — OBAVEZNO prije frontenda

Authorize (npr. `string` / `string`).

Primjer tijela (prilagodi `orderId` i `productId` iz `GET /Orders/with-items`):

```json
{
  "brojUplate": "UPL-TEST-01",
  "orderId": 1,
  "napomena": "test",
  "items": [
    { "productId": 1, "kolicina": 1, "nacinPlacanja": 1 },
    { "productId": 1, "kolicina": 1, "nacinPlacanja": 1 }
  ]
}
```

Druga dva itema isti proizvod + isti način → u bazi **jedna** linija s količinom 2.

Provjeri:

- `GET /Uplate` — nova uplata, `ukupanIznos` ima smisla
- `GET /Orders/{id}` — `totalAmountPaid`, `balanceDue`, `status`
- SSMS: redovi u `UplataLinije`

Prazan `items` → 400. Pogrešan proizvod → 400/409. Nepostojeći `orderId` → 404.

---

## 10. Frontend — korak po korak

Rute i `AdminModule` već postoje. Ne dodaješ rutu.

---

### FAZA E — API sloj

#### Korak E1: Models

Otvori `uplate-api.models.ts`. Dodaj:

```ts
export interface CreateUplataCommandItem {
  productId: number;
  kolicina: number;
  nacinPlacanja: NacinPlacanjaType;
}

export interface CreateUplataCommand {
  brojUplate: string;
  orderId: number;
  napomena?: string | null;
  items: CreateUplataCommandItem[];
}
```

Za listu, bolje kao Products:

```ts
export class ListUplateRequest extends BasePagedQuery {}
```

`NacinPlacanjaType` već postoji (`Kes = 1`, `Kartica = 2`).

#### Korak E2: Service — popravi `list` i dodaj `create`

**Problem trenutnog `list`:** šalje `Paging.PageNumber`. Backend `PageRequest` ima **`Page`**, ne `PageNumber`. Zato paginacija ne radi kako treba.

**Rješenje:** kao `products-api.service.ts`:

```ts
list(request?: ListUplateRequest): Observable<ListUplateResponse> {
  const params = request ? buildHttpParams(request as any) : undefined;
  return this.http.get<ListUplateResponse>(this.baseUrl, { params });
}

create(payload: CreateUplataCommand): Observable<{ id: number } | number> {
  return this.http.post<{ id: number }>(this.baseUrl, payload);
}
```

Bez `subscribe`, bez toast-a.

`buildHttpParams` pretvara `paging.page` u `paging.page=1` — to backend veže.

#### Korak E3: Imena proizvoda na narudžbi

Otvori backend `ListOrdersWithItemsQueryDtoItemProduct`:

- `ProductId`, `ProductName`, `ProductCategoryName`

Otvori frontend `orders-api.models.ts` — tamo stoji `id`, `name`, `price` — **ne odgovara**.

Otvori `uplata-add.component.html`:

```html
[value]="item.product.id"
{{ item.product.name }}
```

To **neće** raditi s pravim API-jem.

**Uradi jedno od ovoga (konzistentno):**

- uskladi FE model s backendom (`productId`, `productName`) i HTML na `item.product.productId` / `item.product.productName`
- ili u komponenti mapiraj odgovor

Najmanje iznenađenja: **ispravi model + HTML**.

Backend **ne šalje** `price` u tom DTO-u. Iznos računa Handler. Dropdownu treba samo id + naziv.

---

### FAZA F — Lista + paginacija

Profesor **posebno** gleda paginaciju. Starter je namjerno slab.

#### Korak F1: Šta otvoriti

| Fajl | Zašto |
|------|--------|
| `uplate.component.ts` | `list(1, 100)` — zamijeni |
| `uplate.component.html` | nema paginator |
| `products.component.ts` | uzor `BaseListPagedComponent` |
| `products.component.html` | `<app-fit-paginator-bar [vm]="this" />` |

#### Korak F2: TS

Naslijedi:

```ts
export class UplateComponent
  extends BaseListPagedComponent<ListUplateQueryDto, ListUplateRequest>
  implements OnInit
```

- `this.request = new ListUplateRequest();`
- `this.request.paging.pageSize = 10;` — seed ima 3 uplate; nakon Create ćeš lakše vidjeti stranice ako smanjiš npr. na 2 za demo, ali 10 je OK
- `ngOnInit`: `this.initList();`
- `loadPagedData()`: `api.list(this.request)` → `handlePageResult(response)`
- `onNovaUplata()` već navigira na `/admin/uplate/add` — ostavi

Obriši ručni niz `uplate` ako pređeš na `items` iz bazne klase.

HTML trenutno ima `[dataSource]="uplate"`. Promijeni u `items` **ili** ostavi alias. Bitno da tabela koristi ono što puni `handlePageResult`.

#### Korak F3: HTML paginator

Ispod tabele, u `table-card`:

```html
<app-fit-paginator-bar [vm]="this" />
```

**Ne dodaj** kolone edit/delete.

Datum: starter ima `| date`. Možeš `| date:'dd.MM.yyyy'` da bude urednije. Iznos: `| number:'1.2-2'`.

**Test:** Network tab — URL mora sadržavati `paging.page` i `paging.pageSize`, ne `Paging.PageNumber`. Promjena „Po stranici" ponovo zove API.

---

### FAZA G — Forma (master-detail)

Starter je **napola urađen**. Ne briši cijeli fajl. Dopuni.

#### Korak G1: Šta već ima TS

- `FormGroup`: `brojUplate`, `orderId`, `napomena`, `items` (`FormArray`)
- `addItem()` / `removeItem()`
- `onOrderChange` puni `selectedOrderItems` iz `narudzbe`
- `narudzbe = []` — **nikad se ne puni**
- `onSubmit()` prazan
- `ToasterService` je importan, ali **nije injektovan**
- `NacinPlacanja` interfejs postoji, **nema niza opcija**
- nisu injektovani `OrdersApiService` ni `UplateApiService`

#### Korak G2: `ngOnInit` — učitaj narudžbe

```ts
private ordersApi = inject(OrdersApiService);
private uplateApi = inject(UplateApiService);
private toaster = inject(ToasterService);

ngOnInit(): void {
  this.ordersApi.listWithItems({ paging: largePaging }).subscribe({
    next: (res) => this.narudzbe = res.items,
    error: () => this.toaster.error('Greška pri učitavanju narudžbi')
  });
}
```

**Zašto `listWithItems` a ne `list`?** Dropdown proizvoda treba `order.items`. Običan `GET /Orders` nema stavke.

Admin vidi sve narudžbe (handler filtrira na usera samo ako nisi admin).

#### Korak G3: Validators

U konstruktoru, umjesto praznih `['']`:

- `brojUplate`: `Validators.required`, `Validators.maxLength(20)`
- `orderId`: `Validators.required`
- `napomena`: `Validators.maxLength(500)`
- svaki item: `productId` required, `kolicina` required + `min(1)`, `nacinPlacanja` required

Dugme Sačuvaj već ima `[disabled]="form.invalid || isSaving || isLoading"`. Bez validatora forma je „validna" i šalje prazninu.

Početne dvije prazne stavke: zadatak traži barem jednu. Možeš ostaviti jednu ili dvije, ali validatori moraju spriječiti prazan submit. `removeItem` neka ne ostavi nula stavki, ili validator `Items.NotEmpty` na backendu to uhvati.

#### Korak G4: Niz za način plaćanja

```ts
nacinPlacanjaOptions: NacinPlacanja[] = [
  { id: NacinPlacanjaType.Kes, name: 'Keš' },
  { id: NacinPlacanjaType.Kartica, name: 'Kartica' }
];
```

#### Korak G5: HTML — `formControlName` (bez ovoga forma ne radi)

| Polje | Šta dodati |
|-------|------------|
| Broj uplate `<input>` | `formControlName="brojUplate"` |
| Narudžba `<mat-select>` | `formControlName="orderId"` (već ima `selectionChange`) |
| Napomena `<textarea>` | `formControlName="napomena"` |
| Proizvod `<mat-select>` | `formControlName="productId"` |
| Količina `<input>` | `formControlName="kolicina"` |
| Način plaćanja `<mat-select>` | `formControlName="nacinPlacanja"` + `mat-option` |

Za način plaćanja:

```html
<mat-option *ngFor="let n of nacinPlacanjaOptions" [value]="n.id">
  {{ n.name }}
</mat-option>
```

`[value]` mora biti **broj** 1 ili 2, ne string `"Kes"`.

Za proizvod, nakon usklađivanja modela:

```html
[value]="item.product.productId"
{{ item.product.productName }}
```

`formArrayName="items"` i `[formGroupName]="i"` već postoje — ne diraj tu strukturu.

#### Korak G6: `onOrderChange`

Već postoji. Kad se promijeni narudžba:

- resetuj `items` (npr. obriši pa `addItem()`), da ne ostane proizvod s prethodne narudžbe
- `selectedOrderItems = order.items`

Ako korisnik nije odabrao narudžbu, dropdown proizvoda je prazan — to je OK.

#### Korak G7: `onSubmit`

```
1. form.markAllAsTouched()
2. ako invalid → return
3. isSaving = true
4. command iz form.value (orderId i productId kao number, nacinPlacanja kao number)
5. uplateApi.create(command).subscribe
6. next: toaster.success + navigate /admin/uplate
7. error: toaster.error + isSaving = false
```

Merge **prepusti backendu**. Ako spojiš i na FE, OK, ali profesor testira POST.

`orderId` iz `mat-select` ponekad dođe kao string. Ako backend zajebe, uradi `Number(this.form.value.orderId)`.

---

## 11. Vizuelni tok rješenja

### 11.1 Lista

```
Sidebar „Uplata (Modul 2)"
        ↓
UplateComponent → initList → loadPagedData
        ↓
GET /Uplate?paging.page=1&paging.pageSize=10
        ↓
ListUplateQueryHandler (već gotov)
        ↓
handlePageResult → mat-table + fit-paginator-bar
```

### 11.2 Otvaranje forme

```
Nova uplata → /admin/uplate/add
        ↓
ngOnInit → GET /Orders/with-items
        ↓
narudzbe[] pun → dropdown narudžbi
```

### 11.3 Popunjavanje

```
Broj uplate → formControlName
        ↓
Odabir narudžbe → onOrderChange → selectedOrderItems
        ↓
Dropdown proizvoda samo ta narudžba
        ↓
Stavka: proizvod, količina, Keš/Kartica
        ↓
Dodaj stavku → nova grupa u FormArray
        ↓
form.valid → Sačuvaj aktivan
```

### 11.4 Snimanje

```
onSubmit → POST /Uplate
        ↓
Validator (prazna lista, max dužine)
        ↓
Handler:
    učitaj Order + Items + Product
    validiraj proizvode
    spoji (ProductId, NacinPlacanja)
    iznos = količina × cijena BEZ popusta
    snimi Uplata + Linije
    ažuriraj TotalAmountPaid, BalanceDue, Status
    SaveChangesAsync jednom
        ↓
toast + lista → nova uplata vidljiva
```

---

## 12. Kako testirati

### Swagger (prije Angulara)

| Test | Očekivano |
|------|-----------|
| GET /Uplate | 3 seed uplate |
| POST validan, 1 stavka | 200/201 + id; lista ima novi red; iznos = količina × Price |
| POST dvije stavke isti proizvod + isti način | 1 linija u bazi, sabrana količina |
| POST isti proizvod, Keš + Kartica | 2 linije |
| POST prazan items | 400 |
| POST proizvod koji nije na narudžbi | 400/409 |
| POST pa GET Order | `totalAmountPaid` porastao; status PartiallyPaid ili Paid |
| Djelomična uplata | `PartiallyPaid`, `balanceDue > 0` |
| Uplata koja pokrije ostatak | `Paid`, `balanceDue = 0` |

### Frontend

- Lista: API, paginacija UI, **nema** olovke/kante
- Nova uplata: dropdown narudžbi nije prazan
- Odabir narudžbe mijenja proizvode
- Keš i Kartica postoje
- Sačuvaj disabled dok forma nije validna
- Toast uspjeh/greška
- Povratak na listu, vidi se nova uplata
- Network: `paging.page`, ne `PageNumber`
- Network POST body: `items[].productId` broj, `nacinPlacanja` 1 ili 2

---

## 13. Najčešće greške i debug

| Greška | Simptom | Šta uraditi |
|--------|---------|-------------|
| Nema `UplataLinijaEntity` | Ne možeš snimiti stavke | Faza B |
| Zaboravljena migracija | SQL greška / tabela ne postoji | `dotnet ef migrations add` |
| `DbSet` samo u Context, ne u interfejsu | Handler ne kompajlira `ctx.UplataLinije` | dodaj u `IAppDbContext` |
| Cijena s popustom (`Total`) | Pogrešan `UkupanIznos` | `Product.Price` / `UnitPrice` |
| Ne ažuriraš Order | Status ostaje Draft/Confirmed | korak 7 u Handleru |
| Logika samo na FE | Swagger POST ne mijenja narudžbu | sve u Handleru |
| Nema `formControlName` | `form.value` prazan, Sačuvaj čudan | Faza G5 |
| `narudzbe = []` | Prazan dropdown | `listWithItems` u `ngOnInit` |
| `Paging.PageNumber` | Paginacija ne mijenja rezultat | `buildHttpParams` + `paging.page` |
| Nema `mat-option` za način | Ne možeš odabrati Keš/Kartica | `nacinPlacanjaOptions` |
| `product.id` umjesto `productId` | `productId: undefined` u POST | uskladi model s backendom |
| Update/Delete kolone | Gubiš vrijeme | zadatak ih ne traži |
| Radiš Fakture | Pogrešan modul | sidebar: **Uplata (Modul 2)** |
| 5% popusta iz Create Order | Iznos premalen | ne kopiraj taj dio |
| Dva `SaveChanges` | Pola stanja ako drugi padne | jedan Save na kraju |
| `nacinPlacanja: "1"` string | Enum se ne veže | `[value]="n.id"` broj |

### Debug redoslijed

1. Swagger POST — radi li backend sam?
2. Network payload — šta Angular šalje?
3. `console.log(this.form.value, this.form.invalid)`
4. `GET /Orders/{id}` poslije uplate
5. Uporedi s `CreateOrderCommandHandler` (struktura, ne popust) i `products.component.ts` (paginacija)

---

## 14. Završna checklista prije predaje

### Backend

- [ ] `UplataLinijaEntity` + `Linije` na `UplataEntity`
- [ ] EF config 1:N + `DbSet` u Context **i** `IAppDbContext`
- [ ] Migracija dodana, API se diže
- [ ] Create Command prima roditelja + `Items`
- [ ] Validator: obavezna polja, barem jedna stavka
- [ ] Handler: proizvod iz narudžbe, merge, cijena **bez** popusta, `UkupanIznos`
- [ ] Order: `TotalAmountPaid`, `BalanceDue`, `PartiallyPaid` / `Paid`
- [ ] Jedan `SaveChangesAsync`
- [ ] POST u `UplateController`
- [ ] Swagger scenariji gore prolaze
- [ ] Nema Update/Delete uplate
- [ ] Nisi dirala zalihe proizvoda ni Fakture

### Frontend

- [ ] `create()` + ispravan `list()` s `buildHttpParams`
- [ ] Lista nasljeđuje `BaseListPagedComponent` + `app-fit-paginator-bar`
- [ ] Tabela bez edit/delete
- [ ] `listWithItems` puni dropdown
- [ ] Svi `formControlName`
- [ ] Keš/Kartica opcije
- [ ] Proizvodi samo iz odabrane narudžbe; ispravna imena polja (`productId`)
- [ ] Validators + disabled Sačuvaj
- [ ] Submit + toast + povratak na listu

---

## 15. Kako razmišljati na ispitu

```
┌─────────────────────────────────────────────────────────────┐
│  1. Pročitaj zadatak. Napiši na papir:                      │
│     Entiteti: Uplata, UplataLinija, Order (update)          │
│     Operacije: Lista + Create (NE edit/delete)              │
│     Posebno: FormArray, merge, cijena bez popusta, status   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Otvori UplataEntity, OrderEntity, uplata-add,           │
│     UplateController, products.component (paginacija).      │
│     Šta postoji? Šta je prazno/pokvareno?                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Nacrtaj: Order 1—N Uplata 1—N Linija → Product          │
│            Order 1—N OrderItem → Product                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Plan: entitet → migracija → Handler → Swagger           │
│           → lista paginacija → forma binding → test         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. Kod. Prvo ono bez čega ostalo ne radi.                  │
└─────────────────────────────────────────────────────────────┘
```

### Mantra

> Master-detail = jedan roditelj, više djece — u bazi, u Commandu i u FormArray.

> Poslovna logika narudžbe ide u Handler, ne u Angular.

> Cijena uplate je bez popusta. `OrderItem.Total` je zamka.

> Paginacija i `formControlName` — u starteru su namjerno pokvareni.

> Nema edit/delete. Nisu Fakture. Nisu Pošiljke.

### Kad zapneš, otvori

| Problem | Fajl |
|---------|------|
| Polja uplate | `UplataEntity.cs` |
| Kako 1:N izgleda | `OrderItemEntity` + `OrderItemConfiguration` |
| Složen Create | `CreateOrderCommandHandler.cs` (bez popusta!) |
| Lista uplata | `ListUplateQueryHandler.cs` (već gotova) |
| Narudžbe + proizvodi | `ListOrdersWithItemsQueryDto.cs` + `OrdersApiService.listWithItems` |
| Paginacija UI | `products.component.ts/html` |
| FormArray skelet | `uplata-add.component.ts` — nastavi, ne kreći od nule |
| Query string | `build-http-params.ts` |

---

## 16. Rečnik pojmova

Samo pojmovi koji se **stvarno** koriste u ovom modulu:

| Pojam | Jednostavno |
|-------|-------------|
| **Master-detail** | Jedan glavni zapis + više stavki. Uplata + linije. |
| **FormArray** | Lista `FormGroup`-ova koju korisnik može širiti (`addItem`). |
| **1:N** | Jedna uplata ima više linija. FK `UplataId` na djetetu. |
| **Linija uplate** | Jedan red: proizvod + količina + način plaćanja. |
| **Merge** | Sabiranje količina kad su proizvod i način plaćanja isti. |
| **CQRS Command** | `CreateUplataCommand` — jedini write u ovom modulu. |
| **Handler** | Tu računaš iznos i mijenjaš narudžbu. |
| **UkupanIznos** | Zbroj linija; **ne** unosi ga korisnik. |
| **TotalAmountPaid** | Koliko je narudžba već plaćena. |
| **BalanceDue** | Koliko još duguje (`TotalAmount − TotalAmountPaid`). |
| **PartiallyPaid / Paid** | Statusi narudžbe poslije uplate. |
| **Bez popusta** | `Price` / `UnitPrice`, ne `Total`. |
| **Include / ThenInclude** | Učitaj Order + Items + Product u jednom upitu. |
| **GroupBy** | LINQ za merge. |
| **PageRequest.Page** | Broj stranice. Starter šalje krivi `PageNumber`. |
| **listWithItems** | Narudžbe sa stavkama, za dropdown proizvoda. |
| **Cascade** | Brisanje uplate briše linije (EF veza). |
| **Restrict** | Ne briši proizvod dok postoji linija. |
| **Transakcija** | Jedan `SaveChangesAsync` = sve ili ništa. |

---

## Dodatni resursi u ovom projektu

| Fajl | Za šta |
|------|--------|
| `RS1_Modul1_Vodic.md` | CQRS, API servis, paginacija, toast — osnove |
| `CreateOrderCommandHandler.cs` | Handler s više entiteta (ignoriši popust) |
| `OrderItemConfiguration.cs` | Uzor 1:N |
| `ListUplateQueryHandler.cs` | Lista — već gotova |
| `ListOrdersWithItemsQueryHandler.cs` | Šta FE dobije za dropdown |
| `products.component.ts` | Uzor paginacije |
| `uplata-add.component.ts` | FormArray — nastavi odatle |
| `api-services/readme.md` | Pravila tankog API servisa |

---

*Vodič je namijenjen pripremi RS1 ispita — Modul 2 (februar, Uplate / master-detail). Modul 1 su Pošiljke. Januarski ispit (Fakture / Dostavljač) nije ovaj zadatak.*
