import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { IOurClient, IOurClientCreate, IOurClientUpdate } from './ourclient.interface';
import { API } from '../../core/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class OurClientService {
  private apiService = inject(ApiService);

  /**
   * Get all our clients with pagination and filtering
   */
  getAllOurClients(params: any): Observable<any> {
    return this.apiService.get(API.OUR_CLIENTS.SEARCH, params);
  }

  /**
   * Get a specific our client by ID
   */
  getOurClient(id: number): Observable<IOurClient> {
    return this.apiService.get(API.OUR_CLIENTS.BY_ID(id));
  }

  /**
   * Create a new our client
   */
  createOurClient(ourClient: IOurClientCreate): Observable<IOurClient> {
    return this.apiService.post(API.OUR_CLIENTS.BASE, ourClient);
  }

  /**
   * Update an existing our client
   */
  updateOurClient(ourClient: IOurClientUpdate): Observable<IOurClient> {
    return this.apiService.put(API.OUR_CLIENTS.BASE, ourClient);
  }

  /**
   * Delete an our client by ID
   */
  deleteOurClient(id: number): Observable<any> {
    return this.apiService.delete(API.OUR_CLIENTS.BASE, id.toString());
  }
}