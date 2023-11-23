import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';


@Injectable({ providedIn: 'root' }) //Servicio disponible para toda la aplicación que use este servicio
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'YK1JG78Ce0oPo5xKyGGEn6NN2Vx18kTP'
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor(private http: HttpClient) { }

  get tagsHistory() {
    return [...this._tagsHistory]; //Spread Opeator para evitar eliminar la referencia
  }

  private organizeHistory(tag: string) {
    tag = tag.toLocaleLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0, 10)
  }

  async searchTag(tag: string): Promise<void> {
    if (tag.length === 0) return
    this.organizeHistory(tag)

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })  ///OBSERVABLE
      .subscribe(resp => {
        this.gifList = resp.data

        console.log({ gifs: this.gifList })
      })

  }
}
