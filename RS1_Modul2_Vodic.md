# RS1 — Modul 2 — Kompletni vodič za pripremu ispita

> **Napomena:** Ovaj dokument je učeni materijal, ne gotovo rješenje. Cilj je da razumiješ logiku i sama napišeš kod na ispitu.

---

## Sadržaj

1. [Uvod — šta je Modul 2?](#uvod--šta-je-modul-2)
2. [Razlika između Modula 1 i Modula 2](#razlika-između-modula-1-i-modula-2)
3. [Kako je organizovan tvoj projekat?](#kako-je-organizovan-tvoj-projekat)
4. [Mapa pojmova](#mapa-pojmova)
5. [Opšta strategija za ispit](#opšta-strategija-za-ispit)
6. [Zadatak — Upravljanje uplatama (master-detail)](#zadatak--upravljanje-uplatama-master-detail)
7. [Rečnik pojmova](#rečnik-pojmova)
8. [Kako razmišljati na ispitu](#kako-razmišljati-na-ispitu)

---

## Uvod — šta je Modul 2?

**Modul 2** ispita iz Razvoja softvera I fokusiran je na **napredniju funkcionalnost** — upravljanje **uplatama** (Payments) u Market aplikaciji.

Za razliku od Modula 1 (gdje si radila klasičan CRUD za pošiljke), ovdje je fokus na:

| Aspekt | Modul 2 |
|--------|---------|
| **Glavni entitet** | `Uplata` (uplata za narudžbu) |
| **Posebnost** | **Master-detail** forma — jedna uplata ima više **linija/stavki** |
| **Poslovna logika** | Kreiranje uplate **mijenja stanje narudžbe** (iznos plaćen, dug, status) |
| **Lista** | Samo prikaz + paginacija — **nema** edit/delete u tabeli |
| **Dodavanje** | Kompleksna forma s dinamičkim stavkama |

Na ispitu piše: **„Zadatak 2 — Napredne funkcionalnosti — Upravljanje uplatama"**. To je zadatak **drugog modula**, ne drugi zadatak iz Modula 1.

---

## Razlika između Modula 1 i Modula 2

| | Modul 1 (Pošiljke) | Modul 2 (Uplate) |
|---|-------------------|------------------|
| Operacije | Create, Read, Update, Delete | **Create + Read** (lista) |
| Forma | Jednostavna (3–4 polja) | **Roditelj + djeca** (uplata + stavke) |
| Veza s drugim entitetom | Samo FK na narudžbu | FK + **ažuriranje narudžbe** |
| Paginacija | Da | Da — **posebno obrati pažnju** |
| Modal za brisanje | Da | **Ne treba** (nema brisanja) |
| Novi entitet u bazi | Ne (već postoji) | **Da** — `UplataLinija` (linija uplate) |

Ako si riješila Modul 1, već znaš CQRS, Reactive Forms i API servise. Modul 2 gradi na tome, ali dodaje **relaciju 1:N** i **poslovnu logiku**.

---

## Kako je organizovan tvoj projekat?

### Dva projekta

```
2026-02-16/
├── rs1_backend-2025-26/     ← Backend (.NET Web API)
└── rs1-frontend-2025-26/  ← Frontend (Angular)
```

### Backend — gdje šta tražiti

| Šta tražiš | Gdje je | Putanja |
|------------|---------|---------|
| **Entitet Uplata** | Domain | `Market.Domain/Entities/Sales/UplataEntity.cs` |
| **Entitet Narudžba** | Domain | `Market.Domain/Entities/Sales/OrderEntity.cs` |
| **Stavka narudžbe** | Domain | `Market.Domain/Entities/Sales/OrderItemEntity.cs` |
| **Način plaćanja (enum)** | Domain | `Market.Domain/Entities/Sales/NacinPlacanjaType.cs` |
| **Status narudžbe (enum)** | Domain | `Market.Domain/Entities/Sales/OrderStatusType.cs` |
| **DbContext** | Infrastructure | `Market.Infrastructure/Database/DatabaseContext.cs` |
| **Interfejs baze** | Application | `Market.Application/Abstractions/IAppDbContext.cs` |
| **EF konfiguracija Uplate** | Infrastructure | `Market.Infrastructure/Database/Configurations/Sales/UplataConfiguration.cs` |
| **Lista uplata (CQRS)** | Application | `Market.Application/Modules/Sales/Uplate/Queries/List/` |
| **Kontroler** | API | `Market.API/Controllers/UplateController.cs` |
| **Narudžbe sa stavkama** | Application | `Market.Application/Modules/Sales/Orders/Queries/ListWithItems/` |
| **Kontroler narudžbi** | API | `Market.API/Controllers/OrdersController.cs` |
| **Seed podaci** | Infrastructure | `Market.Infrastructure/Database/Seeders/DynamicDataSeeder.cs` |

### Frontend — gdje šta tražiti

| Šta tražiš | Gdje je | Putanja |
|------------|---------|---------|
| **Lista uplata** | Admin | `src/app/modules/admin/uplate/uplate.component.*` |
| **Dodavanje uplate** | Admin | `src/app/modules/admin/uplate/uplata-add/` |
| **API servis uplata** | api-services | `src/app/api-services/uplate/` |
| **API servis narudžbi** | api-services | `src/app/api-services/orders/` |
| **Rute** | Admin | `src/app/modules/admin/admin-routing-module.ts` |
| **Sidebar** | Admin | `src/app/modules/admin/admin-layout/admin-layout.component.html` |
| **Toast** | Core | `src/app/core/services/toaster.service.ts` |
| **Bazna klasa za paginaciju** | Core | `src/app/core/components/base-classes/base-list-paged-component.ts` |
| **Primjer liste s paginacijom** | Admin | `src/app/modules/admin/catalogs/products/products.component.ts` |

### Šta starter već ima

| Već postoji | Još nije gotovo (tvoj posao) |
|-------------|------------------------------|
| `UplataEntity` (bez kolekcije linija) | Kreirati `UplataLinijaEntity` + relacija 1:N |
| `ListUplateQuery` + Handler + Controller GET | `CreateUplataCommand` + Handler + Validator |
| `UplateController` (samo GET) | POST endpoint u kontroleru |
| `UplateApiService.list()` | `create()` metoda u API servisu |
| HTML lista i forma (izgled) | Logika, binding, validacija |
| `FormArray` u `uplata-add` (prazan okvir) | Učitavanje narudžbi, submit, validatori |
| `Orders/with-items` endpoint | Povezati ga u `uplata-add` |
| Demo seed (3 uplate bez linija) | Seed s linijama i ispravnim `UkupanIznos` |

### Šta je „pokvareno" u starteru (profesor to eksplicitno navodi)

1. **`UplataEntity` nema kolekciju linija** — moraš dodati novi entitet i vezu 1:N.
2. **`narudzbe` u `uplata-add` je prazan niz** — moraš učitati preko API-ja.
3. **Paginacija na listi ne radi** — učitava se `page 1, size 100` bez UI kontrole.
4. **`mat-select` za način plaćanja je prazan** — nema `mat-option`.
5. **Inputi nemaju `formControlName`** — forma nije povezana s HTML-om.
6. **Seed uplate nemaju linije** — služe samo za test liste; `UkupanIznos` treba računati na backendu.

---

## Mapa pojmova

Ako si na vježbama čula WinForms pojmove, evo kako odgovaraju **ovom** projektu:

| Stari pojam | U tvom projektu |
|-------------|-----------------|
| Forma | Angular komponenta (`uplate`, `uplata-add`) |
| ComboBox | `mat-select` + `mat-option` |
| DataGridView | `mat-table` |
| BindingSource | `FormGroup` / `FormArray` (Reactive Forms) |
| Data Binding | `formControlName`, `{{ uplata.brojUplate }}` |
| MessageBox | `ToasterService` (toast poruka) |
| Event Handler | Metoda na `(click)`, `(selectionChange)`, `(ngSubmit)` |
| Repository | Nema — koristiš `IAppDbContext` u Handleru |

---

## Opšta strategija za ispit

### Preporučeni redoslijed

```
1. Pročitaj cijeli zadatak — posebno poslovnu logiku
2. Domain: novi entitet UplataLinija + veza na Uplatu
3. Infrastructure: EF konfiguracija + migracija + DbSet
4. Backend: Create Command + Handler (najteži dio!)
5. Test u Swaggeru: POST uplata → provjeri narudžbu u bazi
6. Frontend: popravi listu (paginacija)
7. Frontend: popravi add formu (učitaj narudžbe, binding, submit)
8. Ručni test cijelog toka
```

### Zašto prvo entitet i baza?

Bez `UplataLinija` u bazi ne možeš snimiti stavke. Bez Create Handlera frontend nema kuda slati podatke. **Logika narudžbe mora biti na backendu** — frontend samo šalje podatke.

---

# Zadatak — Upravljanje uplatama (master-detail)

---

## 1. Analiza zadatka

### Kako pravilno pročitati zadatak?

Pročitaj tekst **tri puta**:

1. **Prvo čitanje** — šta korisnik radi (klikne, vidi, unese)?
2. **Drugo čitanje** — koja polja postoje i šta je obavezno?
3. **Treće čitanje** — šta se dešava u **pozadini** (baza, narudžba, izračuni)?

Podvuci rečenice koje počinju s: *„automatski"*, *„mora"*, *„potrebno je"*, *„ažurira se"*.

### Šta profesor zapravo traži?

#### A) Lista uplata (Read)

- Tabelarni prikaz svih uplata.
- Kolone: **broj uplate**, **broj narudžbe**, **datum kreiranja**, **ukupan iznos**.
- **Paginacija** — korisnik mijenja stranicu i broj zapisa po stranici.
- Dugme **„+ Nova uplata"** gore desno.
- **NE** dodavati kolone za edit i delete.

#### B) Dodavanje uplate (Create) — master-detail forma

**Roditelj (uplata):**

| Polje | Obavezno? |
|-------|-----------|
| Broj uplate | Da |
| Narudžba (dropdown) | Da |
| Napomena | Ne |

**Djeca (stavke uplate — linije):**

Svaka uplata mora imati **barem jednu** stavku. Svaka stavka ima:

| Polje | Obavezno? | Napomena |
|-------|-----------|----------|
| Proizvod | Da | Samo proizvodi iz **odabrane narudžbe** |
| Količina | Da | Koliko komada se plaća |
| Način plaćanja | Da | Enum: **Keš** ili **Kartica** |

Korisnik može dodavati i uklanjati stavke dugmetom „Dodaj stavku".

#### C) Poslovna logika (najvažnije!)

Kad se uplata **kreira**, sistem mora:

1. **Izračunati ukupan iznos uplate** na osnovu:
   - odabranih proizvoda
   - količine
   - **jedinične cijene proizvoda** (bez popusta!)

2. **Ažurirati narudžbu:**
   - `TotalAmountPaid` += iznos nove uplate
   - `BalanceDue` = `TotalAmount` − `TotalAmountPaid`
   - Ako `BalanceDue > 0` → status = **PartiallyPaid**
   - Ako `BalanceDue == 0` → status = **Paid**

3. **Pravila spajanja linija:**
   - Isti proizvod + **isti** način plaćanja → **saberi količine**, jedna linija
   - Isti proizvod + **različit** način plaćanja → **odvojene** linije

#### D) Opšti zahtjevi (vrijede i ovdje)

- Backend: **CQRS**
- Frontend: **Reactive Forms**
- **Toast** na uspjeh/grešku
- **Paginacija** na listi
- Dizajn nije bitan — funkcionalnost jeste

### Ključne riječi za prepoznavanje

| Riječ u zadatku | Šta znači za tebe |
|-----------------|-------------------|
| **Master-detail** / **parent-child** | Jedna uplata, više stavki — `FormArray` na FE, 1:N u bazi |
| **Linija uplate** | Novi entitet `UplataLinijaEntity` |
| **PartiallyPaid** / **Paid** | Mijenjaš `Order.Status` u Handleru |
| **BalanceDue** | Računaš i upisuješ u `OrderEntity` |
| **Bez popusta** | Koristiš cijenu proizvoda (`Product.Price` ili `UnitPrice`), ne `OrderItem.Total` |
| **Paginacija** | `BaseListPagedComponent` na listi |
| **Reactive Forms** | `FormGroup` + `FormArray` + `Validators` |
| **Nije potrebno** (edit/delete) | Ne gubi vrijeme na Update/Delete |

### Redoslijed rada

```
Baza (entitet + migracija)
    → Backend Create (logika!)
        → Swagger test
            → Frontend lista (paginacija)
                → Frontend forma (master-detail)
                    → Cijeli tok
```

### Na šta posebno obratiti pažnju?

1. **Cijena bez popusta** — česta zamka; ne uzimaj `OrderItem.Total`.
2. **Barem jedna stavka** — validacija na BE i FE.
3. **Proizvod mora biti iz narudžbe** — validacija u Handleru.
4. **Spajanje linija** — radi prije snimanja.
5. **Paginacija** — ne hardkodiraj `pageSize: 100`.
6. **`formControlName`** — bez toga forma ne radi.
7. **Nema edit/delete** — ne troši vrijeme na to.

---

## 2. Analiza template projekta

### Struktura projekta — uloga svakog dijela

```
┌─────────────────────────────────────────────────────────┐
│  Market.Domain          → Entiteti (šta postoji u bazi) │
│  Market.Application     → CQRS (logika, validacija)     │
│  Market.Infrastructure  → Baza, EF, migracije, seed     │
│  Market.API             → HTTP endpointi (Controller)  │
└─────────────────────────────────────────────────────────┘
         ↕ HTTP
┌─────────────────────────────────────────────────────────┐
│  api-services           → Tanak sloj (HTTP pozivi)      │
│  modules/admin/uplate   → Komponente (UI + logika)      │
└─────────────────────────────────────────────────────────┘
```

### Koji projekat se pokreće?

| Projekt | Kako pokrenuti | Za šta |
|---------|----------------|--------|
| Backend | Visual Studio → F5 ili `dotnet run` u `Market.API` | API + Swagger |
| Frontend | Terminal u `rs1-frontend-2025-26` → `npm install` pa `npm start` | Angular app |

Oba moraju raditi istovremeno.

### Gdje je Model?

**Model** = entitet u Domain sloju.

Za ovaj zadatak pogledaj:

- `UplataEntity.cs` — roditelj (broj, narudžba, napomena, ukupan iznos)
- `OrderEntity.cs` — polja `TotalAmountPaid`, `BalanceDue`, `Status`
- `OrderItemEntity.cs` — stavke narudžbe (koji proizvodi pripadaju narudžbi)
- `NacinPlacanjaType.cs` — enum Keš/Kartica

**Novi model koji ti kreiraš:** `UplataLinijaEntity` (stavka uplate).

### Gdje je DbContext?

- `DatabaseContext.cs` — implementacija
- `IAppDbContext.cs` — interfejs koji Handler koristi

Trenutno postoji `DbSet<UplataEntity> Uplate`. Trebat će dodati `DbSet` za linije.

### Gdje su „forme"?

U Angularu nema `.cs` formi — **komponente su forme:**

- `uplate.component` = lista
- `uplata-add.component` = forma za dodavanje

HTML je u `.html`, logika u `.ts`.

### Gdje su event handleri?

U `.ts` fajlu komponente, povezani u HTML-u:

| HTML | Metoda u .ts |
|------|--------------|
| `(click)="onNovaUplata()"` | Otvara stranicu za novu uplatu |
| `(click)="onSubmit()"` | Šalje formu |
| `(selectionChange)="onOrderChange($event.value)"` | Mijenja listu proizvoda |
| `(click)="addItem()"` | Dodaje stavku u FormArray |

### Kako pronaći mjesto za novi kod?

**Pravilo:** Nađi najsličniji gotov primjer, pa prati lanac.

| Šta radiš | Gdje gledaš uzor |
|-----------|------------------|
| Novi entitet | `OrderItemEntity` (stavka unutar roditelja) |
| EF konfiguracija 1:N | `OrderShipmentConfiguration` (HasOne/WithMany) |
| Create Command | `CreateProductCommand` / `CreateOrderCommand` |
| Lista s paginacijom | `products.component.ts` + `BaseListPagedComponent` |
| FormArray | `uplata-add.component.ts` (već započeto!) |
| Učitavanje narudžbi | `products-add` učitava kategorije — isti princip |

---

## 3. Koraci rješavanja od početka do kraja

---

### FAZA A — Razumijevanje postojećih entiteta

#### Korak A1: Otvori `UplataEntity.cs`

- **Pregledaj:** `BrojUplate`, `OrderId`, `Napomena`, `UkupanIznos`
- **Razmisli:** Gdje će živjeti stavke? → Treba kolekcija `Linije` ili zaseban entitet s `UplataId`
- **Zašto važno:** Bez ovoga ne znaš šta širiš u bazi

#### Korak A2: Otvori `OrderEntity.cs`

- **Pregledaj:** `TotalAmount`, `TotalAmountPaid`, `BalanceDue`, `Status`
- **Razmisli:** Ova polja **ti ažuriraš** u Create Handleru
- **Zašto važno:** Ovo je srž poslovne logike zadatka

#### Korak A3: Otvori `OrderStatusType.cs`

- **Pronađi:** `PartiallyPaid = 6` i `Paid = 3`
- **Zašto važno:** Znaš koje vrijednosti postaviti nakon uplate

#### Korak A4: Otvori `NacinPlacanjaType.cs`

- **Pronađi:** `Kes = 1`, `Kartica = 2`
- **Zašto važno:** Isti enum koristiš na BE i FE (`uplate-api.models.ts`)

---

### FAZA B — Domain: novi entitet UplataLinija

#### Korak B1: Kreiraj `UplataLinijaEntity.cs` u `Market.Domain/Entities/Sales/`

- **Šta treba imati (razmisli sama o imenima):**
  - Veza na uplatu (`UplataId` + navigacija)
  - Koji proizvod (`ProductId`)
  - Količina
  - Način plaćanja (`NacinPlacanjaType`)
  - Možda iznos te linije (količina × cijena) — olakšava prikaz i debug
- **Zašto:** Stavka ne može postojati bez roditeljske uplate
- **Uzor:** Pogledaj kako `OrderItemEntity` povezuje `OrderId` i `ProductId`

#### Korak B2: Proširi `UplataEntity`

- Dodaj kolekciju linija (npr. `IReadOnlyCollection<UplataLinijaEntity> Linije`)
- **Zašto:** EF i poslovna logika trebaju znati za 1:N vezu

---

### FAZA C — Infrastructure: baza podataka

#### Korak C1: Kreiraj `UplataLinijaConfiguration.cs`

- **Otvori uzor:** `UplataConfiguration.cs`, `OrderItemConfiguration.cs`
- **Postavi:** tabela, max dužine, FK na `Uplata` i `Product`
- **Delete behavior:** obično `Restrict` (ne briši uplatu ako ima linije bez plana)

#### Korak C2: Dodaj `DbSet` u `DatabaseContext.cs` i `IAppDbContext.cs`

- **Zašto:** Handler mora moći pristupiti linijama kroz `ctx`

#### Korak C3: Napravi migraciju

- U terminalu (iz Infrastructure projekta) pokreni `dotnet ef migrations add ...`
- Zatim `dotnet ef database update` (ili pokreni app ako se migracija radi automatski)
- **Pazi:** Na ispitu pitaj profesora da li treba migracija ili je baza već spremna

#### Korak C4: Ažuriraj seed (opciono ali preporučeno)

- **Otvori:** `DynamicDataSeeder.cs` → `SeedUplateAsync`
- **Problem:** Demo uplate nemaju linije, `UkupanIznos` je hardkodiran
- **Rješenje:** Kreiraj linije i izračunaj `UkupanIznos` iz njih
- **Zašto:** Da lista ima smislen podatak za test

---

### FAZA D — Backend: Create Command (srž zadatka)

#### Korak D1: Kreiraj folder `Commands/Create/` u `Modules/Sales/Uplate/`

Struktura kao kod Products:

- `CreateUplataCommand.cs`
- `CreateUplataCommandHandler.cs`
- `CreateUplataCommandValidator.cs`

#### Korak D2: CreateUplataCommand — šta prima API?

Roditelj:

- `BrojUplate`
- `OrderId`
- `Napomena` (opciono)

Djeca — **lista stavki**, svaka s:

- `ProductId`
- `Kolicina` (ili `Quantity` — uskladi s konvencijom projekta)
- `NacinPlacanja`

**Zašto lista u Commandu:** Jedan HTTP POST šalje cijelu uplatu odjednom.

#### Korak D3: CreateUplataCommandValidator

- `BrojUplate` — obavezno, max dužina iz `UplataEntity.Constraints`
- `OrderId` — obavezno, > 0
- `Napomena` — max dužina ako nije prazna
- **Stavke** — lista ne smije biti prazna
- Svaka stavka: proizvod obavezan, količina >= 1, način plaćanja obavezan

#### Korak D4: CreateUplataCommandHandler — logika korak po korak

Ovo je **najvažniji** dio cijelog modula. Razmisli o ovom redoslijedu:

**1. Učitaj narudžbu**

- Pronađi `Order` po `OrderId` (s `Items` i `Product` ako treba)
- Ako ne postoji → `MarketNotFoundException`

**2. Validiraj stavke**

- Svaki `ProductId` mora postojati u `Order.Items`
- Količina ne smije biti veća od količine u narudžbi (razmisli: da li smiješ platiti više nego što je naručeno? Zadatak implicira da ne)

**3. Spoji linije (merge pravilo)**

- Grupiraj stavke po `(ProductId, NacinPlacanja)`
- Za iste parove — zbroji količine u jednu liniju
- Za isti proizvod, različit način — ostavi odvojeno

**4. Izračunaj iznos svake linije**

- Uzmi **cijenu proizvoda bez popusta** (iz `Product.Price` ili `OrderItem.UnitPrice` — pročitaj zadatak pažljivo: piše „jedinična cijena na nivou proizvoda")
- Iznos linije = količina × jedinična cijena

**5. Izračunaj `UkupanIznos` uplate**

- Zbroj svih linija

**6. Kreiraj `UplataEntity`**

- Popuni polja, dodaj linije u kolekciju

**7. Ažuriraj `OrderEntity`**

- `TotalAmountPaid` += `UkupanIznos`
- `BalanceDue` = `TotalAmount` − `TotalAmountPaid`
- Status:
  - `BalanceDue > 0` → `PartiallyPaid`
  - `BalanceDue == 0` → `Paid` (i možda `PaidAtUtc`?)

**8. Snimi**

- `ctx.Uplate.Add(uplata)` ili dodaj linije zasebno
- `SaveChangesAsync`
- Vrati novi `Id`

**Na šta paziti:**

- Sve u **jednoj transakciji** (`SaveChangesAsync` jednom na kraju)
- Zaokruživanje decimala — budi konzistentna
- Ne ažuriraj narudžbu na frontendu — samo na backendu!

#### Korak D5: Dodaj POST u `UplateController.cs`

- **Uzor:** `ProductsController.Create`
- Prima `CreateUplataCommand`, vraća `id`

#### Korak D6: Test u Swaggeru

- POST uplata s 1–2 stavke
- GET lista — vidi li se nova uplata?
- Provjeri u bazi ili GET narudžbe — jesu li `TotalAmountPaid`, `BalanceDue`, `Status` ispravni?

---

### FAZA E — Frontend: API sloj

#### Korak E1: Proširi `uplate-api.models.ts`

- Dodaj interface za stavku u Create commandu
- Dodaj `CreateUplataCommand` interface
- Provjeri da enum `NacinPlacanjaType` odgovara backendu

#### Korak E2: Proširi `uplate-api.service.ts`

- Dodaj metodu `create(payload)` → `POST /Uplate`
- **Uzor:** `products-api.service.ts` → `create()`
- Bez toast-a u servisu — to radi komponenta

---

### FAZA F — Frontend: Lista uplata (paginacija)

#### Korak F1: Otvori `uplate.component.ts`

- **Problem:** Ručno poziva `list(1, 100)` — nema prave paginacije
- **Rješenje:** Naslijedi `BaseListPagedComponent` (kao `products.component.ts`)

#### Korak F2: Prilagodi API servis

- Umjesto `list(pageNumber, pageSize)` koristi `ListUplateRequest` s `BasePagedQuery` i `buildHttpParams`
- **Zašto:** Konzistentno s ostatkom projekta

#### Korak F3: Implementiraj `loadPagedData()`

- Pozovi API s `this.request`
- U `next` → `handlePageResult(response)`

#### Korak F4: Dodaj paginaciju u HTML

- **Uzor:** `products.component.html` — „Stranica X od Y", dugmad Prethodna/Sljedeća, izbor broja po stranici
- **Profesor posebno naglašava paginaciju** — ne preskoči UI!

#### Korak F5: NE dodaj edit/delete kolone

- Zadatak eksplicitno kaže da nisu potrebne

---

### FAZA G — Frontend: Forma za dodavanje (master-detail)

#### Korak G1: Očitaj postojeći `uplata-add.component.ts`

- Već ima `FormGroup` s `FormArray` za `items`
- Već ima `addItem()` i `removeItem()`
- **Nedostaje:** validatori, učitavanje narudžbi, submit logika

#### Korak G2: Učitaj narudžbe u `ngOnInit`

- Injektuj `OrdersApiService`
- Pozovi `listWithItems()` s velikim page size (`largePaging` helper)
- Spremi u `this.narudzbe`
- **Zašto `with-items`:** Treba ti lista proizvoda po narudžbi za dropdown

#### Korak G3: Poveži HTML s formom (`formControlName`)

Starter **nema** binding — moraš dodati:

| Polje | formControlName |
|-------|-----------------|
| Broj uplate | `brojUplate` |
| Narudžba | `orderId` |
| Napomena | `napomena` |
| Proizvod (stavka) | `productId` |
| Količina | `kolicina` |
| Način plaćanja | `nacinPlacanja` |

**Zašto:** Bez `formControlName` Angular ne zna šta je u formi — `form.invalid` ne radi ispravno.

#### Korak G4: Popuni `mat-select` za način plaćanja

- Dodaj `mat-option` za Keš i Kartica
- Vrijednosti: brojevi iz enuma (1 i 2)
- Možeš imati niz `nacinPlacanjaOptions` u komponenti s `id` i `name`

#### Korak G5: Dodaj Validators u `FormGroup`

- `brojUplate`: `Validators.required`
- `orderId`: `Validators.required`
- Stavke: `productId`, `kolicina` (min 1), `nacinPlacanja` — required
- **Zašto:** Dugme Sačuvaj koristi `[disabled]="form.invalid"`

#### Korak G6: `onOrderChange` — filtriraj proizvode

- Kad korisnik odabere narudžbu, postavi `selectedOrderItems`
- Dropdown proizvoda prikazuje samo `selectedOrderItems`
- **Pazi:** Imena polja u DTO-u — backend šalje `product.productId`, frontend template možda očekuje `product.id`. **Uskladi** ih!

#### Korak G7: Implementiraj `onSubmit()`

Redoslijed:

1. `form.markAllAsTouched()`
2. Ako `form.invalid` → return
3. `isSaving = true`
4. Sastavi `CreateUplataCommand` iz `form.value`
5. Pozovi `uplateApiService.create(command).subscribe(...)`
6. Uspjeh → `toaster.success(...)` + navigacija na `/admin/uplate`
7. Greška → `toaster.error(...)` + `isSaving = false`

**Napomena o merge pravilu:** Možeš spajati linije na frontendu prije slanja **ili** prepustiti backendu. **Sigurnije je na backendu** — tamo će profesor i testirati.

#### Korak G8: Minimalan broj stavki

- Zadatak kaže: uplata mora imati barem jednu liniju
- Ukloni početne dvije prazne stavke ako zbunjuju, ili ostavi jednu
- Validiraj da `items.length >= 1`

---

### FAZA H — Testiranje cijelog toka

#### Korak H1: Lista

- [ ] Uplate se učitavaju s API-ja (ne hardkod)
- [ ] Paginacija mijenja stranice
- [ ] Prikaz: broj, narudžba, datum, iznos

#### Korak H2: Dodavanje

- [ ] Narudžbe se učitavaju u dropdown
- [ ] Odabir narudžbe mijenja proizvode
- [ ] Način plaćanja ima opcije
- [ ] Sačuvaj disabled dok forma nije validna
- [ ] Toast na uspjeh/grešku
- [ ] Povratak na listu s novom uplatom

#### Korak H3: Poslovna logika

- [ ] Djelomična uplata → narudžba `PartiallyPaid`
- [ ] Puna uplata → narudžba `Paid`, `BalanceDue = 0`
- [ ] Isti proizvod + isti način → spojene količine
- [ ] Isti proizvod + različit način → odvojene linije

---

## 4. Objašnjenje pojmova

### LINQ

- **Šta je:** Način pisanja upita nad podacima u C#
- **Kada:** U Handleru — filtriranje, grupiranje, projekcija
- **Zašto:** Spajanje linija = `GroupBy` po proizvodu i načinu plaćanja
- **Primjer (općenito):** „Grupiraj listu knjiga po autoru i prebroji ih"

### Lambda izrazi

- **Šta je:** Kratka funkcija: `x => x.OrderId == 5`
- **Kada:** U `.Where()`, `.Select()`, `.GroupBy()`
- **Primjer:** `.Where(x => x.Kolicina > 0)`

### Include

- **Šta je:** Učitava povezane entitete iz baze u jednom upitu
- **Kada:** Kad trebaš `order.Items` i `item.Product` u Handleru
- **Primjer:** `ctx.Orders.Include(o => o.Items).ThenInclude(i => i.Product)`
- **Alternativa:** Projekcija s `Select` (kao u `ListOrdersWithItemsQueryHandler`)

### Where

- **Šta je:** Filtrira podatke
- **Kada:** „Samo narudžbe ovog korisnika", „Samo proizvodi iz narudžbe"
- **Primjer:** `.Where(x => x.OrderId == request.OrderId)`

### Select

- **Šta je:** Pretvara entitet u drugi oblik (npr. DTO)
- **Kada:** U Query Handlerima za listu
- **Primjer:** `.Select(x => new ListDto { Name = x.BrojUplate })`

### OrderBy

- **Šta je:** Sortira rezultate
- **Kada:** Lista uplata — najnovije prvo (`OrderByDescending` po datumu)
- **Primjer:** `.OrderByDescending(x => x.CreatedAtUtc)`

### Entity Framework (EF)

- **Šta je:** ORM — mapira C# klase na tabele u bazi
- **Kada:** Cijeli backend koristi EF za čitanje/pisanje
- **Zašto:** Ne pišeš SQL ručno — koristiš `ctx.Uplate`, `ctx.SaveChangesAsync()`

### DbSet

- **Šta je:** „Tabela" u kodu — `ctx.Uplate`, `ctx.Orders`
- **Kada:** Svaki Handler koji pristupa bazi

### Foreign Key (FK)

- **Šta je:** Broj koji povezuje dvije tabele
- **Kada:** `Uplata.OrderId` → `Order.Id`, `UplataLinija.UplataId` → `Uplata.Id`
- **Kako prepoznati u zadatku:** „Uplata je vezana za narudžbu"

### Navigation Property

- **Šta je:** Objektni link — `uplata.Order`, `linija.Product`
- **Kada:** Čitaš podatke povezanog entiteta bez ručnog join-a

### DTO

- **Šta je:** Klasa samo za prenos podataka kroz API
- **Kada:** `ListUplateQueryDto`, Command za Create
- **Zašto:** Ne izlažeš internu strukturu baze

### Validacija

- **Backend:** `AbstractValidator<T>` — FluentValidation
- **Frontend:** `Validators.required`, `Validators.min(1)` u FormGroup
- **Zašto oba:** FE = brz feedback, BE = sigurnost

### Event Handler

- **Šta je:** Funkcija koja reaguje na korisnikovu akciju
- **Kada:** Klik, promjena selecta, submit forme
- **Primjer:** `(click)="onSubmit()"` poziva metodu `onSubmit()` u komponenti

### ComboBox → mat-select

- **Šta je:** Padajući meni
- **Kada:** Narudžba, proizvod, način plaćanja
- **Kako prepoznati:** „Korisnik bira iz liste"

### DataGridView → mat-table

- **Šta je:** Tabela s redovima i kolonama
- **Kada:** Lista uplata

### BindingSource → FormGroup / FormArray

- **Šta je:** Izvor podataka za formu
- **Kada:** `FormGroup` za uplatu, `FormArray` za dinamičke stavke
- **Zašto FormArray:** Broj stavki nije fiksan — korisnik dodaje/uklanja

### MessageBox → ToasterService

- **Šta je:** Kratka poruka korisniku
- **Kada:** Nakon uspješnog čuvanja ili greške
- **Primjer:** `this.toaster.success('Uplata uspješno kreirana')`

### Async metode

- **Šta je:** Metode koje čekaju rezultat (baza, HTTP) bez blokiranja
- **Kada:** `async Task` u Handleru, `.subscribe()` na frontendu
- **Zašto:** API pozivi traju — ne smiješ zamrznuti UI

### Master-detail (roditelj-dijete)

- **Šta je:** Jedan glavni zapis (uplata) + više podzapisa (stavke)
- **Kada:** Forma za uplatu
- **U bazi:** 1:N relacija
- **U Angularu:** `FormGroup` + `FormArray`
- **Primjer iz života:** Račun (glava) + stavke računa (redovi)

---

## 5. Vizuelni tok izvršavanja

### 5.1 Otvaranje liste uplata

```
Korisnik klikne "Uplata (Modul 2)" u sidebaru
        ↓
Router otvara UplateComponent
        ↓
ngOnInit() → initList() → loadPagedData()
        ↓
UplateApiService.list(request)  — HTTP GET /Uplate?Paging.Page=1&...
        ↓
UplateController → ListUplateQuery → ListUplateQueryHandler
        ↓
Handler: ctx.Uplate → OrderByDescending → Select u DTO → PageResult
        ↓
Frontend: handlePageResult() → mat-table prikazuje redove
        ↓
Korisnik vidi: UPL-0001, ORD-0001, datum, 500 KM
```

**U pozadini:** Nema pisanja u bazu — samo čitanje. `AsNoTracking()` znači EF ne prati promjene (brže za listu).

---

### 5.2 Otvaranje forme za novu uplatu

```
Korisnik klikne "+ Nova uplata"
        ↓
Router → /admin/uplate/add → UplataAddComponent
        ↓
ngOnInit(): OrdersApiService.listWithItems() — HTTP GET /Orders/with-items
        ↓
OrdersController → Handler vraća narudžbe SA stavkama (proizvodi)
        ↓
narudzbe[] popunjen → mat-select za narudžbu ima opcije
        ↓
Forma prikazana: prazna polja + početne stavke u FormArray
```

**U pozadini:** Narudžbe se učitavaju jer trebaš znati koji proizvodi pripadaju kojoj narudžbi.

---

### 5.3 Popunjavanje forme

```
Korisnik unese broj uplate "UPL-0010"
        ↓
formControlName="brojUplate" → FormGroup ažuriran
        ↓
Korisnik odabere narudžbu ORD-0004
        ↓
(selectionChange) → onOrderChange(orderId)
        ↓
selectedOrderItems = proizvodi iz te narudžbe
        ↓
Dropdown proizvoda prikazuje SAMO te proizvode
        ↓
Korisnik doda stavku: Laptop × 1, Keš
        ↓
Korisnik klikne "Dodaj stavku" → addItem() → nova grupa u FormArray
        ↓
Validators provjeravaju: ako sve OK → dugme Sačuvaj aktivno
```

**U pozadini:** Reactive Forms drže stanje forme u memoriji. HTML je samo prikaz — pravi podaci su u `this.form.value`.

---

### 5.4 Čuvanje uplate

```
Korisnik klikne "Sačuvaj"
        ↓
onSubmit() → form.markAllAsTouched()
        ↓
Ako form.invalid → STOP (ne šalje se)
        ↓
Sastavi CreateUplataCommand iz form.value
        ↓
HTTP POST /Uplate → UplateController → MediatR
        ↓
ValidationBehavior → CreateUplataCommandValidator
        ↓
CreateUplataCommandHandler:
    1. Učitaj narudžbu
    2. Validiraj proizvode
    3. Spoji linije (merge)
    4. Izračunaj iznose
    5. Kreiraj Uplata + Linije
    6. Ažuriraj Order (TotalAmountPaid, BalanceDue, Status)
    7. SaveChangesAsync()
        ↓
Vraća se novi Id
        ↓
Frontend: toaster.success() + router.navigate(['/admin/uplate'])
        ↓
Lista se ponovo učitava — nova uplata vidljiva
```

**U pozadini:** Jedan `SaveChangesAsync` snima uplatu, linije i ažuriranu narudžbu u **jednoj transakciji**. Ako nešto pukne — ništa se ne snimi.

---

## 6. Najčešće greške studenata

### Gdje studenti griješe

| # | Greška | Posljedica |
|---|--------|------------|
| 1 | Zaborave `UplataLinijaEntity` | Uplata nema stavki u bazi |
| 2 | Cijena **s popustom** umjesto bez | Pogrešan `UkupanIznos` |
| 3 | Ne ažuriraju `Order` | Status narudžbe ostaje isti |
| 4 | Logika samo na frontendu | Zaobilazi se validacija — pogrešni podaci u bazi |
| 5 | Nema `formControlName` | Forma uvijek invalid ili prazna |
| 6 | `narudzbe = []` — ne učitaju API | Prazan dropdown narudžbi |
| 7 | Paginacija hardkodirana | Profesor vidi da ne radi |
| 8 | Pišu Update/Delete | Gube vrijeme — nisu potrebni |
| 9 | Pogrešno ime polja FE vs BE | 400 Bad Request |
| 10 | Zaborave migraciju | Tabela za linije ne postoji |
| 11 | `product.id` vs `product.productId` | Dropdown ne šalje ispravan ID |
| 12 | Nema validacije „proizvod iz narudžbe" | Može se platiti bilo šta |

### Kako izbjeći greške

- **Swagger prvo** — testiraj POST prije frontenda
- **Uporedi s Products** — ista struktura, druga logika
- **Čitaj exception** — `MarketNotFoundException`, `ValidationException`
- **Network tab** — vidi šta frontend šalje i šta backend vraća
- **Jedan korak = jedan test** — ne piši sve odjednom

### Kako debugovati

**1. Backend ne radi**

```
Swagger → POST /Uplate → pogledaj response body
```

- 400 = validacija — pročitaj koja polja
- 404 = narudžba/proizvod ne postoji
- 500 = greška u Handleru — čitaj stack trace u konzoli API-ja

**2. Frontend ne šalje podatke**

```
Browser F12 → Network → klikni POST zahtjev → Payload
```

- Je li `orderId` broj, ne string?
- Je li `items` niz s ispravnim poljima?

**3. Forma uvijek invalid**

```
U komponenti privremeno: console.log(this.form.value, this.form.errors)
```

- Koje polje faila? `form.get('brojUplate')?.errors`

**4. Dropdown proizvoda prazan**

- Je li `onOrderChange` pozvan?
- Ima li odabrana narudžba `items` u odgovoru API-ja?

### Kako čitati exception poruke

| Poruka | Značenje | Šta uraditi |
|--------|----------|-------------|
| `Validation failed` | Validator odbio podatke | Pročitaj koja pravila |
| `not found` | Entitet ne postoji u bazi | Provjeri Id |
| `FK constraint` | Pogrešan Foreign Key | OrderId/ProductId ne postoji |
| `NullReferenceException` | Pristup null objektu | Provjeri Include / null check |

---

## 7. Kako razmišljati na ispitu

### Kada dobiješ zadatak, uradi ovo:

---

#### KORAK 1: Pročitaj zahtjeve (5–10 minuta — ne preskači!)

**Šta uraditi:**

- Pročitaj cijeli tekst
- Podvuci: obavezna polja, automatska polja, poslovna pravila
- Napiši na papir:

```
Entiteti: Uplata, UplataLinija, Order (ažuriranje)
Operacije: Lista + Create (NE edit/delete)
Posebno: master-detail, paginacija, ažuriranje narudžbe
```

**Zašto:** 10 minuta planiranja štedi 30 minuta lutanja.

---

#### KORAK 2: Pronađi odgovarajuće klase (5 minuta)

**Šta uraditi:**

- Otvori `UplataEntity`, `OrderEntity`
- Otvori `uplate.component.ts`, `uplata-add.component.ts`
- Otvori `UplateController`, `ListUplateQueryHandler`
- Otvori `products.component.ts` kao uzor za paginaciju

**Zašto:** Vidiš šta postoji, šta nedostaje.

---

#### KORAK 3: Analiziraj veze između modela (5 minuta)

Nacrtaj na papir:

```
Order (1) ──────< (N) Uplata (1) ──────< (N) UplataLinija
  │                                              │
  │                                              └──> Product
  └──< (N) OrderItem ──> Product
```

**Pitanja koja si postavi:**

- Šta je roditelj, šta dijete?
- Koji FK gdje ide?
- Šta se mijenja na Order kad se kreira Uplata?

**Zašto:** Master-detail bez razumijevanja veza = greške u migraciji i Handleru.

---

#### KORAK 4: Isplaniraj rješenje (5 minuta)

Napiši redoslijed:

```
□ UplataLinijaEntity
□ EF config + migracija
□ Create Command/Handler/Validator
□ POST u Controller
□ Swagger test
□ API servis create()
□ Lista — paginacija
□ Forma — binding + učitaj narudžbe + submit
□ Test cijelog toka
```

**Zašto:** Štikliraš korake — vidiš napredak, ne paničiš.

---

#### KORAK 5: Tek onda počni pisati kod

**Pravilo:**

> Prvo ono bez čega ništa drugo ne radi.

To znači: **entitet → baza → Create Handler → Swagger → frontend**.

Ne počinji od HTML-a ako API ne postoji.

---

### Mantra za Modul 2

> **Master-detail = jedan roditelj, više djece — u bazi, u Commandu i u FormArray.**

> **Poslovna logika narudžbe ide u Handler, ne u Angular.**

> **Paginacija i formControlName — profesor eksplicitno traži.**

> **Nema edit/delete — ne gubi vrijeme.**

---

## Dodatni resursi u tvom projektu

| Fajl | Za šta |
|------|--------|
| `RS1_Modul1_Vodic.md` | CQRS, API servisi, Reactive Forms — osnove |
| `api-services/readme.md` | Pravila za API servise |
| `products.component.ts` | Uzor za paginaciju |
| `uplata-add.component.ts` | Već započet FormArray — nastavi odatle |
| `ListOrdersWithItemsQueryHandler.cs` | Kako učitati narudžbe sa stavkama |
| `ListUplateQueryHandler.cs` | Lista uplata — već gotova |
| `CreateOrderCommandHandler.cs` | Uzor za složeniji Handler s više entiteta |

---

*Dokument kreiran za pripremu RS1 ispita — Modul 2 (Upravljanje uplatama).*
