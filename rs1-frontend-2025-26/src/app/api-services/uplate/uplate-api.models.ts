import { PageResult } from '../../core/models/paging/page-result';

// === ENUMS ===

/**
 * Nacin placanja enum
 * Corresponds to: NacinPlacanjaType.cs
 */
export enum NacinPlacanjaType {
  /** Placanje gotovinom (kes) */
  Kes = 1,
  /** Placanje karticom */
  Kartica = 2
}

// === QUERIES (READ) ===

/**
 * Response item for GET /Uplate
 * Corresponds to: ListUplateQueryDto.cs
 */
export interface ListUplateQueryDto {
  id: number;
  brojUplate: string;
  orderId: number;
  orderReferenceNumber: string;
  napomena: string | null;
  ukupanIznos: number;
  datumKreiranja: string; // ISO date string
}

/**
 * Paged response for GET /Uplate
 */
export type ListUplateResponse = PageResult<ListUplateQueryDto>;


